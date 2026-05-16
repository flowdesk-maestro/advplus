'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, ExternalLink, Bot, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export default function TelegramPage() {
  const [botToken, setBotToken] = useState('')
  const [chatId, setChatId] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleTestIntegration = () => {
    if (!botToken || !chatId) {
      toast.error('Informe o Token e o Chat ID para testar')
      return
    }

    setIsTesting(true)
    // Simulação de teste
    setTimeout(() => {
      setIsTesting(false)
      toast.success('Mensagem de teste enviada!', {
        description: 'Verifique seu Telegram agora.'
      })
    }, 1500)
  }

  const handleSaveConfig = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Configurações salvas com sucesso!')
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integração Telegram</h1>
        <p className="text-muted-foreground mt-1">
          Receba notificações instantâneas e resumos de IA das suas publicações diretamente no celular.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Configuração */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Configuração do Bot</CardTitle>
              <CardDescription>Insira as credenciais do seu Bot do Telegram.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">BOT_TOKEN</Label>
                <Input 
                  id="token" 
                  type="password"
                  placeholder="Ex: 123456789:ABCDefGhIjKlMnOpQrStUvWxYz" 
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">O token gerado pelo @BotFather.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat_id">CHAT_ID</Label>
                <Input 
                  id="chat_id" 
                  placeholder="Ex: 987654321" 
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">Seu ID de chat pessoal ou do grupo.</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleTestIntegration}
                disabled={isTesting}
              >
                {isTesting ? 'Testando...' : 'Testar Integração'}
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleSaveConfig}
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-500/[0.01]">
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> O que você receberá:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-xs space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5" />
                  Alertas em tempo real de novas publicações.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5" />
                  Resumo gerado por IA para leitura rápida.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5" />
                  Indicação de urgência e prazos identificados.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tutorial */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 h-full">
            <CardHeader>
              <CardTitle className="text-lg">Como configurar?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Crie seu Bot</p>
                    <p className="text-xs text-muted-foreground">Abra o <a href="https://t.me/botfather" target="_blank" className="text-indigo-500 underline inline-flex items-center">@BotFather <ExternalLink className="w-3 h-3 ml-1" /></a> e use o comando /newbot.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Pegue o Token</p>
                    <p className="text-xs text-muted-foreground">O BotFather enviará um Token API. Copie e cole no campo ao lado.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Descubra seu Chat ID</p>
                    <p className="text-xs text-muted-foreground">Abra o <a href="https://t.me/userinfobot" target="_blank" className="text-indigo-500 underline inline-flex items-center">@userinfobot <ExternalLink className="w-3 h-3 ml-1" /></a> para ver seu ID pessoal.</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-100 dark:bg-slate-800" />

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-amber-500" /> Importante
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Você precisa dar "Start" no seu bot recém-criado antes de testar a integração, caso contrário o Telegram bloqueará a mensagem.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
