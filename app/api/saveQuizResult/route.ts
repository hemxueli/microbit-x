// app/api/saveQuizResult/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const { quiz_theme, score, ai_feedback } = await req.json()

    // 获取当前登录用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('获取用户失败:', userError)
      return NextResponse.json({ error: '无法获取用户信息' }, { status: 401 })
    }
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    // 插入到 Supabase 数据库
    const { error } = await supabase.from('quiz_results').insert({
      user_id: user.id,
      quiz_theme,
      score,
      ai_feedback,
    })

    if (error) {
      console.error('保存失败:', error)
      return NextResponse.json({ error: '保存失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'AI 分析已保存！' })
  } catch (err) {
    console.error('API 错误:', err)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
