'use client'

import { useState } from 'react'

export default function InputQuizPage() {
  const questions = [
    {
      q: 'Which category is used to receive information from buttons, sensors, and the environment?',
      ms: 'Kategori manakah digunakan untuk menerima maklumat daripada butang, sensor dan persekitaran?',
      zh: '哪一个类别用于接收按钮、传感器和周围环境的信息？',
      options: ['Basic / Asas / 基本', 'Input / Input / 输入', 'Music / Muzik / 音乐', 'Loops / Gelung / 循环'],
      answer: 1,
      image: '/images/input-q1.png',
    },
    {
      q: 'Which block runs when Button A is pressed?',
      ms: 'Blok manakah dijalankan apabila Butang A ditekan?',
      zh: '当按下 A 按钮时，哪一个积木会执行？',
      options: ['Show Number', 'Forever', 'On Button A Pressed', 'Show Icon'],
      answer: 2,
      image: '/images/input-q2.png',
    },
    {
      q: 'Which gesture is detected when you shake the micro:bit?',
      ms: 'Gerakan manakah dikesan apabila anda menggoncang micro:bit?',
      zh: '当你摇动 micro:bit 时，会检测到哪一种动作？',
      options: ['Tilt Left', 'Logo Up', 'Shake', 'Screen Down'],
      answer: 2,
      image: '/images/input-q3.png',
    },
    {
      q: 'Which block is used to detect the brightness of the surrounding environment?',
      ms: 'Blok manakah digunakan untuk mengesan tahap kecerahan persekitaran?',
      zh: '哪一个积木可以检测周围环境的亮度？',
      options: ['Temperature', 'Compass Heading', 'Light Level', 'Sound Level'],
      answer: 2,
      image: '/images/input-q4.png',
    },
    {
      q: 'Which block measures the surrounding temperature?',
      ms: 'Blok manakah mengukur suhu persekitaran?',
      zh: '哪一个积木可以测量周围温度？',
      options: ['Light Level', 'Temperature', 'Acceleration', 'Rotation'],
      answer: 1,
      image: '/images/input-q5.png',
    },
    {
      q: 'Which pins can be used as touch or input pins on the micro:bit?',
      ms: 'Pin manakah boleh digunakan sebagai pin sentuhan atau input pada micro:bit?',
      zh: 'micro:bit 的哪几个引脚可以作为输入引脚？',
      options: ['P3, P4, P5', 'P0, P1, P2', 'P6, P7, P8', 'P9, P10, P11'],
      answer: 1,
      image: '/images/input-q6.png',
    },
    {
      q: 'Which block tells the direction (North, East, South, or West)?',
      ms: 'Blok manakah menunjukkan arah seperti Utara, Timur, Selatan atau Barat?',
      zh: '哪一个积木可以显示方向（北、东、南、西）？',
      options: ['Temperature', 'Light Level', 'Compass Heading', 'Running Time'],
      answer: 2,
      image: '/images/input-q7.png',
    },
    {
      q: 'Which block measures movement or acceleration?',
      ms: 'Blok manakah mengukur pergerakan atau pecutan?',
      zh: '哪一个积木可以测量移动或加速度？',
      options: ['Rotation', 'Sound Level', 'Acceleration', 'Temperature'],
      answer: 2,
      image: '/images/input-q8.png',
    },
    {
      q: 'Which block can detect a loud sound? (micro:bit V2)',
      ms: 'Blok manakah boleh mengesan bunyi yang kuat? (micro:bit V2)',
      zh: '哪一个积木可以检测到很大的声音？（micro:bit V2）',
      options: ['Show Icon', 'Pause', 'Forever', 'On Loud Sound'],
      answer: 3,
      image: '/images/input-q9.png',
    },
    {
      q: 'What is the main purpose of the Input category?',
      ms: 'Apakah tujuan utama kategori Input?',
      zh: 'Input 类别的主要作用是什么？',
      options: [
        'To display icons and text',
        'To play music',
        'To receive input from users and sensors',
        'To draw LED patterns only',
      ],
      answer: 2,
      image: '/images/input-q10.png',
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
      <h1 className="text-4xl font-bold mb-10 text-center">QUIZ: MakeCode Input</h1>
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
