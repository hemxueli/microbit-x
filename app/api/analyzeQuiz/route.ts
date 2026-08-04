import { NextResponse } from 'next/server'
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

// 初始化 Gemini 模型
const model = google('gemini-1.5-flash') // 你可以换成 gemini-1.5-pro

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    // 调用 Gemini 生成分析
    const result = await streamText({
      model,
      prompt,
    })

    // 把结果拼成字符串返回
    let text = ''
    for await (const chunk of result.textStream) {
      text += chunk
    }

    return NextResponse.json({ text })
  } catch (error) {
    console.error('AI 分析错误:', error)
    return NextResponse.json({ text: 'AI 分析出错，请检查配置。' }, { status: 500 })
  }
}
