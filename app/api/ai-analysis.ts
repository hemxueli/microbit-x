import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { score, total, mistakes, quiz_type, language } = await req.json()

  const prompt = `
  学生在 ${quiz_type} 测验中得分 ${score}/${total}。
  错题有：${mistakes.join(", ")}。
  请用简短的三语言反馈：
  - 中文：指出哪些题目需要努力，哪些已经掌握。
  - English: Give encouragement and highlight mastered topics.
  - Malay: Berikan maklum balas ringkas.
  `

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    prompt,
  })

  // ✅ 新写法：返回流式响应
  return result.toTextStreamResponse()
}
