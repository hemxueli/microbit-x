'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { useEffect, useRef } from 'react'

// 滚动淡入 + 图片缩放组件
function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

  const features = [
    { title: '丰富有趣的学习内容', desc: '提供大量互动课程与素材，让学生在探索中轻松掌握 micro:bit。', img: '/images/feature-learning.png' },
    { title: '基础学生测验', desc: '精心设计的测试帮助初学者检验学习成果，逐步提升能力。', img: '/images/feature-quiz.png' },
    { title: 'AI 聊天助手', desc: '随时提问，获得即时而友好的指导，就像身边有一位专属导师。', img: '/images/feature-ai.png' },
    { title: '个性化反馈', desc: 'AI 会分析你的学习与测验结果，给出针对性的改进建议，助你不断进步。', img: '/images/feature-feedback.png' },
    { title: '教师轻松管理班级', desc: '教师仪表盘让班级管理、进度监控和成绩评估变得简单高效。', img: '/images/feature-teacher.png' },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
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
        {/* Hero + Features 融合背景 */}
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

            {/* 功能介绍区块：第一个从右边开始，之后左右交替 */}
            {features.map((f, i) => (
              <FadeInSection key={f.title}>
                <div
                  className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10`}
                >
                  {/* 图片 */}
                  <div className="flex-1">
                    <img src={f.img} alt={f.title} className="rounded-2xl opacity-90 shadow-md transition-transform duration-700 ease-out hover:scale-105" />
                  </div>
                  {/* 文字 */}
                  <div className="flex-1 text-right">
                    <h3 className="text-4xl font-extrabold text-teal-700 mb-4">{f.title}</h3>
                    <p className="text-lg text-gray-700 opacity-90">{f.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}

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
