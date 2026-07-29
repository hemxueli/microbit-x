'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'
import type { QuizData } from '@/lib/quiz '

interface Progress {
  topic: string
  score: number
}

export default function StudentPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch('/api/progress')
        const data = await res.json()
        setProgress(data)
      } catch (err) {
        console.error('Failed to load progress:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProgress()
  }, [])

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2">
              <Image
                src={user?.image ?? '/images/default-avatar.png'}
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full border"
              />
              <span className="font-medium">{user?.name ?? 'Student'}</span>
            </div>
            <Button variant="ghost" size="sm">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
            {t('student.myProgress') ?? 'My Progress'}
          </h1>

          {/* 学习进度表格 */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">{t('student.topics') ?? 'Learning Topics'}</th>
                <th className="border px-4 py-2">{t('student.results') ?? 'My Results'}</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{p.topic}</td>
                  <td className="border px-4 py-2">{p.score}%</td>
                </tr>
              ))}
              {progress.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    {t('student.notAttempted') ?? 'Not attempted yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBit-X</span>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AiChatWidget defaultLanguage="en" quizData={{ 
        title: "Sample Quiz", 
        studentName: user?.name ?? "Student", 
        score: 2, 
        total: 3, 
        questions: [
          { question: "What is a micro:bit button?", studentAnswer: "Switch", correctAnswer: "Input device", isCorrect: false },
          { question: "LED stands for?", studentAnswer: "Light Emitting Diode", correctAnswer: "Light Emitting Diode", isCorrect: true },
          { question: "Which sensor detects motion?", studentAnswer: "Accelerometer", correctAnswer: "Accelerometer", isCorrect: true }
        ]
      } as QuizData} />
    </div>
  )
}
