const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { analyzePublication, sendTelegramNotification } = require('./utils');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runCrawler() {
  console.log('🚀 Iniciando Crawler AdvPlus com IA e Alertas...');

  const { data: oabs, error: oabError } = await supabase
    .from('monitored_oabs')
    .select('*, law_offices(*)');

  if (oabError || !oabs) {
    console.error('❌ Erro ao buscar OABs:', oabError);
    return;
  }

  console.log(`🔍 Monitorando ${oabs.length} OAB(s)...`);

  for (const oab of oabs) {
    console.log(`\n📌 Processando OAB/${oab.state}: ${oab.oab_number}`);

    try {
      const publications = await searchDjenReal(oab.oab_number, oab.state);
      
      for (const pubData of publications) {
        const { data: existing } = await supabase
          .from('publications')
          .select('id')
          .eq('process_number', pubData.processNumber)
          .eq('content', pubData.content)
          .single();

        if (existing) continue;

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

        await processAIAndAlerts(pub);
      }
    } catch (err) {
      console.error(`❌ Erro na OAB ${oab.oab_number}:`, err);
    }
  }

  console.log('\n🏁 Ciclo finalizado.');
}

async function processAIAndAlerts(pub) {
  try {
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

    await supabase.from('ai_analysis').insert({
      publication_id: pub.id,
      resumo: analysis.resumo,
      prazo_dias: analysis.prazo_dias,
      classificacao: analysis.classificacao,
      providencia: analysis.providencia,
      urgente: analysis.urgente
    });

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

async function searchDjenReal(oabNumber, state) {
  console.log(`🌐 Buscando DJEN via ScrapingBee para OAB ${oabNumber}/${state}...`);
  const publications = [];
  
  if (!process.env.SCRAPINGBEE_API_KEY || process.env.SCRAPINGBEE_API_KEY === 'your_scrapingbee_api_key_here') {
    throw new Error('A API Key do ScrapingBee não está configurada no .env. Cadastre-se em scrapingbee.com para obter a chave.');
  }

  // URL Direta de Pesquisa do DJEN
  const targetUrl = `https://comunica.pje.jus.br/consulta?numeroOab=${oabNumber}&ufOab=${state.toUpperCase()}`;

  try {
    // Fazer a requisição via ScrapingBee
    const response = await axios.get('https://app.scrapingbee.com/api/v1', {
      params: {
        api_key: process.env.SCRAPINGBEE_API_KEY,
        url: targetUrl,
        render_js: 'true',
        wait_for: '.resultado-pesquisa, .nenhum-resultado', // Espera a tabela ou mensagem de vazio
        premium_proxy: 'true', // Essencial para passar pelo Cloudflare do CNJ
        country_code: 'br', // Proxies no Brasil para não disparar bloqueio geográfico
        block_resources: 'False' // Evita erros 400 caso o CNJ bloqueie recursos de fontes externas
      }
    });

    const $ = cheerio.load(response.data);
    const cards = $('mat-card.resultado-pesquisa');

    if (cards.length === 0) {
       console.log('Nenhum card encontrado ou OAB sem publicações recentes.');
       return publications;
    }

    cards.each((i, el) => {
      const processNumber = $(el).find('.numero-processo').text().trim() || 'Desconhecido';
      const tribunal = $(el).find('.sigla-tribunal').text().trim() || 'DJEN';
      const dateText = $(el).find('.data-disponibilizacao').text().trim() || new Date().toLocaleDateString();
      const content = $(el).find('.texto-publicacao').text().trim();

      if (content) {
        publications.push({
          processNumber,
          tribunal,
          publishedAt: new Date().toISOString(), // No mundo real, faríamos o parse de dateText
          content
        });
      }
    });

    console.log(`✅ Extraídas ${publications.length} publicações.`);

  } catch (err) {
    console.error(`❌ Erro no ScrapingBee:`, err.message);
  }

  return publications;
}

runCrawler();
