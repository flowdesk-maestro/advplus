export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Meu Perfil</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Gerencie suas informações pessoais e preferências de conta.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
              <span className="text-slate-400 font-medium">Foto</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">Advogado Teste</h3>
              <p className="text-slate-500 dark:text-slate-400">advogado@exemplo.com</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">Em breve</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Esta página receberá os controles de edição de perfil, troca de senha e gestão da assinatura (Billing).
          </p>
        </div>
      </div>
    </div>
  )
}
