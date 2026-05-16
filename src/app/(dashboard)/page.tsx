import { 
  FileText, 
  AlertCircle, 
  IdCard, 
  Clock,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Send
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { name: 'Publicações Hoje', value: '12', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Alertas Urgentes', value: '3', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'OABs Ativas', value: '5', icon: IdCard, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { name: 'Prazos Pendentes', value: '8', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
]

const recentPublications = [
  {
    id: '1',
    process: '0001234-56.2025.8.26.0001',
    tribunal: 'TJSP',
    content: 'Fica intimado o autor para se manifestar sobre a contestação no prazo de 15 dias...',
    urgency: 'high',
    category: 'Manifestação',
    date: '16/05/2026',
  },
  {
    id: '2',
    process: '0005678-90.2025.8.26.0002',
    tribunal: 'TJSP',
    content: 'Vistos. Designo audiência de conciliação para o dia 20/06/2026 às 14:00 horas...',
    urgency: 'medium',
    category: 'Audiência',
    date: '15/05/2026',
  },
  {
    id: '3',
    process: '0009876-54.2025.8.26.0003',
    tribunal: 'TRT2',
    content: 'Ciência do despacho de fls. 145. Prazo de 05 dias para cumprimento...',
    urgency: 'low',
    category: 'Despacho',
    date: '14/05/2026',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
          <p className="text-muted-foreground mt-1">
            Olá, Advogado. Aqui está o resumo das suas publicações de hoje.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Baixar Relatório</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Nova Busca</Button>
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
                <Badge variant="outline" className="text-emerald-500 bg-emerald-500/5 border-emerald-500/20">
                  <TrendingUp className="w-3 h-3 mr-1" /> +12%
                </Badge>
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
        {/* Recent Publications */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Últimas Publicações</CardTitle>
              <CardDescription>Publicações recentes capturadas do DJEN.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <a href="/publicacoes">Ver tudo <ArrowUpRight className="ml-1 w-4 h-4" /></a>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPublications.map((pub) => (
              <div 
                key={pub.id} 
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-slate-500">{pub.process}</span>
                    <Badge variant="secondary" className="text-[10px] uppercase">{pub.tribunal}</Badge>
                  </div>
                  <span className="text-xs text-slate-400">{pub.date}</span>
                </div>
                <h4 className="font-semibold text-sm mb-1 group-hover:text-indigo-500 transition-colors">
                  {pub.category}
                </h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {pub.content}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {pub.urgency === 'high' && (
                    <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">URGENTE</Badge>
                  )}
                  {pub.urgency === 'medium' && (
                    <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">ATENÇÃO</Badge>
                  )}
                  <Badge variant="outline" className="text-[10px]">IA: REVISADO</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights / Alertas */}
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
                <p><strong>🚨 Atenção:</strong> Foram identificados 2 novos prazos fatais para esta semana.</p>
                <p><strong>💡 Sugestão:</strong> Iniciar a réplica do processo final 0001 antes do feriado.</p>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Ver Recomendações</Button>
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
                Sua integração está ativa. 15 alertas enviados nos últimos 7 dias.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/configuracoes/telegram">Configurar Bot</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
