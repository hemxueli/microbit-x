import type { NextApiRequest, NextApiResponse } from "next"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ error: "Missing prompt" })

    // 调用 Gemini 模型
    const result = await generateText({
      model: google("gemini-1.5-flash"), // 也可以换成 gemini-1.5-pro
      prompt: `
        你是一个教育分析助手，专门分析学生的测验结果并给出改进建议。
        以下是学生的测验情况：
        ${prompt}
      `,
    })

    return res.status(200).json({ text: result.text })
  } catch (error: any) {
    console.error("AI 分析错误:", error)
    return res.status(500).json({ error: "AI 分析失败" })
  }
}
