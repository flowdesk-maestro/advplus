import { redirect } from 'next/navigation'

export default function RootPage() {
  // Por enquanto, redirecionamos direto para o dashboard.
  // O middleware cuidará de enviar para o login se não houver sessão.
  redirect('/login')
}
