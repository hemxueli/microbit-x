'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

type Lang = 'en' | 'zh' | 'ms'

interface QuizResult {
  id: string
  quiz_theme: string
  score: number
  total_questions: number
  created_at: string
  analysis_feedback: {
    en: string
    zh: string
    ms: string
  }
}

export default function StudentAnalysisListClient({ userId }: { userId: string }) {
  const { t } = useI18n()
  const [results, setResults] = useState<QuizResult[]>([])
  const [lang, setLang] = useState<Lang>('en') // default English
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const res = await fetch(`/api/getQuizResults?user_id=${userId}`)
      const data = await res.json()
      if (data.results) setResults(data.results)
      setLoading(false)
    }
    fetchResults()
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

  if (loading) return <p>{t('analysis.loading')}</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('analysis.listTitle')}</h1>
      {results.length === 0 ? (
        <p>{t('analysis.noRecords')}</p>
      ) : (
        <ul className="space-y-4">
          {results.map(r => (
            <li key={r.id} className="p-4 bg-gray-100 rounded">
              <h2 className="font-semibold">
                {r.quiz_theme} - {t('analysis.score')} {r.score}/{r.total_questions}
              </h2>

              {/* Language switcher */}
              <div className="mt-2 flex gap-2">
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
              <p className="whitespace-pre-line mt-2">
                {r.analysis_feedback[lang] || t('analysis.noFeedback')}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {t('analysis.savedAt')}: {new Date(r.created_at).toLocaleString()}
              </p>

              <Button className="bg-red-500 text-white mt-2" onClick={() => deleteResult(r.id)}>
                {t('common.delete')}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
