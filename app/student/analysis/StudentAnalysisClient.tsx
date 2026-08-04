'use client'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'

// 定义消息类型
type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  parts: { type: 'text'; text: string }[]
}

export default function StudentAnalysisClient({
  quizTheme,
  score,
}: {
  quizTheme: string
  score: string
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/analyzeQuiz',
        body: () => ({ quiz_theme: quizTheme, score }),
      }),
    [quizTheme, score]
  )

  const { messages, sendMessage, status, error, stop } = useChat({ transport })

  useEffect(() => {
    if (quizTheme && score) {
      const prompt = `学生在主题 ${quizTheme} 的 Quiz 中得分 ${score}/10。请分析学生在哪些知识点上有不足，并给出改进建议。`
      sendMessage({ text: prompt })
    }
  }, [quizTheme, score, sendMessage])

  const feedback = (messages as ChatMessage[])
    .filter((m) => m.role === 'assistant')
    .map((m) => m.parts.map((p) => p.text).join(''))
    .join('\n')

  const saveAnalysis = async () => {
    const res = await fetch('/api/saveQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quiz_theme: quizTheme,
        score,
        ai_feedback: feedback,
      }),
    })
    const data = await res.json()
    if (data.success) {
      alert('AI 分析已保存！')
      window.location.href = '/student/analysis-list'
    } else {
      alert(data.error || '保存失败')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI 分析结果</h1>

      <div className="whitespace-pre-line bg-gray-100 p-4 rounded min-h-[10rem]">
        {feedback && feedback.length > 0 && feedback}

        {status === 'submitted' && (
          <div className="flex justify-start mt-2">
            <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
            </div>
          </div>
        )}

        {error && <p className="text-red-500">出错了: {String(error.message)}</p>}
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          className="bg-teal-500 text-white"
          onClick={saveAnalysis}
          disabled={!feedback}
        >
          保存分析
        </Button>
        <Button
          className="bg-gray-400 text-white"
          onClick={() => (window.location.href = '/student/home')}
        >
          退出
        </Button>
        {status === 'submitted' && (
          <Button
            className="bg-gray-200 text-gray-700"
            onClick={() => stop()}
          >
            停止生成
          </Button>
        )}
      </div>
    </div>
  )
}
