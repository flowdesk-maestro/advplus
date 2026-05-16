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
      const publications = await searchDjenReal(page, oab.oab_number, oab.state);
      
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

    let realApiKey = aiConfig.api_key;
    if (aiConfig.provider !== 'custom') {
      try {
        const { decrypt } = require('./encryption');
        realApiKey = decrypt(aiConfig.api_key);
      } catch (e) {
        console.error('❌ Falha ao descriptografar a API Key. Verifique a MASTER_ENCRYPTION_KEY.');
        return;
      }
    }

    console.log(`🧠 Analisando com ${aiConfig.provider.toUpperCase()} (${aiConfig.model})...`);
    const analysis = await analyzePublication(pub.content, realApiKey, aiConfig.model, aiConfig.provider, aiConfig.base_url);

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

async function searchDjenReal(page, oabNumber, state) {
  console.log(`🌐 Acessando o Diário de Justiça Eletrônico Nacional (PJe Comunica)...`);
  const publications = [];
  
  try {
    // 1. Acessar o portal
    await page.goto('https://comunica.pje.jus.br/', { waitUntil: 'networkidle' });

    // 2. Preencher o formulário
    // Nota: Estes seletores são baseados na estrutura padrão em Angular do portal do CNJ.
    // Podem precisar de ajustes finos dependendo de atualizações do tribunal.
    await page.fill('input[formcontrolname="oab"]', oabNumber);
    
    // Selecionar o estado (UF) no dropdown
    await page.click('mat-select[formcontrolname="ufOab"]');
    await page.click(`mat-option:has-text("${state.toUpperCase()}")`);

    // 3. Clicar em Pesquisar
    await page.click('button:has-text("Pesquisar")');

    // 4. Aguardar o carregamento dos resultados ou mensagem de "não encontrado"
    // Esperamos pelo container de resultados ou por um alerta
    await Promise.race([
      page.waitForSelector('mat-card.resultado-pesquisa', { timeout: 10000 }),
      page.waitForSelector('div.nenhum-resultado', { timeout: 10000 })
    ]).catch(() => console.log('Tempo esgotado aguardando resultados do DJEN.'));

    // 5. Extrair as publicações da página atual
    const cards = await page.$$('mat-card.resultado-pesquisa');
    
    for (const card of cards) {
      const processNumber = await card.$eval('.numero-processo', el => el.textContent.trim()).catch(() => 'Desconhecido');
      const tribunal = await card.$eval('.sigla-tribunal', el => el.textContent.trim()).catch(() => 'DJEN');
      const dateText = await card.$eval('.data-disponibilizacao', el => el.textContent.trim()).catch(() => new Date().toLocaleDateString());
      const content = await card.$eval('.texto-publicacao', el => el.textContent.trim()).catch(() => '');

      if (content) {
        publications.push({
          processNumber,
          tribunal,
          publishedAt: new Date().toISOString(), // No mundo real, faríamos o parse de dateText
          content
        });
      }
    }

    console.log(`✅ Foram encontradas ${publications.length} publicações na primeira página.`);

  } catch (err) {
    console.error(`❌ Erro durante o scraping do DJEN para OAB ${oabNumber}:`, err.message);
  }

  return publications;
}

runCrawler();
