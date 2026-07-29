'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'
import type { QuizData } from '@/lib/quiz'

const quizzes: Record<string, { level: string; link: string }[]> = {
  Basic: [
    { level: '初级 Quiz', link: '/quiz/basic/level1' },
    { level: '中级 Quiz', link: '/quiz/basic/level2' },
    { level: '高级 Quiz', link: '/quiz/basic/level3' },
  ],
  Input: [
    { level: '初级 Quiz', link: '/quiz/input/level1' },
    { level: '中级 Quiz', link: '/quiz/input/level2' },
    { level: '高级 Quiz', link: '/quiz/input/level3' },
  ],
  Music: [
    { level: '初级 Quiz', link: '/quiz/music/level1' },
    { level: '中级 Quiz', link: '/quiz/music/level2' },
    { level: '高级 Quiz', link: '/quiz/music/level3' },
  ],
}

export default function StudentPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classCode, setClassCode] = useState('')

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Image
              src={user?.image ?? '/images/default-avatar.png'}
              alt="avatar"
              width={36}
              height={36}
              className="rounded-full border"
            />
            <span className="font-medium">{user?.name ?? 'Student'}</span>
            <Button variant="ghost" size="sm">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          {/* 欢迎语 */}
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-center">
            欢迎来到学习之旅 🌟
          </h1>
          <p className="text-center text-gray-600 mb-8">
            学习是一段美丽的旅程，每一步都让你更接近智慧的光芒。
          </p>

          {/* 加入班级按钮 */}
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="输入班级代码"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="border px-3 py-2 rounded-l"
            />
            <Button
              variant="default"
              size="sm"
              onClick={() => alert(`已加入班级: ${classCode}`)}
            >
              加入班级
            </Button>
          </div>

          {/* 学习卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.keys(quizzes).map((topic) => (
              <div key={topic} className="border rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-bold mb-4">{topic}</h2>
                <p className="text-gray-600 mb-4">点击进入 {topic} 学习内容</p>
                <div className="space-y-2">
                  {Array.isArray(quizzes[topic]) &&
                    quizzes[topic].map((quiz, i) => (
                      <Link key={i} href={quiz.link}>
                        <Button variant="outline" size="sm" className="w-full">
                          {quiz.level}
                        </Button>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quiz 成果查看 */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">我的 Quiz 成果</h2>
            <Button variant="default" size="sm" onClick={() => alert('显示 Quiz 成果')}>
              打开成果
            </Button>
          </div>
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
      <AiChatWidget
        defaultLanguage="en"
        quizData={{
          title: 'Sample Quiz',
          studentName: user?.name ?? 'Student',
          score: 2,
          total: 3,
          questions: [
            { question: 'What is a micro:bit button?', studentAnswer: 'Switch', correctAnswer: 'Input device', isCorrect: false },
            { question: 'LED stands for?', studentAnswer: 'Light Emitting Diode', correctAnswer: 'Light Emitting Diode', isCorrect: true },
            { question: 'Which sensor detects motion?', studentAnswer: 'Accelerometer', correctAnswer: 'Accelerometer', isCorrect: true },
          ],
        } as QuizData}
      />
    </div>
  )
}
