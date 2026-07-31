'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export default function StudentEvaluationPage() {
  const { t, lang } = useI18n()
  const [results, setResults] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchResults() {
      const { data } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('student_id', 'student123')
        .order('created_at', { ascending: false })
      setResults(data || [])
    }
    fetchResults()
  }, [])

  async function runAnalysis(result: any) {
    setLoading(true)
    const res = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: result.score,
        total: result.total,
        mistakes: result.answers.mistakes,
        quiz_type: result.quiz_type,
        language: lang, // 传当前语言
      }),
    })
    const data = await res.json()
    setAnalysis((prev) => ({ ...prev, [result.id]: data.text }))
    setLoading(false)
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">{t('quiz.studentEvaluation')}</h1>
        <LanguageSwitcher />
      </div>

      <table className="w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden">
        <thead className="bg-indigo-200 text-indigo-900">
          <tr>
            <th className="p-3 border">{t('quiz.date')}</th>
            <th className="p-3 border">{t('quiz.score')}</th>
            <th className="p-3 border">{t('quiz.mistakes')}</th>
            <th className="p-3 border">{t('quiz.aiEvaluation')}</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.id} className="text-center">
              <td className="p-3 border">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="p-3 border">{r.score}/{r.total}</td>
              <td className="p-3 border">{r.answers.mistakes.join(', ')}</td>
              <td className="p-3 border">
                {analysis[r.id] ? (
                  <div className="text-indigo-700 whitespace-pre-line">{analysis[r.id]}</div>
                ) : (
                  <button
                    onClick={() => runAnalysis(r)}
                    disabled={loading}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    {loading ? t('quiz.loading') : t('quiz.runAi')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
