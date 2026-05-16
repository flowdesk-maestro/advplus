'use server'

import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'

export async function saveAIConfig(data: {
  provider: string
  apiKey: string
  model: string
  baseUrl: string
}) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Não autorizado. Faça login novamente.' }
  }

  // Obter o law_office_id associado ao usuário
  const { data: userData, error: userFetchError } = await supabase
    .from('users')
    .select('law_office_id')
    .eq('id', user.id)
    .single()

  if (userFetchError || !userData?.law_office_id) {
    return { error: 'Usuário não vinculado a um escritório.' }
  }

  let encryptedApiKey = data.apiKey
  if (data.apiKey && data.provider !== 'custom') {
    try {
      encryptedApiKey = encrypt(data.apiKey)
    } catch (e) {
      console.error('Erro de criptografia', e)
      return { error: 'Falha ao criptografar a chave API. Verifique a configuração do servidor.' }
    }
  }

  // Primeiro, desativar configs antigas
  await supabase
    .from('ai_configs')
    .update({ active: false })
    .eq('law_office_id', userData.law_office_id)

  // Inserir ou atualizar
  const { error: insertError } = await supabase
    .from('ai_configs')
    .insert({
      law_office_id: userData.law_office_id,
      provider: data.provider,
      api_key: encryptedApiKey,
      model: data.model || null,
      base_url: data.baseUrl || null,
      active: true
    })

  if (insertError) {
    console.error('Erro ao salvar config no banco:', insertError)
    return { error: 'Erro ao salvar configurações no banco de dados.' }
  }

  return { success: true }
}
