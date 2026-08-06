'use client'
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function QuizMusicPage() {
  const router = useRouter()
  const { t } = useI18n()

  // 保存结果到 Supabase
  const saveResult = async (theme: string, answers: number[], score: number, details: any[]) => {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      alert('Please log in first to save results')
      return
    }

    const { error } = await supabase.from('quiz_results').insert([
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
      alert('Quiz result saved successfully!')
    }
  }

  const questions = [
    'quiz.music.q1','quiz.music.q2','quiz.music.q3','quiz.music.q4','quiz.music.q5',
    'quiz.music.q6','quiz.music.q7','quiz.music.q8','quiz.music.q9','quiz.music.q10',
  ]

  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [score, setScore] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [current, setCurrent] = useState(0)
  const [muted, setMuted] = useState(false)
  const [bgm, setBgm] = useState<HTMLAudioElement | null>(null)

  // 背景音乐
  useEffect(() => {
    const audio = new Audio('/music/quiz.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.play().catch(() => {})
    setBgm(audio)
    return () => audio.pause()
  }, [])

  const toggleMute = () => {
    if (bgm) {
      bgm.muted = !bgm.muted
      setMuted(bgm.muted)
    }
  }

  const submitQuiz = async () => {
    let s = 0
    const resultData = questions.map((q, i) => {
      const options = t(`${q}.options`).split(',').map(opt => opt.trim())
      const correctIndex = options.findIndex(opt => opt === t(`${q}.answer`))
      const studentIndex = answers[i]   // ✅ 1-based
      const studentAnswerText = studentIndex > 0 ? options[studentIndex - 1] : null
      const correctAnswerText = options[correctIndex]
      const isCorrect = studentIndex === (correctIndex + 1)
      if (isCorrect) s++
      return {
        question_key: q,
        options,
        student_answer: studentIndex,
        student_answer_text: studentAnswerText,
        correct_answer: correctIndex + 1,
        correct_answer_text: correctAnswerText,
        is_correct: isCorrect
      }
    })
    setScore(s)
    setShowResult(true)
    await saveResult('music', answers, s, resultData)
  }

  // ✅ Start 界面
  if (!started) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-green-100/70">
        <div className="text-center">
          <button
            onClick={() => setStarted(true)}
            className="px-8 py-4 bg-teal-600 text-white rounded-lg text-2xl font-bold hover:bg-teal-700 animate-pulse"
          >
            🚀 {t('quiz.start')}
          </button>
          <div className="mt-6"><LanguageSwitcher /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-teal-50 via-white to-teal-100 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-700 animate-bounce">🎵 {t('quiz.music')}</h1>
        <div className="flex gap-4">
          <button onClick={toggleMute} className="px-3 py-1 bg-teal-200 text-teal-800 rounded-lg hover:bg-teal-300">
            {muted ? `🔇 ${t('quiz.mute')}` : `🔊 ${t('quiz.sound')}`}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-4 text-center font-semibold text-teal-600">
        {t('quiz.question')} {current + 1} {t('quiz.of')} {questions.length}
      </div>

      {/* 当前题目卡片 */}
      <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-teal-400 animate-slideUp flex gap-6">
        {/* 左边图片 */}
        <div className="w-1/3 flex items-center justify-center bg-teal-50 rounded-lg border border-teal-200">
          <img src={`/images/music/${questions[current]}.png`} alt="quiz illustration" className="max-h-40" />
        </div>

        {/* 右边题目和选项 */}
        <div className="flex-1">
          <p className="font-semibold mb-4 text-xl text-teal-700">{t(questions[current])}</p>
          {t(`${questions[current]}.options`).split(',').map((opt, j) => (
            <button
              key={j}
              onClick={() => {
                const newAns = [...answers]
                newAns[current] = j + 1   // ✅ 存 1-based
                setAnswers(newAns)
              }}
              className={`block w-full text-left px-4 py-2 mb-2 rounded-lg border transition transform hover:scale-105 ${
                answers[current] === j + 1
                  ? 'bg-teal-200 border-teal-600 text-teal-900 font-bold'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              {opt.trim()}
            </button>
          ))}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-between mt-6">
        <button disabled={current === 0} onClick={() => setCurrent(current - 1)} className="px-4 py-2 bg-teal-300 text-teal-900 rounded-lg hover:bg-teal-400 disabled:opacity-50">⬅️ {t('common.back')}</button>
        {current < questions.length - 1 ? (
          <button disabled={answers[current] === -1} onClick={() => setCurrent(current + 1)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">{t('quiz.next')} ➡️</button>
        ) : (
          <button disabled={answers[current] === -1} onClick={submitQuiz} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse disabled:opacity-50">{t('quiz.finish')}</button>
        )}
      </div>

     {/* 结果显示 */}
      {showResult && score !== null && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-96 animate-fadeIn">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              🎉 {t('quiz.yourScore')}: {score}/{questions.length}
            </h2>

                        <p className="text-lg text-gray-700 mb-6">
              {score <= 3
                ? `${t('quiz.feedback.tryHarder')} 😢`
                : score <= 6
                ? `${t('quiz.feedback.good')} 👍`
                : score <= 9
                ? `${t('quiz.feedback.great')} 🌟`
                : `${t('quiz.feedback.perfect')} 🏆`}
            </p>

            {/* 两个按钮 */}
            <div className="flex justify-around">
              <button
                onClick={() => {
                  setAnswers(Array(questions.length).fill(-1))
                  setScore(null)
                  setShowResult(false)
                  setCurrent(0)
                }}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                🔄 {t('quiz.retry')}
              </button>
              <button
                onClick={() => {
                  if (score !== null) {
                    router.push(`/student/analysis?quizTheme=input&score=${score}`)
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                📊 {t('quiz.aiEvaluation')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
