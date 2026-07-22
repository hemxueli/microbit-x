'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  BookOpen,
  Blocks,
  ListChecks,
  MessageCircle,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'

export function HomeLanding({ isAuthed }: { isAuthed: boolean }) {
  const { t } = useI18n()

  const features = [
    { icon: BookOpen, title: 'feature.materials.title', desc: 'feature.materials.desc' },
    { icon: Blocks, title: 'feature.makecode.title', desc: 'feature.makecode.desc' },
    { icon: ListChecks, title: 'feature.quiz.title', desc: 'feature.quiz.desc' },
    { icon: MessageCircle, title: 'feature.ai.title', desc: 'feature.ai.desc' },
    { icon: Sparkles, title: 'feature.feedback.title', desc: 'feature.feedback.desc' },
    { icon: LayoutDashboard, title: 'feature.dashboard.title', desc: 'feature.dashboard.desc' },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {isAuthed ? (
              <Button asChild size="sm">
                <Link href="/">{t('nav.dashboard')}</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">{t('nav.login')}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">{t('nav.getStarted')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-sm font-semibold text-accent">
              <Sparkles className="size-4" />
              {t('app.tagline')}
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/sign-up">{t('home.ctaStudent')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-up">{t('home.ctaTeacher')}</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <Image
                src="/images/hero-microbit.png"
                alt={t('home.heroTitle')}
                width={720}
                height={540}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-secondary/40 py-16">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="mb-10 text-center text-3xl font-extrabold tracking-tight text-balance">
              {t('home.featuresTitle')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="text-lg font-bold">{t(title)}</h3>
                    <p className="leading-relaxed text-muted-foreground">{t(desc)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBit-X</span>
        </div>
      </footer>
    </div>
  )
}
