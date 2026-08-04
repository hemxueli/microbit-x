import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const model = google("gemini-flash-latest")

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 用 service role key，保证能读表
)

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json()

    // 从 Supabase 拿 quiz 数据
    const { data, error } = await supabase
      .from("quiz_results")
      .select("quiz_theme, score")
      .eq("user_id", user_id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "No quiz data found" },
        { status: 404 }
      )
    }

    const prompt = `The student scored ${data.score}/10 in the quiz on theme "${data.quiz_theme}".
Please analyze which knowledge points are weak and provide improvement suggestions.`

    return streamText({
      model,
      prompt,
    })
  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json(
      { error: "AI analysis failed, please check configuration." },
      { status: 500 }
    )
  }
}
