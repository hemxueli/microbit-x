'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

type Lang = 'en' | 'zh' | 'ms'

interface DetailedAnswer {
  question_id: string
  question_text: string
  options: string[]
  student_answer: number
  student_answer_text: string
  correct_answer: number
  correct_answer_text: string
  is_correct: boolean
}

interface QuizAnalysis {
  quiz_theme: string
  score: number
  created_at: string
  detailedAnswers: DetailedAnswer[]
  ai_feedback: {
    en: string
    zh: string
    ms: string
  }
}

export default function StudentAnalysisClient({ userId }: { userId: string }) {
  const { t } = useI18n()
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<Lang>('en') // default English

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true)
      const res = await fetch('/api/analyzeQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      })
      const data = await res.json()
      setAnalysis(data)
      setLoading(false)
    }
    fetchAnalysis()
  }, [userId])

  const saveAnalysis = async () => {
    if (!analysis) return
    const res = await fetch('/api/saveQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        quiz_theme: analysis.quiz_theme,
        score: analysis.score,
        answers: analysis.detailedAnswers.map(a => a.student_answer),
        analysis_feedback: analysis.ai_feedback,
      }),
    })

    const data = await res.json()
    if (data.success) {
      window.location.href = '/student/analysis-list'
    } else {
      alert(data.error || t('analysis.saveFailed'))
    }
  }

  if (loading) return <p>{t('analysis.generating')}</p>
  if (!analysis) return <p className="text-red-500">{t('analysis.failed')}</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        {analysis.quiz_theme} - {t('analysis.score')} {analysis.score}/{analysis.detailedAnswers.length}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {t('analysis.completedAt')}: {new Date(analysis.created_at).toLocaleString()}
      </p>

      {/* Wrong answers list */}
      <ul className="space-y-4">
        {analysis.detailedAnswers.map((ans, idx) => (
          <li
            key={ans.question_id}
            className={`p-4 rounded ${ans.is_correct ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <h2 className="font-semibold">
              {t('analysis.question')} {idx + 1}: {ans.question_text}
            </h2>
            <p>{t('analysis.yourAnswer')}: {ans.student_answer_text}</p>
            <p>{t('analysis.correctAnswer')}: {ans.correct_answer_text}</p>
            <p>{ans.is_correct ? '✅ ' + t('analysis.correct') : '❌ ' + t('analysis.incorrect')}</p>
          </li>
        ))}
      </ul>

      {/* Language switcher */}
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
        <h2 className="text-xl font-bold mb-2">{t('analysis.aiFeedback')}</h2>
        <p>{analysis.ai_feedback[lang]}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-6">
        <Button className="bg-teal-500 text-white" onClick={saveAnalysis}>
          {t('analysis.save')}
        </Button>
        <Button className="bg-gray-400 text-white" onClick={() => (window.location.href = '/student')}>
          {t('common.back')}
        </Button>
      </div>
    </div>
  )
}
