'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { useEffect, useRef, useState } from 'react'

// 滚动淡入 + 图片缩放组件
function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0', 'scale-100')
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-8 scale-95 transition-all duration-700 ease-out"
    >
      {children}
    </div>
  )
}

export function HomeLanding({ isAuthed }: { isAuthed: boolean }) {
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            {/* ✅ SSR 阶段不渲染 LanguageSwitcher，避免 mismatch */}
            {mounted && <LanguageSwitcher />}
            {isAuthed ? (
              <Link href="/">
                <Button size="sm">{t('nav.dashboard')}</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">{t('nav.login')}</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">{t('nav.getStarted')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-24 bg-gradient-to-b from-white via-cyan-50 to-teal-100">
          <div className="mx-auto w-full max-w-6xl px-6 space-y-40">

            {/* Hero */}
            <div className="grid md:grid-cols-2 items-center gap-10">
              <div className="flex flex-col gap-6">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-700">
                  <Sparkles className="size-4" />
                  {t('app.tagline')}
                </span>
                <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-5xl text-teal-800">
                  {t('home.heroTitle')}
                </h1>
                <p className="text-pretty text-lg leading-relaxed text-gray-700">
                  {t('home.heroSubtitle')}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/sign-up">
                    <Button size="lg">{t('home.ctaStudent')}</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="lg" variant="outline">{t('home.ctaTeacher')}</Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/images/hero-microbit.png"
                  alt={t('home.heroTitle') ?? 'MicroBOT-X'}
                  width={720}
                  height={540}
                  className="h-auto w-full object-cover rounded-3xl shadow-lg"
                  priority
                />
              </div>
            </div>

            {/* Features 用 FadeInSection 包裹 */}
            <FadeInSection>
              {/* 功能 1：学习材料 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-10">
                <div className="flex-1">
                  <img 
                    src="/images/feature-learning.png" 
                    alt={t('feature.materials.title')} 
                    className="rounded-2xl opacity-90 shadow-md transition-transform duration-700 ease-out hover:scale-105" 
                  />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-4xl font-extrabold text-teal-700 mb-4">{t('feature.materials.title')}</h3>
                  <p className="text-lg text-gray-700 opacity-90">{t('feature.materials.desc')}</p>
                </div>
              </div>
            </FadeInSection>

            {/* 其他功能同样用 FadeInSection 包裹 */}
            {/* ...省略，保持原有结构... */}

          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-gray-600">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>
    </div>
  )
}
