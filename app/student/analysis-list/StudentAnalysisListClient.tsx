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
  question_text: { en: string; zh: string; ms: string }
  options: { en: string[]; zh: string[]; ms: string[] }
  correctAnswer: { en: string; zh: string; ms: string }
  selectedText: string | null
  isCorrect: boolean
}

interface QuizResult {
  id: string
  quiz_theme: 'basic' | 'music' | 'input'
  score: number
  created_at: string
  details: QuizDetail[]
  analysis_feedback: {
    en: string
    zh: string
    ms: string
  }
}

export default function StudentAnalysisListClient() {
  const { t } = useI18n()
  const [results, setResults] = useState<QuizResult[]>([])
  const [lang, setLang] = useState<Lang>('en')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error('Auth error:', error.message)
      setUserId(data?.user?.id ?? null)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (!userId) {
        setLoading(false)
        return
      }
      setLoading(true)
      const res = await fetch(`/api/getQuizResults?user_id=${userId}`)
      const data = await res.json()
      if (data.results) setResults(data.results)
      setLoading(false)
    }
    if (userId) fetchResults()
  }, [userId])

  const deleteResult = async (id: string) => {
    const res = await fetch('/api/deleteQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      setResults(results.filter(r => r.id !== id))
    } else {
      alert(data.error || t('analysis.deleteFailed'))
    }
  }

  if (loading) return <p className="text-teal-700">{t('analysis.loading')}</p>
  if (!userId) return <p className="text-teal-700">Please log in to view your analysis list.</p>

  return (
    <div className="flex min-h-screen flex-col bg-teal-200">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <LanguageSwitcher />
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-teal-800">{t('analysis.listTitle')}</h1>
        {results.length === 0 ? (
          <p className="text-teal-700 text-lg">{t('analysis.noRecords')}</p>
        ) : (
          <ul className="space-y-6">
            {results.map(r => (
              <li key={r.id} className="p-6 bg-teal-50 border border-teal-200 rounded-lg shadow relative">
                {/* ✅ Quiz 标题三语言版本，分数固定 /10 */}
                <h2 className="font-bold text-2xl text-teal-800">
                  {t(`quiz.${r.quiz_theme}.${lang}`)} - {t('analysis.score')} {r.score}/10
                </h2>

                {/* ✅ 翻译选择器放在右上角 */}
                <div className="absolute top-4 right-4">
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="border border-teal-600 rounded p-2 text-white bg-teal-600 text-sm font-medium
                              focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="en">{t('common.english')}</option>
                    <option value="zh">{t('common.chinese')}</option>
                    <option value="ms">{t('common.malay')}</option>
                  </select>
                </div>

                {/* AI feedback 三语言版本 */}
                <p className="whitespace-pre-line mt-3 text-teal-700 text-lg">
                  {r.analysis_feedback?.[lang] || t('analysis.noFeedback')}
                </p>

                {/* ✅ 逐题分析 */}
                <div className="mt-4 space-y-3">
                  {r.details?.map((d, i) => (
                    <div key={i} className="p-3 border rounded bg-white">
                      <p className="font-semibold text-teal-700">
                        {i + 1}. {d.question_text?.[lang]}
                      </p>
                      <p className="text-sm text-gray-700">
                        {t('analysis.yourAnswer')}: {d.selectedText || t('analysis.noAnswer')}
                      </p>
                      <p className="text-sm text-gray-700">
                        {t('analysis.correctAnswer')}: {d.correctAnswer?.[lang]}
                      </p>
                      <p className={`text-sm font-bold ${d.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {d.isCorrect ? t('analysis.correct') : t('analysis.wrong')}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-teal-600 mt-2">
                  {t('analysis.savedAt')}: {new Date(r.created_at).toLocaleString()}
                </p>

                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white mt-3"
                  onClick={() => deleteResult(r.id)}
                >
                  {t('common.delete')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* 底部版权栏 */}
      <footer className="border-t border-white/20 py-6 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-teal-700">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>

      {/* ✅ AI Chat Widget 在右下角 */}
      <AiChatWidget defaultLanguage={lang} />
    </div>
  )
}
