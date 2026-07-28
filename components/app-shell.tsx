'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LogOut, Menu, X, type LucideIcon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'

export type NavItem = {
  href: string
  labelKey: string
  icon: LucideIcon
}

export function AppShell({
  items,
  user,
  children,
}: {
  items: NavItem[]
  user: { name: string; email: string; role: string }
  children: React.ReactNode
}) {
  const { t } = useI18n()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  async function logout() {
    await authClient.signOut()
    window.location.href = '/'
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== '/student' &&
            item.href !== '/teacher' &&
            pathname.startsWith(item.href))
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <Icon className="size-4 shrink-0" />
            {t(item.labelKey)}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex">
        <div className="mb-6 px-2">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        {nav}
        <div className="mt-auto flex flex-col gap-2 border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/15 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={logout}>
            <LogOut className="size-4" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            {nav}
            <Button variant="ghost" size="sm" className="mt-auto justify-start gap-2" onClick={logout}>
              <LogOut className="size-4" />
              {t('nav.logout')}
            </Button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="md:hidden">
            <Logo showText={false} />
          </div>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
