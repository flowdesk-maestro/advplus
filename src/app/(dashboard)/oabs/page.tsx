'use client'

import { useState } from 'react'
import { Plus, Trash2, ShieldCheck, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { toast } from 'sonner'

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export default function OabsPage() {
  const [oabs, setOabs] = useState([
    { id: '1', number: '123456', state: 'SP', active: true },
    { id: '2', number: '654321', state: 'RJ', active: true },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newOabNumber, setNewOabNumber] = useState('')
  const [newOabState, setNewOabState] = useState('')

  const handleAddOab = () => {
    if (!newOabNumber || !newOabState) {
      toast.error('Preencha todos os campos')
      return
    }

    const newOab = {
      id: Math.random().toString(),
      number: newOabNumber,
      state: newOabState,
      active: true
    }

    setOabs([...oabs, newOab])
    setIsDialogOpen(false)
    setNewOabNumber('')
    setNewOabState('')
    toast.success('OAB cadastrada com sucesso!')
  }

  const handleDeleteOab = (id: string) => {
    setOabs(oabs.filter(o => o.id !== id))
    toast.info('OAB removida')
  }

  return (
    <div className="space-y-8 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">OABs Monitoradas</h1>
          <p className="text-muted-foreground">
            Gerencie as inscrições da OAB que o sistema deve monitorar no DJEN.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 px-6">
              <Plus className="w-4 h-4 mr-2" /> Adicionar OAB
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova OAB</DialogTitle>
              <DialogDescription>
                Informe o número da inscrição e o estado para iniciar o monitoramento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="number">Número da OAB</Label>
                <Input 
                  id="number" 
                  placeholder="Ex: 123456" 
                  value={newOabNumber}
                  onChange={(e) => setNewOabNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">Estado (UF)</Label>
                <Select onValueChange={setNewOabState} value={newOabState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map(uf => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddOab}>
                Salvar OAB
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oabs.map((oab) => (
          <Card key={oab.id} className="relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-slate-400 hover:text-red-500 transition-colors"
                onClick={() => handleDeleteOab(oab.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <CardTitle>{oab.number}</CardTitle>
                <CardDescription>OAB/{oab.state}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Ativa / Monitorando</span>
                </div>
                <Badge variant="outline" className="text-[10px]">DJEN OK</Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {oabs.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Nenhuma OAB cadastrada ainda.</p>
            <Button variant="link" className="text-indigo-500" onClick={() => setIsDialogOpen(true)}>
              Clique aqui para adicionar a primeira
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
