'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

export default function StudentAnalysisPage() {
  const router = useRouter()
  const { quiz_theme, score } = router.query
  const [feedback, setFeedback] = useState<string>('')

  useEffect(() => {
    if (!quiz_theme || !score) return
    const runAnalysis = async () => {
      const prompt = `
        学生在主题 ${quiz_theme} 的 Quiz 中得分 ${score}/10。
        请分析学生在哪些知识点上有不足，并给出改进建议。
      `
      const res = await fetch('/api/analyzeQuiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      setFeedback(data.text)
    }
    runAnalysis()
  }, [quiz_theme, score])

  const saveAnalysis = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert('请先登录')

    await supabase.from('quiz_results').insert({
      user_id: user.id,
      quiz_theme,
      score,
      ai_feedback: feedback,
    })
    alert('AI 分析已保存！')
    router.push('/student/analysis-list')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI 分析结果</h1>
      <p className="whitespace-pre-line bg-gray-100 p-4 rounded">{feedback || '分析中...'}</p>
      <div className="flex gap-4 mt-6">
        <Button className="bg-teal-500 text-white" onClick={saveAnalysis}>保存分析</Button>
        <Button className="bg-gray-400 text-white" onClick={() => router.push('/student/home')}>退出</Button>
      </div>
    </div>
  )
}
