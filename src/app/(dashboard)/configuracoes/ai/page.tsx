'use client'

import { useState } from 'react'
import { Sparkles, Key, Brain, Zap, ShieldCheck, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

import { saveAIConfig } from '@/app/actions/ai-config'

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI (GPT-4o)', icon: '🤖' },
  { id: 'gemini', name: 'Google Gemini', icon: '♊' },
  { id: 'anthropic', name: 'Anthropic (Claude)', icon: '🌿' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🐳' },
  { id: 'custom', name: 'Custom (Ollama / Local)', icon: '🏠' },
]

export default function AIPage() {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [baseUrl, setBaseUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveConfig = async () => {
    if (!apiKey && provider !== 'custom') {
      toast.error('Informe sua API Key')
      return
    }

    setIsSaving(true)
    try {
      const result = await saveAIConfig({
        provider,
        apiKey,
        model,
        baseUrl
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Configurações para ${provider.toUpperCase()} salvas com segurança!`)
        setApiKey('') // Limpar a chave do campo por segurança após salvar
      }
    } catch (e) {
      toast.error('Ocorreu um erro ao salvar as configurações.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inteligência Artificial</h1>
          <p className="text-muted-foreground mt-1">
            Configure seu provedor de IA preferido para análise de publicações.
          </p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-full">
          <Brain className="w-8 h-8 text-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Configuração Genérica</CardTitle>
              <CardDescription>Escolha o motor que processará seus dados jurídicos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="provider">Provedor de IA</Label>
                <Select onValueChange={setProvider} value={provider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="mr-2">{p.icon}</span> {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator className="opacity-50" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key / Token</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input 
                      id="apiKey" 
                      type="password"
                      className="pl-10"
                      placeholder={provider === 'openai' ? 'sk-...' : 'Insira sua chave'} 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo específico (Opcional)</Label>
                    <Input 
                      id="model" 
                      placeholder={provider === 'openai' ? 'gpt-4o-mini' : 'Ex: claude-3-sonnet'} 
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    />
                  </div>
                  {provider === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="baseUrl">Base URL (Endpoint)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <Input 
                          id="baseUrl" 
                          className="pl-10"
                          placeholder="http://localhost:11434/v1" 
                          value={baseUrl}
                          onChange={(e) => setBaseUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleSaveConfig}
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar Configuração de IA'}
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-50 dark:bg-slate-900 border-none">
              <CardHeader className="pb-2">
                <Zap className="w-4 h-4 text-amber-500 mb-2" />
                <CardTitle className="text-sm">Economia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">O Gemini Flash e o GPT-4o mini oferecem custos extremamente baixos para grandes volumes.</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-50 dark:bg-slate-900 border-none">
              <CardHeader className="pb-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 mb-2" />
                <CardTitle className="text-sm">Privacidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Use modelos locais via Ollama para garantir que nenhum dado saia da sua rede.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Como escolher?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold">Recomendados:</p>
              <ul className="text-[10px] space-y-2 text-muted-foreground">
                <li><strong className="text-slate-900 dark:text-slate-100">OpenAI:</strong> Melhor equilíbrio e compatibilidade.</li>
                <li><strong className="text-slate-900 dark:text-slate-100">Gemini:</strong> Excelente para textos longos e baixo custo.</li>
                <li><strong className="text-slate-900 dark:text-slate-100">Anthropic:</strong> Considerado o melhor para raciocínio jurídico complexo.</li>
              </ul>
            </div>
            <Separator className="bg-slate-100 dark:bg-slate-800" />
            <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
              <p className="text-xs font-semibold mb-2 flex items-center gap-2 text-indigo-500">
                <Sparkles className="w-3 h-3" /> Dica Pro
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Você pode trocar de provedor a qualquer momento. Suas publicações antigas continuarão com as análises salvas anteriormente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
