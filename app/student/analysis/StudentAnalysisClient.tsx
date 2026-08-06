'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'

type Lang = 'en' | 'zh' | 'ms'

interface QuizDetail {
  question_key: string
  options: string[]
  student_answer: number
  student_answer_text: string | null
  correct_answer: number
  correct_answer_text: string
  is_correct: boolean
}

interface QuizAnalysis {
  quiz_theme: string
  score: number
  created_at: string
  total_questions?: number
  details?: QuizDetail[]
  ai_feedback: {
    en: string
    zh: string
    ms: string
  }
}

export default function StudentAnalysisClient() {
  const { t } = useI18n()
  const [userId, setUserId] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error('Auth error:', error.message)
      setUserId(data?.user?.id ?? null)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!userId) {
        setError('MISSING_USER_ID')
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/getQuizResults?user_id=${userId}&mode=detail`)
        const data = await res.json()
        if (data.error) {
          setError(data.error)
          setAnalysis(null)
        } else {
          setAnalysis(data) // ✅ 直接用对象
          setError(null)
        }
      } catch {
        setError('NETWORK_ERROR')
        setAnalysis(null)
      }
      setLoading(false)
    }
    if (userId) fetchAnalysis()
  }, [userId])

  if (loading) return <p>{t('analysis.generating')}</p>
  if (error) return <p className="text-red-500">{t('analysis.failed')} ({error})</p>
  if (!analysis) return <p className="text-red-500">{t('analysis.failed')}</p>

  return (
    <div className="flex min-h-screen flex-col bg-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4 text-teal-800">
          {t(`quiz.${analysis.quiz_theme}`)} - {t('analysis.score')} {analysis.score}/{analysis.total_questions || analysis.details?.length || 0}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {t('analysis.completedAt')}: {new Date(analysis.created_at).toLocaleString()}
        </p>

        {/* 逐题详情 */}
        {analysis.details && (
          <ul className="space-y-4">
            {analysis.details.map((ans, idx) => (
              <li key={ans.question_key} className={`p-4 rounded ${ans.is_correct ? 'bg-green-100' : 'bg-red-100'}`}>
                <h2 className="font-semibold">
                  {t('analysis.question')} {idx + 1}: {t(ans.question_key)}
                </h2>
                <p>{t('analysis.yourAnswer')}: {ans.student_answer_text || t('analysis.noAnswer')}</p>
                <p>{t('analysis.correctAnswer')}: {ans.correct_answer_text}</p>
                <p>{ans.is_correct ? '✅ ' + t('analysis.correct') : '❌ ' + t('analysis.incorrect')}</p>
              </li>
            ))}
          </ul>
        )}

        {/* 语言切换 */}
        <div className="mt-6 flex gap-4">
          <Button onClick={() => setLang('en')} className={lang === 'en' ? 'bg-teal-500 text-white' : 'bg-gray-200'}>
            {t('common.english')}
          </Button>
          <Button onClick={() => setLang('zh')} className={lang === 'zh' ? 'bg-teal-500 text-white' : 'bg-gray-200'}>
            {t('common.chinese')}
          </Button>
          <Button onClick={() => setLang('ms')} className={lang === 'ms' ? 'bg-teal-500 text-white' : 'bg-gray-200'}>
            {t('common.malay')}
          </Button>
        </div>

        {/* AI feedback */}
        <div className="mt-8 bg-gray-100 p-4 rounded whitespace-pre-line">
          <h2 className="text-xl font-bold mb-2 text-teal-700">{t('analysis.aiFeedback')}</h2>
          <p>{analysis.ai_feedback?.[lang] || t('analysis.noFeedback')}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            className="bg-gray-400 text-white"
            onClick={() => (window.location.href = '/student')}
          >
            {t('common.back')}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-teal-700">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>

      {/* AI Chatbox */}
      <AiChatWidget defaultLanguage={lang} />
    </div>
  )
}
