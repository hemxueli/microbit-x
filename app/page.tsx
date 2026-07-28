import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { HomeLanding } from '@/components/home-landing'

export default async function Page() {
  const user = await getSessionUser()
  if (user) redirect(user.role === 'teacher' ? '/teacher' : '/student')
  return <HomeLanding isAuthed={false} />
}
