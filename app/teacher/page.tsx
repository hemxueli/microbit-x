'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, ListChecks, Users } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'

export default function TeacherPage({ user }: { user: any }) {
  const { t } = useI18n()

  const tabs = [
    { key: 'classes', icon: BookOpen, title: t('classes') },
    { key: 'assignments', icon: ListChecks, title: t('assignments') },
    { key: 'students', icon: Users, title: t('students') },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {/* 老师头像和名字 */}
            <div className="flex items-center gap-2">
              <Image
                src={user?.image ?? '/default-avatar.png'}
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full border"
              />
              <span className="font-medium">{user?.name ?? 'Teacher'}</span>
            </div>
            <Button variant="ghost" size="sm">
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
            {t('dashboard')}
          </h1>

          {/* Tab 区块 */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tabs.map(({ key, icon: Icon, title }) => (
              <Card key={key} className="h-full transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-3 p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {key === 'classes' && t('createClass')}
                    {key === 'assignments' && t('assignmentsText')}
                    {key === 'students' && t('studentsText')}
                  </p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href={`/teacher/${key}`}>{t('open')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* 底部 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBit-X</span>
        </div>
      </footer>
    </div>
  )
}
