export interface TelegramNotificationData {
  processNumber: string
  tribunal: string
  summary: string
  suggestion: string
  urgency: boolean
  date: string
}

export async function sendTelegramNotification(
  data: TelegramNotificationData,
  botToken: string,
  chatId: string
) {
  const emoji = data.urgency ? '🚨' : '📄'
  const urgencyText = data.urgency ? 'URGENTE' : 'COMUM'

  const message = `
${emoji} PUBLICAÇÃO ${urgencyText}

*Processo:*
${data.processNumber}

*Tribunal:*
${data.tribunal}

*Resumo IA:*
${data.summary}

*Providência sugerida:*
${data.suggestion}

*Data:*
${data.date}
  `.trim()

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.description || 'Erro ao enviar notificação para o Telegram')
  }

  return await response.json()
}
