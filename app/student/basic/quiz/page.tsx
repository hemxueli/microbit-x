'use client'

import { useState } from 'react'

export default function QuizPage() {
  const questions = [
    {
      q: 'Which category contains the Show Icon block?',
      ms: 'Kategori manakah yang mempunyai blok Show Icon?',
      zh: 'Show Icon 属于哪一个类别？',
      options: ['Music / Muzik / 音乐', 'Input / Input / 输入', 'Basic / Asas / 基本', 'Logic / Logik / 逻辑'],
      answer: 2,
      image: '/images/q1.png', // 每题对应的图片路径
    },
    {
      q: 'What does the Show Number block do?',
      ms: 'Apakah fungsi blok Show Number?',
      zh: 'Show Number 积木有什么作用？',
      options: ['Plays music', 'Displays a number', 'Detects temperature', 'Turns off the micro:bit'],
      answer: 1,
      image: '/images/q2.png',
    },
    // ...继续写完 10 道题，每题加 image 字段
  ]

  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [score, setScore] = useState<number | null>(null)

  const submitQuiz = () => {
    let s = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) s++
    })
    setScore(s)
  }

  return (
    <div className="p-6 bg-teal-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">QUIZ: MakeCode Basic</h1>
      {questions.map((q, i) => (
        <div key={i} className="mb-6 p-4 bg-white rounded-lg shadow flex gap-6">
          {/* 左边：题目和选项 */}
          <div className="flex-1">
            <p className="font-semibold mb-2">
              {`Q${i + 1}. ${q.q}`}
              <br />
              <span className="text-gray-600 text-sm">{q.ms}</span>
              <br />
              <span className="text-gray-600 text-sm">{q.zh}</span>
            </p>
            {q.options.map((opt, j) => (
              <label key={j} className="block cursor-pointer">
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
                <span className="ml-2">{opt}</span>
              </label>
            ))}
            {score !== null && (
              <p className="mt-2 text-sm text-green-600">
                ✅ Correct Answer: {q.options[q.answer]}
              </p>
            )}
          </div>

          {/* 右边：图片 */}
          <div className="w-40 h-40 flex-shrink-0">
            <img
              src={q.image}
              alt={`Question ${i + 1}`}
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>
        </div>
      ))}

      <button
        onClick={submitQuiz}
        className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700"
      >
        Submit Quiz
      </button>

      {score !== null && (
        <p className="mt-6 text-lg font-bold">
          🎉 Your Score: {score}/{questions.length}
        </p>
      )}
    </div>
  )
}
