'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'
import {Logo } from '@/components/logo'

type Lang = 'en' | 'zh' | 'ms'

interface QuizResult {
  id: string
  quiz_theme: string
  score: number
  created_at: string
  answers: any[]
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

  if (loading) return <p className="text-white">{t('analysis.loading')}</p>
  if (!userId) return <p className="text-white">Please log in to view your analysis list.</p>

  return (
    <div className="flex min-h-screen flex-col bg-teal-700">
      {/* 顶部导航栏：白色半透明 */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <span className="font-medium text-teal-800">{t('analysis.listTitle')}</span>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 p-8">
        {results.length === 0 ? (
          <p className="text-white">{t('analysis.noRecords')}</p>
        ) : (
          <ul className="space-y-6">
            {results.map(r => (
              <li key={r.id} className="p-6 bg-teal-100 border border-teal-200 rounded-lg shadow">
                <h2 className="font-semibold text-teal-800">
                  {r.quiz_theme} - {t('analysis.score')} {r.score}/{r.answers ? r.answers.length : '-'}
                </h2>

                {/* 语言选择器 */}
                <div className="mt-3">
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as Lang)}
                    className="border border-teal-400 rounded p-2 text-teal-800 bg-white"
                  >
                    <option value="en">{t('common.english')}</option>
                    <option value="zh">{t('common.chinese')}</option>
                    <option value="ms">{t('common.malay')}</option>
                  </select>
                </div>

                {/* AI feedback */}
                <p className="whitespace-pre-line mt-3 text-teal-700">
                  {r.analysis_feedback?.[lang] || t('analysis.noFeedback')}
                </p>

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

      {/* 底部版权栏：白色半透明 */}
      <footer className="border-t border-white/20 py-6 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-teal-800">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>
    </div>
  )
}