'use client'
import { useCompletion } from '@ai-sdk/react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function StudentAnalysisClient({ userId }: { userId: string }) {
  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: '/api/analyzeQuiz',
  })

  useEffect(() => {
    complete(JSON.stringify({ user_id: userId }))
  }, [userId, complete])

  const saveAnalysis = async () => {
    const res = await fetch('/api/saveQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        quiz_theme: "Basic Quiz",
        score: 0, // 可从数据库拿最新分数
        answers: [],
        analysis_feedback: completion,
      }),
    })

    const data = await res.json()
    if (data.success) {
      window.location.href = '/student/analysis-list'
    } else {
      alert(data.error || "保存失败")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Analysis</h1>
      <div className="whitespace-pre-line bg-gray-100 p-4 rounded min-h-[10rem]">
        {completion}
        {isLoading && <p>正在生成分析...</p>}
        {error && <p className="text-red-500">分析失败</p>}
      </div>
      <div className="flex gap-4 mt-6">
        <Button className="bg-teal-500 text-white" onClick={saveAnalysis} disabled={!completion}>
          保存分析
        </Button>
        <Button className="bg-gray-400 text-white" onClick={() => (window.location.href = '/student')}>
          返回
        </Button>
        {isLoading && <Button onClick={() => stop()}>停止生成</Button>}
      </div>
    </div>
  )
}
