'use client'

import { useState, useEffect } from 'react'
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
  const [showLangModal, setShowLangModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  // 禁止背景滚动
  useEffect(() => {
    if (showJoin || showLangModal) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
  }, [showJoin, showLangModal])

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
          {/* 欢迎语区 */}
          <div className="relative mb-8 bg-green-100 rounded-lg p-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {t('student.welcomeTitle')}
            </h1>
            <p className="text-gray-700 mt-2">
              {t('student.welcomeSubtitle')}
            </p>

            {/* 加入班级按钮 */}
            <div className="absolute bottom-4 right-4">
              <Button variant="default" size="sm" onClick={() => setShowJoin(true)}>
                {t('student.joinClass')}
              </Button>
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
                className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => {
                  setSelectedTopic(key)
                  setShowLangModal(true)
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

      {/* 加入班级弹窗 */}
      {showJoin && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowJoin(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">{t('student.joinClass')}</h2>
            <input
              type="text"
              placeholder={t('student.enterCode')}
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  alert(`${t('student.joinedClass')}: ${classCode}`)
                  setShowJoin(false)
                }
              }}
            />
            <div className="flex justify-end">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  alert(`${t('student.joinedClass')}: ${classCode}`)
                  setShowJoin(false)
                }}
              >
                {t('student.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 语言选择弹窗 */}
      {showLangModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowLangModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">{t('student.chooseLanguage')}</h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = `/student/${selectedTopic}/en`
                }}
              >
                English
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = `/student/${selectedTopic}/ms`
                }}
              >
                Bahasa Melayu
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = `/student/${selectedTopic}/zh`
                }}
              >
                中文
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
