'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'

export default function StudentAnalysisListPage() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<any[]>([])

  useEffect(() => {
    const loadAnalyses = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('quiz_results')
        .select('id, quiz_theme, score, created_at, ai_feedback')
        .eq('user_id', user.id) // ✅ 只显示当前学生的分析
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAnalyses(data.filter(r => r.ai_feedback)) // 只显示保存过的分析
      }
    }
    loadAnalyses()
  }, [])

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
              <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-line">
                {a.ai_feedback}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
