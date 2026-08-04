// app/api/getQuizResults/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // 获取当前登录用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('获取用户失败:', userError)
      return NextResponse.json({ error: '无法获取用户信息' }, { status: 401 })
    }
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    // 查询用户保存的 quiz 分析结果
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('查询失败:', error)
      return NextResponse.json({ error: '查询失败' }, { status: 500 })
    }

    return NextResponse.json({ results: data })
  } catch (err) {
    console.error('API 错误:', err)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
