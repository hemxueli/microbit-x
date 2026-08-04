'use client'
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { useEffect, useState } from 'react'

export default function StudentAnalysisListClient() {
  const [analyses, setAnalyses] = useState<any[]>([])

  // 加载分析记录
  useEffect(() => {
    const loadAnalyses = async () => {
      const res = await fetch('/api/getQuizResults')
      const data = await res.json()
      if (data.results) {
        setAnalyses(data.results.filter((r: any) => r.ai_feedback))
      }
    }
    loadAnalyses()
  }, [])

  // 删除分析记录
  const deleteAnalysis = async (id: string) => {
    const res = await fetch('/api/deleteQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      alert('删除成功')
      setAnalyses(analyses.filter(r => r.id !== id))
    } else {
      alert(data.error || '删除失败')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">📊 我的 AI 分析记录</h1>

      {analyses.length === 0 ? (
        <p className="text-gray-500">目前还没有保存的 AI 分析</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analyses.map((a) => (
            <div key={a.id} className="border rounded-lg shadow p-4 bg-white">
              <h2 className="text-lg font-bold text-teal-700 mb-2">
                {a.quiz_theme} Quiz
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                分数: {a.score}/10
              </p>
              <p className="text-xs text-gray-400 mb-3">
                保存时间: {new Date(a.created_at).toLocaleString()}
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-line mb-3">
                {a.ai_feedback}
              </div>
              <button
                onClick={() => deleteAnalysis(a.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
