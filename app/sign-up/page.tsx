import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { AuthShell } from '@/components/auth-shell'

export default async function SignUpPage() {
  const user = await getSessionUser()
  if (user) redirect(user.role === 'teacher' ? '/teacher' : '/student')
  return <AuthShell mode="sign-up" />
}
