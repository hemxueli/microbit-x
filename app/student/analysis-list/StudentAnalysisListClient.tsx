'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function StudentAnalysisList({ userId }: { userId: string }) {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/getQuizResults?user_id=${userId}`)
      const data = await res.json()
      if (data.results) setResults(data.results)
    }
    fetchResults()
  }, [userId])

  const deleteResult = async (id: string) => {
    const res = await fetch('/api/deleteQuizResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const data = await res.json()
    if (data.success) {
      setResults(results.filter(r => r.id !== id))
    } else {
      alert(data.error || "删除失败")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">我的分析记录</h1>
      {results.length === 0 ? (
        <p>暂无分析记录</p>
      ) : (
        <ul className="space-y-4">
          {results.map(r => (
            <li key={r.id} className="p-4 bg-gray-100 rounded">
              <h2 className="font-semibold">{r.quiz_theme} - 得分 {r.score}/10</h2>
              <p className="whitespace-pre-line mt-2">{r.analysis_feedback}</p>
              <p className="text-sm text-gray-500 mt-1">保存时间: {new Date(r.created_at).toLocaleString()}</p>
              <Button className="bg-red-500 text-white mt-2" onClick={() => deleteResult(r.id)}>
                删除
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
