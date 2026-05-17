const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

async function searchDjenReal(oabNumber, state) {
  console.log(`🌐 Buscando DJEN via ScrapingBee para OAB ${oabNumber}/${state}...`);
  const publications = [];
  
  if (!process.env.SCRAPINGBEE_API_KEY || process.env.SCRAPINGBEE_API_KEY === 'your_scrapingbee_api_key_here') {
    throw new Error('A API Key do ScrapingBee não está configurada no .env. Cadastre-se em scrapingbee.com para obter a chave.');
  }

  // URL Direta de Pesquisa do DJEN
  const targetUrl = `https://comunica.pje.jus.br/consulta?numeroOab=${oabNumber}&ufOab=${state.toUpperCase()}`;

  try {
    console.log('📡 Enviando requisição para ScrapingBee...');
    const response = await axios.get('https://app.scrapingbee.com/api/v1', {
      params: {
        api_key: process.env.SCRAPINGBEE_API_KEY,
        url: targetUrl,
        render_js: 'true',
        wait_for: '.resultado-pesquisa, .nenhum-resultado',
        premium_proxy: 'true', 
        country_code: 'br',
        block_resources: 'False'
      }
    });

    console.log('✅ Resposta recebida. Fazendo parse do HTML...');
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
          dateText,
          content
        });
      }
    });

    console.log(`✅ Extraídas ${publications.length} publicações.`);

  } catch (err) {
    console.error(`❌ Erro no ScrapingBee:`, err.response?.data || err.message);
  }

  return publications;
}

async function runTest() {
  try {
    const results = await searchDjenReal('307844', 'SP');
    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}

runTest();
