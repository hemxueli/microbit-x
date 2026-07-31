'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function QuizInputPage() {
  const { t } = useI18n()
  const questions = [
    'quiz.input.q1',
    'quiz.input.q2',
    'quiz.input.q3',
    'quiz.input.q4',
    'quiz.input.q5',
    'quiz.input.q6',
    'quiz.input.q7',
    'quiz.input.q8',
    'quiz.input.q9',
    'quiz.input.q10',
  ]

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
    <div className="p-8 min-h-screen bg-gradient-to-r from-teal-50 via-white to-teal-100 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-teal-700 animate-bounce">🎛️ {t('quiz.title.input')}</h1>
        <div className="flex gap-4">
          <button
            onClick={toggleMute}
            className="px-3 py-1 bg-teal-200 text-teal-800 rounded-lg hover:bg-teal-300"
          >
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
        {/* 图片位子 */}
        <div className="w-1/3 flex items-center justify-center bg-teal-50 rounded-lg border border-teal-200">
          <img src={`/images/input/${questions[current]}.png`} alt="quiz illustration" className="max-h-40" />
        </div>

        {/* 题目和选项 */}
        <div className="flex-1">
          <p className="font-semibold mb-4 text-xl text-teal-700">{t(questions[current])}</p>
          {t(`${questions[current]}.options`).split(',').map((opt, j) => (
            <button
              key={j}
              onClick={() => {
                const newAns = [...answers]
                newAns[current] = j
                setAnswers(newAns)
              }}
              className={`block w-full text-left px-4 py-2 mb-2 rounded-lg border transition transform hover:scale-105 ${
                answers[current] === j
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
        <button
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
          className="px-4 py-2 bg-teal-300 text-teal-900 rounded-lg hover:bg-teal-400 disabled:opacity-50"
        >
          ⬅️ {t('common.back')}
        </button>
        {current < questions.length - 1 ? (
          <button
            disabled={answers[current] === -1}
            onClick={() => setCurrent(current + 1)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {t('quiz.next')} ➡️
          </button>
        ) : (
          <button
            disabled={answers[current] === -1}
            onClick={submitQuiz}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse disabled:opacity-50"
          >
            {t('quiz.finish')}
          </button>
        )}
      </div>

      {/* 结果显示 */}
      {showResult && score !== null && (
        <div className="mt-8 text-center animate-fadeIn">
          <p className="text-2xl font-bold text-teal-700">
            🎉 {t('quiz.yourScore')}: {score}/{questions.length}
          </p>
        </div>
      )}
    </div>
  )
}
