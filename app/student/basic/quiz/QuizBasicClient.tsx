'use client'
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function QuizBasicPage() {
  const router = useRouter()
  const { t } = useI18n()

  // 保存结果到 Supabase
  const saveResult = async (theme: string, answers: number[], score: number, details: any[]) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Failed to get user info:', userError)
      alert('Please log in first to save results')
      return
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .insert([
        {
          user_id: user.id,
          quiz_theme: theme,
          answers,       // ✅ 存 1-based 索引
          score,
          details,       // ✅ 存完整逐题详情
          created_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Save failed:', error)
      alert('Save failed, please check configuration')
    } else {
      console.log('Save successful:', data)
      alert('Quiz result saved successfully!')
    }
  }

  const questions = [
    'quiz.basic.q1',
    'quiz.basic.q2',
    'quiz.basic.q3',
    'quiz.basic.q4',
    'quiz.basic.q5',
    'quiz.basic.q6',
    'quiz.basic.q7',
    'quiz.basic.q8',
    'quiz.basic.q9',
    'quiz.basic.q10',
  ]

  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [score, setScore] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [current, setCurrent] = useState(0)

  const submitQuiz = async () => {
    let s = 0

    const resultData = questions.map((q, i) => {
      const options = t(`${q}.options`).split(',').map(opt => opt.trim())
      const correctIndex = options.findIndex(opt => opt === t(`${q}.answer`))
      const studentIndex = answers[i]   // ✅ 已经是 1-based
      const studentAnswerText = studentIndex > 0 ? options[studentIndex - 1] : null
      const correctAnswerText = options[correctIndex]
      const isCorrect = studentIndex === (correctIndex + 1)

      if (isCorrect) s++

      return {
        question_key: q,
        options,
        student_answer: studentIndex,
        student_answer_text: studentAnswerText,
        correct_answer: correctIndex + 1, // ✅ 存 1-based
        correct_answer_text: correctAnswerText,
        is_correct: isCorrect
      }
    })

    setScore(s)
    setShowResult(true)

    // 自动保存成绩到 Supabase
    await saveResult('basic', answers, s, resultData)
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-teal-50 via-white to-teal-100">
      {/* 当前题目卡片 */}
      <div>
        <p>{t(questions[current])}</p>
        {t(`${questions[current]}.options`).split(',').map((opt, j) => (
          <button
            key={j}
            onClick={() => {
              const newAns = [...answers]
              newAns[current] = j + 1   // ✅ 存 1-based
              setAnswers(newAns)
            }}
            className={answers[current] === j + 1 ? 'bg-teal-200' : 'bg-gray-100'}
          >
            {opt.trim()}
          </button>
        ))}
      </div>

      {/* 控制按钮 */}
      {current < questions.length - 1 ? (
        <button
          disabled={answers[current] === -1}
          onClick={() => setCurrent(current + 1)}
        >
          Next
        </button>
      ) : (
        <button
          disabled={answers[current] === -1}
          onClick={submitQuiz}
        >
          Finish
        </button>
      )}

      {/* 结果显示 */}
      {showResult && score !== null && (
        <div>
          <h2>Your Score: {score}/{questions.length}</h2>
        </div>
      )}
    </div>
  )
}
