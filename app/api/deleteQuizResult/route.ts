// app/api/deleteQuizResult/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
  try {
    const { id } = await req.json()

    // 获取当前登录用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('获取用户失败:', userError)
      return NextResponse.json({ error: '无法获取用户信息' }, { status: 401 })
    }
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }

    // 删除指定记录（确保只能删除自己的）
    const { error } = await supabase
      .from('quiz_results')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('删除失败:', error)
      return NextResponse.json({ error: '删除失败' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: '分析记录已删除！' })
  } catch (err) {
    console.error('API 错误:', err)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
