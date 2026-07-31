'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function QuizMusicPage() {
  const { t } = useI18n()
  const questions = [
    'quiz.music.q1',
    'quiz.music.q2',
    'quiz.music.q3',
    'quiz.music.q4',
    'quiz.music.q5',
    'quiz.music.q6',
    'quiz.music.q7',
    'quiz.music.q8',
    'quiz.music.q9',
    'quiz.music.q10',
  ]

  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [score, setScore] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const submitQuiz = () => {
    let s = 0
    questions.forEach((q, i) => {
      const correct = t(`${q}.answer`)
      const selected = t(`${q}.options`).split(',')[answers[i]]?.trim()
      if (selected === correct) s++
    })
    setScore(s)
    setShowResult(true)
  }

  return (
    <div className="p-8 bg-teal-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎵 Quiz: MakeCode Music</h1>
        <LanguageSwitcher />
      </div>

      {questions.map((q, i) => (
        <div key={i} className="mb-6 p-4 bg-white rounded shadow">
          <p className="font-semibold mb-3">{t(q)}</p>
          {t(`${q}.options`).split(',').map((opt, j) => (
            <label key={j} className="block mb-2">
              <input
                type="radio"
                name={`q-${i}`}
                checked={answers[i] === j}
                onChange={() => {
                  const newAns = [...answers]
                  newAns[i] = j
                  setAnswers(newAns)
                }}
              />
              <span className="ml-2">{opt.trim()}</span>
            </label>
          ))}
          {showResult && (
            <p className="mt-2 text-green-600">
              ✅ Correct Answer: {t(`${q}.answer`)}
            </p>
          )}
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={submitQuiz}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700"
        >
          {t('common.submit')}
        </button>
        {showResult && score !== null && (
          <p className="mt-4 text-xl font-bold text-teal-700">
            🎉 {t('quiz.yourScore')}: {score}/{questions.length}
          </p>
        )}
      </div>
    </div>
  )
}
