import OpenAI from 'openai'

export interface AIAnalysisResult {
  resumo: string
  prazo_dias?: number
  classificacao: 'urgente' | 'manifestação' | 'audiência' | 'ciência' | 'despacho' | 'sentença'
  providencia: string
  urgente: boolean
}

export async function analyzePublication(
  content: string,
  apiKey: string,
  model: string = 'gpt-4o-mini'
): Promise<AIAnalysisResult> {
  const openai = new OpenAI({
    apiKey: apiKey,
  })

  const prompt = `
    Você é um assistente jurídico especializado em análise de publicações do DJEN.
    Analise o texto da publicação abaixo e retorne um JSON estritamente no seguinte formato:
    {
      "resumo": "resumo de até 3 linhas",
      "prazo_dias": 15 (opcional, apenas se houver menção a prazo),
      "classificacao": "escolha entre: urgente, manifestação, audiência, ciência, despacho, sentença",
      "providencia": "sugestão de ação para o advogado",
      "urgente": true/false
    }

    Texto da publicação:
    ${content}
  `

  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: 'Você é um assistente jurídico sênior.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result as AIAnalysisResult
}
