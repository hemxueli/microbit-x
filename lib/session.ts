import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher'
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const u = session.user as typeof session.user & { role?: string }
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: (u.role as 'student' | 'teacher') ?? 'student',
  }
}

export async function getUserId(): Promise<string> {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function requireStudent(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/sign-in')
  if (user.role !== 'student') redirect('/teacher')
  return user
}

export async function requireTeacher(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect('/sign-in')
  if (user.role !== 'teacher') redirect('/student')
  return user
}
