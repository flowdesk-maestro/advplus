const OpenAI = require('openai');
const fetch = require('node-fetch');

/**
 * Analisa a publicação usando o provedor de IA configurado
 */
async function analyzePublication(content, apiKey, model, provider = 'openai', baseUrl = null) {
  // MOCK para testes
  if (apiKey === 'MOCK_KEY') {
    return {
      resumo: `[Análise via ${provider.toUpperCase()}] O autor deve apresentar réplica à contestação em 15 dias.`,
      prazo_dias: 15,
      classificacao: "manifestação",
      providencia: "Elaborar réplica focando na tempestividade.",
      urgente: true
    };
  }

  const prompt = `
    Você é um assistente jurídico especializado em análise de publicações do DJEN.
    Analise o texto da publicação abaixo e retorne um JSON estritamente no seguinte formato:
    {
      "resumo": "resumo de até 3 linhas",
      "prazo_dias": 15,
      "classificacao": "escolha entre: urgente, manifestação, audiência, ciência, despacho, sentença",
      "providencia": "sugestão de ação para o advogado",
      "urgente": true
    }

    Texto da publicação:
    ${content}
  `;

  switch (provider) {
    case 'openai':
    case 'deepseek':
    case 'custom':
      return await callOpenAICompatible(prompt, apiKey, model, baseUrl);
    
    case 'gemini':
      return await callGemini(prompt, apiKey, model);

    default:
      throw new Error(`Provedor ${provider} não suportado.`);
  }
}

async function callOpenAICompatible(prompt, apiKey, model, baseUrl) {
  const openai = new OpenAI({ 
    apiKey,
    baseURL: baseUrl || undefined // Usa o padrão da OpenAI se não for custom
  });

  const response = await openai.chat.completions.create({
    model: model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Você é um assistente jurídico sênior.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

async function callGemini(prompt, apiKey, model) {
  // Exemplo simplificado usando fetch para a API do Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    })
  });

  const json = await response.json();
  const text = json.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

/**
 * Envia notificação para o Telegram
 */
async function sendTelegramNotification(data, botToken, chatId) {
  if (botToken === 'MOCK_TOKEN') {
    console.log(`📡 [MOCK TELEGRAM] Enviando alerta para ${chatId}: ${data.process_number}`);
    return;
  }
  
  const emoji = data.urgente ? '🚨' : '📄';
  const urgencyText = data.urgente ? 'URGENTE' : 'COMUM';

  const message = `
${emoji} *PUBLICAÇÃO ${urgencyText}*

*Processo:* ${data.process_number}
*Tribunal:* ${data.tribunal}

*Resumo IA:*
${data.resumo}

*Providência sugerida:*
${data.providencia}

*Data:* ${new Date(data.published_at).toLocaleDateString('pt-BR')}
  `.trim();

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}

module.exports = { analyzePublication, sendTelegramNotification };
