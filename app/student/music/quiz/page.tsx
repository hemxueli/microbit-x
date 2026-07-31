'use client'

import { useState } from 'react'

export default function MusicQuizPage() {
  const questions = [
    {
      q: 'Which category is used to play sounds and music on the micro:bit?',
      ms: 'Kategori manakah digunakan untuk memainkan bunyi dan muzik pada micro:bit?',
      zh: '哪一个类别用于让 micro:bit 播放声音和音乐？',
      options: ['Basic / Asas / 基本', 'Input / Input / 输入', 'Music / Muzik / 音乐', 'Logic / Logik / 逻辑'],
      answer: 2,
      image: '/images/music-q1.png',
    },
    {
      q: 'Which block is used to play a melody?',
      ms: 'Blok manakah digunakan untuk memainkan melodi?',
      zh: '哪一个积木用于播放旋律？',
      options: ['Show Icon', 'Play Melody', 'Show Number', 'Temperature'],
      answer: 1,
      image: '/images/music-q2.png',
    },
    {
      q: 'What does the Play Tone block do?',
      ms: 'Apakah fungsi blok Play Tone?',
      zh: 'Play Tone 积木有什么作用？',
      options: ['Displays text', 'Detects light', 'Plays a musical note or tone', 'Measures temperature'],
      answer: 2,
      image: '/images/music-q3.png',
    },
    {
      q: 'Which block is used to stop all sounds?',
      ms: 'Blok manakah digunakan untuk menghentikan semua bunyi?',
      zh: '哪一个积木用于停止所有声音？',
      options: ['Set Volume', 'Rest', 'Ring Tone', 'Stop All Sounds'],
      answer: 3,
      image: '/images/music-q4.png',
    },
    {
      q: 'What is the function of the Set Volume block?',
      ms: 'Apakah fungsi blok Set Volume?',
      zh: 'Set Volume 积木有什么作用？',
      options: ['Changes LED brightness', 'Adjusts the sound volume', 'Changes the temperature', 'Changes the screen'],
      answer: 1,
      image: '/images/music-q5.png',
    },
    {
      q: 'Which value is commonly used as the default volume?',
      ms: 'Nilai manakah biasanya digunakan sebagai tahap bunyi lalai?',
      zh: '哪一个数值通常是默认音量？',
      options: ['0', '50', '127', '2550'],
      answer: 2,
      image: '/images/music-q6.png',
    },
    {
      q: 'What does Tempo (BPM) control?',
      ms: 'Apakah yang dikawal oleh Tempo (BPM)?',
      zh: 'Tempo（BPM） 控制什么？',
      options: ['Screen brightness', 'LED pattern', 'The speed of the music', 'Temperature'],
      answer: 2,
      image: '/images/music-q7.png',
    },
    {
      q: 'What does the Rest block do?',
      ms: 'Apakah fungsi blok Rest?',
      zh: 'Rest 积木有什么作用？',
      options: ['Plays music louder', 'Changes the tempo', 'Creates a short silence in the music', 'Displays a number'],
      answer: 2,
      image: '/images/music-q8.png',
    },
    {
      q: 'Which built-in sound can make the micro:bit sound like laughter? (micro:bit V2)',
      ms: 'Bunyi terbina dalam manakah boleh membuat micro:bit berbunyi seperti ketawa? (micro:bit V2)',
      zh: 'micro:bit V2 的哪一种内建音效像笑声？',
      options: ['Magic', 'Twinkle', 'Giggle', 'Boing'],
      answer: 2,
      image: '/images/music-q9.png',
    },
    {
      q: 'What is the main purpose of the Music category?',
      ms: 'Apakah tujuan utama kategori Music?',
      zh: 'Music 类别的主要作用是什么？',
      options: [
        'To receive input from sensors',
        'To display text and icons',
        'To play sounds, tones, and melodies',
        'To create LED patterns',
      ],
      answer: 2,
      image: '/images/music-q10.png',
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
      <h1 className="text-4xl font-bold mb-10 text-center">QUIZ: MakeCode Music</h1>
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
