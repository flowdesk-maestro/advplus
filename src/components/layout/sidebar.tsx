'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FolderOpen, 
  IdCard, 
  Settings, 
  Send, 
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronRight,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const mainMenuItems = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'Processos', href: '/processos', icon: FolderOpen },
  { name: 'OABs Monitoradas', href: '/oabs', icon: IdCard },
]

const settingsMenuItems = [
  { name: 'Perfil', href: '/configuracoes/perfil', icon: User },
  { name: 'Inteligência Artificial', href: '/configuracoes/ai', icon: Sparkles },
  { name: 'Telegram Bot', href: '/configuracoes/telegram', icon: Send },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [isSettingsOpen, setIsSettingsOpen] = useState(pathname.startsWith('/configuracoes'))

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 bg-slate-950 border-r border-slate-800 text-slate-300">
      <div className="p-6 flex items-center gap-2 mb-8">
        <ShieldCheck className="w-8 h-8 text-indigo-500" />
        <span className="text-xl font-bold tracking-tight text-white">AdvPlus</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {mainMenuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "hover:bg-slate-900 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-slate-500")} />
              {item.name}
            </Link>
          )
        })}

        {/* Configurações Accordion */}
        <div className="pt-4">
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={cn(
              "flex w-full items-center justify-between gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-900 hover:text-white",
              pathname.startsWith('/configuracoes') ? "text-white" : "text-slate-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Settings className={cn("w-5 h-5", pathname.startsWith('/configuracoes') ? "text-indigo-400" : "text-slate-500")} />
              <span>Configurações</span>
            </div>
            {isSettingsOpen ? (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            )}
          </button>
          
          {isSettingsOpen && (
            <div className="mt-1 flex flex-col space-y-1 pl-11">
              {settingsMenuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-indigo-500/10 text-indigo-400" 
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-400" : "text-slate-500")} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-900 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}
