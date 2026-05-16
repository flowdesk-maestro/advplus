'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal, 
  ExternalLink, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

const PUBLICATIONS = [
  {
    id: '1',
    process: '0001234-56.2025.8.26.0001',
    tribunal: 'TJSP',
    content: 'Vistos. Fls. 145/150: Manifeste-se o autor sobre a contestação e documentos apresentados, no prazo legal de 15 (quinze) dias. Após, tornem conclusos para saneamento ou julgamento antecipado do mérito. Intimem-se.',
    urgency: 'high',
    category: 'Manifestação',
    date: '16/05/2026',
    read: false,
    summary: 'Prazo de 15 dias para réplica à contestação.',
    suggestion: 'Analisar preliminares da contestação e elaborar a réplica destacando a tempestividade.'
  },
  {
    id: '2',
    process: '0005678-90.2025.8.26.0002',
    tribunal: 'TJSP',
    content: 'CERTIDÃO DE PUBLICAÇÃO DE RELAÇÃO. Relação :0123/2026 Data da Disponibilização: 15/05/2026 Data da Publicação: 16/05/2026 Número do Diário: 3456. Despacho: Vistos. Designo audiência de instrução e julgamento para o dia 10/08/2026 às 15:30h. As partes deverão arrolar testemunhas no prazo de 5 dias.',
    urgency: 'medium',
    category: 'Audiência',
    date: '15/05/2026',
    read: true,
    summary: 'Audiência designada para 10/08/2026 e prazo para rol de testemunhas.',
    suggestion: 'Entrar em contato com o cliente para confirmar disponibilidade e preparar o rol de testemunhas.'
  },
  {
    id: '3',
    process: '0009876-54.2025.8.26.0003',
    tribunal: 'TRT2',
    content: 'CONCLUSÃO. Nesta data, faço os autos conclusos ao(à) MM(a). Juiz(a) do Trabalho em razão do protocolo de petição de acordo. Decisão: Homologo o acordo de fls. 200, para que surta seus jurídicos e legais efeitos. Custas pela reclamada.',
    urgency: 'low',
    category: 'Sentença/Acordo',
    date: '14/05/2026',
    read: true,
    summary: 'Homologação de acordo judicial.',
    suggestion: 'Acompanhar o cumprimento das parcelas do acordo e solicitar o arquivamento após quitação.'
  },
]

export default function PublicacoesPage() {
  const [selectedPub, setSelectedPub] = useState<typeof PUBLICATIONS[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const openDetail = (pub: typeof PUBLICATIONS[0]) => {
    setSelectedPub(pub)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Publicações</h1>
          <p className="text-muted-foreground mt-1">
            Lista completa de todas as publicações capturadas e processadas pela IA.
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input placeholder="Buscar por processo ou conteúdo..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="todos">
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tribunal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Tribunais</SelectItem>
              <SelectItem value="tjsp">TJSP</SelectItem>
              <SelectItem value="trt2">TRT2</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="todas">
            <SelectTrigger className="w-[150px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Sempre</SelectItem>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Esta Semana</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela / Lista de Publicações */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Processo / Tribunal</th>
                <th className="px-6 py-4 font-medium">Categoria / Resumo</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Urgência</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {PUBLICATIONS.map((pub) => (
                <tr 
                  key={pub.id} 
                  className={`group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer ${!pub.read ? 'bg-indigo-500/[0.02]' : ''}`}
                  onClick={() => openDetail(pub)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-slate-900 dark:text-slate-100">{pub.process}</span>
                      <span className="text-xs text-slate-500">{pub.tribunal}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col max-w-xs">
                      <span className="font-semibold">{pub.category}</span>
                      <span className="text-xs text-slate-500 truncate">{pub.summary}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {pub.date}
                  </td>
                  <td className="px-6 py-4">
                    {pub.urgency === 'high' ? (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20">URGENTE</Badge>
                    ) : pub.urgency === 'medium' ? (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">ATENÇÃO</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500">COMUM</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetail(pub)}>
                          <Eye className="w-4 h-4 mr-2" /> Ver Íntegra
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CheckCircle className="w-4 h-4 mr-2" /> Marcar como lido
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">
                          <AlertTriangle className="w-4 h-4 mr-2" /> Reportar Erro
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhe */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedPub && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{selectedPub.tribunal}</Badge>
                <Badge variant="outline" className="font-mono">{selectedPub.process}</Badge>
                <Badge className={selectedPub.urgency === 'high' ? 'bg-red-500' : 'bg-indigo-500'}>{selectedPub.category}</Badge>
              </div>
              <DialogTitle className="text-xl">{selectedPub.category}</DialogTitle>
              <DialogDescription>Publicado em {selectedPub.date}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Análise da IA */}
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm">
                  <Sparkles className="w-4 h-4" /> Análise Inteligente
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Resumo:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedPub.summary}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Providência Sugerida:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{selectedPub.suggestion}</p>
                </div>
              </div>

              {/* Texto na íntegra */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <FileText className="w-4 h-4" /> Texto na Íntegra
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                  {selectedPub.content}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Fechar</Button>
              <div className="flex gap-2">
                <Button variant="secondary">
                  <ExternalLink className="w-4 h-4 mr-2" /> Ver no Tribunal
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Marcar como Lido</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
