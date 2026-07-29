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

export default function StudentPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [showJoin, setShowJoin] = useState(false)
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
            <span className="font-medium">{user?.name ?? t('student.defaultName')}</span>
            <Button variant="ghost" size="sm">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          {/* 欢迎语 + 加入班级按钮 */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                {t('student.welcomeTitle')}
              </h1>
              <p className="text-gray-600">
                {t('student.welcomeSubtitle')}
              </p>
            </div>
            <div>
              {!showJoin ? (
                <Button variant="default" size="sm" onClick={() => setShowJoin(true)}>
                  {t('student.joinClass')}
                </Button>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    placeholder={t('student.enterCode')}
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="border px-3 py-2 rounded-l"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => alert(`${t('student.joinedClass')}: ${classCode}`)}
                  >
                    {t('student.confirm')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 学习卡片区 */}
          <h2 className="text-2xl font-bold mb-6">{t('student.learningContent')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'basic', image: '/images/basic.png' },
              { key: 'input', image: '/images/input.png' },
              { key: 'music', image: '/images/music.png' },
            ].map(({ key, image }) => (
              <div
                key={key}
                className="relative w-full h-60 rounded-lg shadow-md overflow-hidden cursor-pointer group"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                    {t(`student.${key}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quiz 卡片区 */}
          <h2 className="text-2xl font-bold mt-12 mb-6">{t('student.myQuiz')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['beginnerQuiz', 'intermediateQuiz', 'advancedQuiz'].map((level, i) => (
              <Link key={i} href={`/quiz/level${i + 1}`}>
                <div className="border rounded-lg p-6 shadow-md text-center hover:bg-gray-50 cursor-pointer">
                  <h3 className="text-lg font-semibold">{t(`student.${level}`)}</h3>
                  <p className="text-gray-600 mt-2">{t('student.startQuiz')}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Quiz 成果查看 */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('student.myResults')}</h2>
            <Button variant="default" size="sm" onClick={() => alert(t('student.showResults'))}>
              {t('student.openResults')}
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
          studentName: user?.name ?? t('student.defaultName'),
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
