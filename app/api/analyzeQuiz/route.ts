// app/api/analyzeQuiz/route.ts
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'

// 初始化 Gemini 模型，手动指定你的环境变量
const model = google('gemini-1.5-flash')

export async function POST(req: Request) {
  try {
    const { quiz_theme, score } = await req.json()

    const prompt = `学生在主题 ${quiz_theme} 的 Quiz 中得分 ${score}/10。请分析学生在哪些知识点上有不足，并给出改进建议。`

    // 返回流式响应，前端 useChat 可以直接消费
    return streamText({
      model,
      messages: [
        {
          role: 'system',
          content: '你是一位教育专家，请根据学生的 quiz 表现给出详细分析和改进建议。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
  } catch (error) {
    console.error('AI 分析错误:', error)
    return NextResponse.json({ error: 'AI 分析出错，请检查配置。' }, { status: 500 })
  }
}
