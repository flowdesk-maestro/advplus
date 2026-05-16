import { 
  FileText, 
  AlertCircle, 
  IdCard, 
  Clock,
  ArrowUpRight,
  Sparkles,
  Send,
  Plus
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Buscar estatísticas reais
  const { count: publicationsCount } = await supabase.from('publications').select('*', { count: 'exact', head: true })
  const { count: urgentCount } = await supabase.from('ai_analysis').select('*', { count: 'exact', head: true }).eq('urgente', true)
  const { count: oabsCount } = await supabase.from('monitored_oabs').select('*', { count: 'exact', head: true }).eq('active', true)
  const { data: recentPubs } = await supabase
    .from('publications')
    .select('*, ai_analysis(*)')
    .order('published_at', { ascending: false })
    .limit(3)

  const stats = [
    { name: 'Publicações Totais', value: publicationsCount || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Alertas Urgentes', value: urgentCount || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { name: 'OABs Ativas', value: oabsCount || 0, icon: IdCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Prazos Pendentes', value: '0', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
          <p className="text-muted-foreground mt-1">
            Resumo do seu monitoramento jurídico em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/publicacoes">Ver Relatórios</Link>
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
            <Link href="/oabs"><Plus className="w-4 h-4 mr-2" /> Nova OAB</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={stat.bg + " p-2 rounded-lg"}>
                  <stat.icon className={"w-5 h-5 " + stat.color} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Últimas Publicações</CardTitle>
              <CardDescription>Capturas recentes do DJEN.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/publicacoes" className="flex items-center">
                Ver tudo <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!recentPubs || recentPubs.length === 0) ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Nenhuma publicação encontrada.</p>
                <p className="text-sm text-slate-400">Cadastre uma OAB para iniciar o monitoramento.</p>
              </div>
            ) : (
              recentPubs.map((pub: any) => (
                <div 
                  key={pub.id} 
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-500">{pub.process_number}</span>
                      <Badge variant="secondary" className="text-[10px] uppercase">{pub.tribunal}</Badge>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(pub.published_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-indigo-500 transition-colors line-clamp-1">
                    {pub.ai_analysis?.[0]?.classificacao || 'Aguardando Análise IA'}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {pub.content}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    {pub.ai_analysis?.[0]?.urgente && (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">URGENTE</Badge>
                    )}
                    <Badge variant="outline" className="text-[10px]">
                      {pub.ai_analysis?.[0] ? 'IA: ANALISADO' : 'IA: PENDENTE'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-indigo-500/20 bg-indigo-500/[0.02]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-500">
                <Sparkles className="w-5 h-5" /> Insights da IA
              </CardTitle>
              <CardDescription>Resumo inteligente das últimas 24h.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground italic text-xs">
                  A IA gerará resumos automáticos assim que novas publicações forem capturadas.
                </p>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled>Ver Recomendações</Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-500" /> Alertas Telegram
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Integre seu bot para receber alertas instantâneos no seu celular.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/configuracoes/telegram">Configurar Bot</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
