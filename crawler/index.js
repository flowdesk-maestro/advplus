const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
const { analyzePublication, sendTelegramNotification } = require('./utils');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runCrawler() {
  console.log('🚀 Iniciando Crawler AdvPlus com IA e Alertas...');

  // 1. Buscar OABs para monitorar
  const { data: oabs, error: oabError } = await supabase
    .from('monitored_oabs')
    .select('*, law_offices(*)');

  if (oabError || !oabs) {
    console.error('❌ Erro ao buscar OABs:', oabError);
    return;
  }

  console.log(`🔍 Monitorando ${oabs.length} OAB(s)...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const oab of oabs) {
    console.log(`\n📌 Processando OAB/${oab.state}: ${oab.oab_number}`);

    try {
      // Mock de busca - No futuro será a navegação real
      const publications = await mockDjenSearch(oab.oab_number, oab.state);
      
      for (const pubData of publications) {
        // Verificar duplicidade
        const { data: existing } = await supabase
          .from('publications')
          .select('id')
          .eq('process_number', pubData.processNumber)
          .eq('content', pubData.content)
          .single();

        if (existing) continue;

        // Salvar publicação
        const { data: pub, error: pubErr } = await supabase
          .from('publications')
          .insert({
            law_office_id: oab.law_office_id,
            oab_id: oab.id,
            process_number: pubData.processNumber,
            tribunal: pubData.tribunal,
            content: pubData.content,
            published_at: pubData.publishedAt
          })
          .select().single();

        if (pubErr) continue;
        console.log(`✨ Nova publicação: ${pub.process_number}`);

        // --- GATILHO IA ---
        await processAIAndAlerts(pub);
      }
    } catch (err) {
      console.error(`❌ Erro na OAB ${oab.oab_number}:`, err);
    }
  }

  await browser.close();
  console.log('\n🏁 Ciclo finalizado.');
}

async function processAIAndAlerts(pub) {
  try {
    // 1. Buscar Configuração de IA
    const { data: aiConfig } = await supabase
      .from('ai_configs')
      .select('api_key, model, provider, base_url')
      .eq('law_office_id', pub.law_office_id)
      .eq('active', true)
      .single();

    if (!aiConfig || !aiConfig.api_key) {
      console.log('⚠️ IA não configurada para este escritório. Pulando análise.');
      return;
    }

    console.log(`🧠 Analisando com ${aiConfig.provider.toUpperCase()} (${aiConfig.model})...`);
    const analysis = await analyzePublication(pub.content, aiConfig.api_key, aiConfig.model, aiConfig.provider, aiConfig.base_url);

    // 2. Salvar Análise no Banco
    await supabase.from('ai_analysis').insert({
      publication_id: pub.id,
      resumo: analysis.resumo,
      prazo_dias: analysis.prazo_dias,
      classificacao: analysis.classificacao,
      providencia: analysis.providencia,
      urgente: analysis.urgente
    });

    // 3. Buscar Configuração Telegram (Pode haver múltiplos usuários no escritório)
    const { data: telegrams } = await supabase
      .from('telegram_integrations')
      .select('bot_token, chat_id')
      .eq('active', true);

    if (telegrams && telegrams.length > 0) {
      console.log(`📱 Enviando ${telegrams.length} alerta(s) via Telegram...`);
      for (const tel of telegrams) {
        if (tel.bot_token && tel.chat_id) {
          await sendTelegramNotification(
            { ...pub, ...analysis },
            tel.bot_token,
            tel.chat_id
          );
        }
      }
    }
  } catch (err) {
    console.error('❌ Erro no processamento de IA/Alerta:', err);
  }
}

async function mockDjenSearch(oab, state) {
  return [{
    processNumber: `${Math.floor(Math.random() * 1000000)}-${Math.floor(Math.random() * 99)}.2025.8.26.0001`,
    tribunal: 'TJSP',
    publishedAt: new Date().toISOString(),
    content: `Vistos. Fica a parte autora intimada na pessoa de seu advogado (OAB ${oab}/${state}) para que, no prazo de 15 (quinze) dias, apresente réplica à contestação e especifique as provas que pretende produzir.`
  }];
}

runCrawler();
