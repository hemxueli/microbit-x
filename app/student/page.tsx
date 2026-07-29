'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'

export default function StudentPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classCode, setClassCode] = useState('')
  const [showLanguageSelect, setShowLanguageSelect] = useState(false)

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

          {/* 学习内容入口 */}
          <div className="text-center mb-12">
            <Button
              variant="default"
              size="lg"
              onClick={() => setShowLanguageSelect(true)}
            >
              进入学习内容
            </Button>
          </div>

          {/* 语言选择 */}
          {showLanguageSelect && (
            <div className="flex justify-center gap-4 mb-12">
              <Link href="/learn/en">
                <Button variant="outline" size="sm">English</Button>
              </Link>
              <Link href="/learn/ms">
                <Button variant="outline" size="sm">Bahasa Melayu</Button>
              </Link>
              <Link href="/learn/zh">
                <Button variant="outline" size="sm">中文</Button>
              </Link>
            </div>
          )}

          {/* Quiz 独立区块 */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz 挑战</h2>
            <Link href="/quiz">
              <Button variant="default" size="sm">进入 Quiz</Button>
            </Link>
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
        }}
      />
    </div>
  )
}
