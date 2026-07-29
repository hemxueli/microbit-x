'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'
import type { QuizData } from '@/lib/quiz'

export default function BasicEnPage() {
  const [showAI, setShowAI] = useState(false)
  const [showMakeCode, setShowMakeCode] = useState(false)

  // 禁止背景滚动
  useEffect(() => {
    if (showAI || showMakeCode) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [showAI, showMakeCode])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Canva Slide 学习内容 */}
      <main className="flex-1 p-6">
        <iframe
          src="https://addjkahub.my.canva.site/makecode-micro-bit-basics-preview"
          className="w-full h-[600px] rounded-lg shadow-md"
          allowFullScreen
        />
      </main>

      {/* 悬浮球 + 弹窗 */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2">
        {/* MakeCode 弹窗 */}
        {showMakeCode && (
          <div className="bg-white rounded-lg shadow-lg p-4 w-[900px] h-[600px] relative">
            <button
              onClick={() => setShowMakeCode(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <iframe
              src="https://makecode.microbit.org/"
              className="w-full h-full rounded-md"
            />
          </div>
        )}

        {/* AI 聊天弹窗 */}
        {showAI && (
          <div className="bg-white rounded-lg shadow-lg p-4 w-[400px] h-[500px] relative">
            <button
              onClick={() => setShowAI(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AiChatWidget
              defaultLanguage="en"
              quizData={{
                title: 'Sample Quiz',
                studentName: 'Student',
                score: 2,
                total: 3,
                questions: [
                  { question: 'What is a micro:bit button?', studentAnswer: 'Switch', correctAnswer: 'Input device', isCorrect: false },
                  { question: 'LED stands for?', studentAnswer: 'Light Emitting Diode', correctAnswer: 'Light Emitting Diode', isCorrect: true },
                  { question: 'Which sensor detects motion?', studentAnswer: 'Accelerometer', correctAnswer: 'Accelerometer', isCorrect: true },
                ],
              } as QuizData}
            />
            <Button
              variant="default"
              className="mt-4 w-full"
              onClick={() => setShowMakeCode(true)}
            >
              Open MakeCode
            </Button>
          </div>
        )}

        {/* 悬浮球按钮 */}
        <button
          onClick={() => setShowAI(!showAI)}
          className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center"
        >
          AI
        </button>
      </div>
    </div>
  )
}
