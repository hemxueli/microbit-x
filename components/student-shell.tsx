'use client'

import { GraduationCap, LayoutDashboard, ListChecks, MessageCircle } from 'lucide-react'
import { AppShell, type NavItem } from '@/components/app-shell'

const items: NavItem[] = [
  { href: '/student', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { href: '/student/topics', labelKey: 'student.topics', icon: GraduationCap },
  { href: '/student/results', labelKey: 'student.results', icon: ListChecks },
  { href: '/student/chat', labelKey: 'student.chat', icon: MessageCircle },
]

export function StudentShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string }
  children: React.ReactNode
}) {
  return (
    <AppShell items={items} user={user}>
      {children}
    </AppShell>
  )
}
