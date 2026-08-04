'use client'
import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'

export default function StudentAnalysisClient() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const quizTheme = searchParams.get('quizTheme') || ''
  const score = searchParams.get('score') || ''

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: '/api/analyzeQuiz',
  })

  useEffect(() => {
    if (quizTheme && score) {
      const prompt = `The student scored ${score}/10 in the quiz on theme "${quizTheme}". Please analyze which knowledge points are weak and provide improvement suggestions.`
      complete(prompt)
    }
  }, [quizTheme, score, complete])

  const saveAnalysis = async () => {
    const res = await fetch('/api/saveQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quiz_theme: quizTheme,
        score,
        ai_feedback: completion,
      }),
    })
    const data = await res.json()
    if (data.success) {
      alert(t('analysis.success'))
      window.location.href = '/student/analysis-list'
    } else {
      alert(data.error || t('analysis.error'))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('analysis.title')}</h1>

      <div className="whitespace-pre-line bg-gray-100 p-4 rounded min-h-[10rem]">
        {completion}

        {isLoading && (
          <div className="flex justify-start mt-2">
            <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
            </div>
          </div>
        )}

        {error && <p className="text-red-500">{t('analysis.error')}</p>}
      </div>

      <div className="flex gap-4 mt-6">
        <Button className="bg-teal-500 text-white" onClick={saveAnalysis} disabled={!completion}>
          {t('analysis.save')}
        </Button>
        <Button className="bg-gray-400 text-white" onClick={() => (window.location.href = '/student')}>
          {t('analysis.exit')}
        </Button>
        {isLoading && (
          <Button className="bg-gray-200 text-gray-700" onClick={() => stop()}>
            {t('analysis.stop')}
          </Button>
        )}
      </div>
    </div>
  )
}
