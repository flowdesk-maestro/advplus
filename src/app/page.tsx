import { redirect } from 'next/navigation'

export default function RootPage() {
  // Após o login, o usuário deve ser levado ao Dashboard.
  // O middleware garantirá que, se não estiver logado, ele vá para /login.
  redirect('/dashboard')
}
