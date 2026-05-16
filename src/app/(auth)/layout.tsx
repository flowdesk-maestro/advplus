import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Esquerda: Formulários */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <ShieldCheck className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold tracking-tight">AdvPlus</span>
          </div>
          {children}
        </div>
      </div>

      {/* Direita: Branding/Visual (Apenas Desktop) */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white relative overflow-hidden">
        {/* Efeito de Gradiente/Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)]" />
        
        <div className="relative z-10 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
          <span className="text-2xl font-bold tracking-tight">AdvPlus</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Gestão inteligente para advogados modernos.
          </h2>
          <p className="text-slate-400 text-lg">
            Monitore suas OABs, capture publicações e receba insights gerados por IA diretamente no seu Telegram.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-sm">
            © 2026 AdvPlus Software Jurídico. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
