'use client'
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"


import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

export default function StudentAnalysisClient() {
  const params = useSearchParams()
  const [quizTheme, setQuizTheme] = useState<string | null>(null)
  const [score, setScore] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    setQuizTheme(params.get('quiz_theme'))
    setScore(params.get('score'))
  }, [params])

  useEffect(() => {
    if (!quizTheme || !score) return
    const runAnalysis = async () => {
      const prompt = `学生在主题 ${quizTheme} 的 Quiz 中得分 ${score}/10。请分析学生在哪些知识点上有不足，并给出改进建议。`
      const res = await fetch('/api/analyzeQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      setFeedback(data.text)
    }
    runAnalysis()
  }, [quizTheme, score])

  const saveAnalysis = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('请先登录')

    await supabase.from('quiz_results').insert({
      user_id: user.id,
      quiz_theme: quizTheme,
      score,
      ai_feedback: feedback,
    })
    alert('AI 分析已保存！')
    window.location.href = '/student/analysis-list'
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI 分析结果</h1>
      <p className="whitespace-pre-line bg-gray-100 p-4 rounded">
        {feedback || '分析中...'}
      </p>
      <div className="flex gap-4 mt-6">
        <Button className="bg-teal-500 text-white" onClick={saveAnalysis}>
          保存分析
        </Button>
        <Button className="bg-gray-400 text-white" onClick={() => window.location.href='/student/home'}>
          退出
        </Button>
      </div>
    </div>
  )
}
