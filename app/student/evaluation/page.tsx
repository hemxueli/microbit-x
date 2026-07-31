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
  const [analysis, setAnalysis] = useState<string>("")
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

  async function runAnalysis() {
    setLoading(true)
    const res = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: results[0]?.score,
        total: results[0]?.total,
        mistakes: results[0]?.answers.mistakes,
        quiz_type: results[0]?.quiz_type,
        language: lang,
      }),
    })
    const data = await res.json()
    setAnalysis(data.text)
    setLoading(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-indigo-600 text-white shadow-md">
        <h1 className="text-2xl font-bold">{t('quiz.studentEvaluation')}</h1>
        <LanguageSwitcher />
      </header>

      {/* Main content */}
      <main className="flex-1 p-8">
        <table className="w-full border-collapse bg-white shadow-lg rounded-xl overflow-hidden">
          <thead className="bg-indigo-200 text-indigo-900">
            <tr>
              <th className="p-3 border">{t('quiz.date')}</th>
              <th className="p-3 border">{t('quiz.score')}</th>
              <th className="p-3 border">{t('quiz.mistakes')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="text-center">
                <td className="p-3 border">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3 border">{r.score}/{r.total}</td>
                <td className="p-3 border">{r.answers.mistakes.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* AI 分析按钮 */}
        <div className="mt-6 text-center">
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? t('quiz.loading') : `🤖 ${t('quiz.runAi')}`}
          </button>
        </div>

        {/* AI 分析结果 */}
        {analysis && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow-md text-indigo-700 whitespace-pre-line">
            {analysis}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 bg-indigo-600 text-center text-white">
        © 2026 Student Evaluation System
      </footer>
    </div>
  )
}
