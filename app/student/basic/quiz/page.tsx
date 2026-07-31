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
      image: '/images/q1.png',
    },
    {
      q: 'What does the Show Number block do?',
      ms: 'Apakah fungsi blok Show Number?',
      zh: 'Show Number 积木有什么作用？',
      options: ['Plays music', 'Displays a number', 'Detects temperature', 'Turns off the micro:bit'],
      answer: 1,
      image: '/images/q2.png',
    },
    {
      q: 'Which block is used to display words such as "HELLO"?',
      ms: 'Blok manakah digunakan untuk memaparkan perkataan seperti "HELLO"?',
      zh: '哪一个积木可以显示 "HELLO" 这样的文字？',
      options: ['Show Number', 'Show Icon', 'Show String', 'Pause'],
      answer: 2,
      image: '/images/q3.png',
    },
    {
      q: 'Which block allows you to create your own 5×5 LED pattern?',
      ms: 'Blok manakah membolehkan anda mereka bentuk corak LED 5×5 sendiri?',
      zh: '哪一个积木可以自己设计 5×5 LED 图案？',
      options: ['Show Arrow', 'Show Icon', 'Show LEDs', 'Clear Screen'],
      answer: 2,
      image: '/images/q4.png',
    },
    {
      q: 'Which block repeats the program continuously?',
      ms: 'Blok manakah akan mengulangi program secara berterusan?',
      zh: '哪一个积木会不断重复执行程序？',
      options: ['Pause', 'On Start', 'Forever', 'Show Number'],
      answer: 2,
      image: '/images/q5.png',
    },
    {
      q: 'Which block runs only once when the program starts?',
      ms: 'Blok manakah hanya dijalankan sekali apabila program bermula?',
      zh: '哪一个积木会在程序开始时执行一次？',
      options: ['Forever', 'Show Icon', 'Pause', 'On Start'],
      answer: 3,
      image: '/images/q6.png',
    },
    {
      q: 'What does the Pause (ms) block do?',
      ms: 'Apakah fungsi blok Pause (ms)?',
      zh: 'Pause (ms) 积木有什么作用？',
      options: ['Shows an icon', 'Clears the screen', 'Delays the program for a period of time', 'Displays a number'],
      answer: 2,
      image: '/images/q7.png',
    },
    {
      q: 'Which block clears all LEDs on the micro:bit screen?',
      ms: 'Blok manakah memadam semua paparan LED pada micro:bit?',
      zh: '哪一个积木可以清除 micro:bit 上所有 LED？',
      options: ['Show LEDs', 'Show String', 'Pause', 'Clear Screen'],
      answer: 3,
      image: '/images/q8.png',
    },
    {
      q: 'Which block is used to display a direction such as North or East?',
      ms: 'Blok manakah digunakan untuk memaparkan arah seperti North atau East?',
      zh: '哪一个积木可以显示 North（北）或 East（东）等方向？',
      options: ['Show Icon', 'Show LEDs', 'Show String', 'Show Arrow'],
      answer: 3,
      image: '/images/q9.png',
    },
    {
      q: 'How many directions are available in the Show Arrow block?',
      ms: 'Berapakah jumlah arah yang terdapat dalam blok Show Arrow?',
      zh: 'Show Arrow 积木共有几个方向可以选择？',
      options: ['4', '6', '8', '10'],
      answer: 2,
      image: '/images/q10.png',
    },
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
    <div className="p-8 bg-teal-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center">QUIZ: MakeCode Basic</h1>
      {questions.map((q, i) => (
        <div key={i} className="mb-8 p-6 bg-white rounded-lg shadow flex gap-8 items-center">
          {/* 左边：题目和选项 */}
          <div className="flex-1">
            <p className="font-bold text-xl mb-4">
              {`Q${i + 1}. ${q.q}`}
              <br />
              <span className="text-gray-600 text-lg">{q.ms}</span>
              <br />
              <span className="text-gray-600 text-lg">{q.zh}</span>
            </p>
            {q.options.map((opt, j) => (
              <label key={j} className="block cursor-pointer text-lg mb-2">
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
                <span className="ml-3">{opt}</span>
              </label>
            ))}
            {score !== null && (
              <p className="mt-3 text-lg text-green-600">
                ✅ Correct Answer: {q.options[q.answer]}
              </p>
            )}
          </div>

          {/* 右边：图片 */}
          <div className="w-48 h-48 flex-shrink-0">
            <img
              src={q.image}
              alt={`Question ${i + 1}`}
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={submitQuiz}
          className="bg-teal-600 text-white px-8 py-3 rounded-lg text-xl font-bold hover:bg-teal-700"
        >
          Submit Quiz
        </button>

        {score !== null && (
          <p className="mt-8 text-2xl font-bold text-teal-700">
            🎉 Your Score: {score}/{questions.length}
          </p>
        )}
      </div>
    </div>
  )
}
