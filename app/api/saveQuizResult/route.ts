import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { user_id, quiz_theme, score, answers, details } = await req.json()

    if (!user_id) {
      return NextResponse.json({ success: false, error: "MISSING_USER_ID" })
    }

    // 1. 保存成绩
    const { data, error } = await supabase.from("quiz_results").insert([
      {
        user_id,
        quiz_theme,
        score,
        answers, // JSONB
        details, // JSONB (逐题详情)
        created_at: new Date().toISOString(),
      },
    ]).select()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ success: false, error: "SAVE_FAILED" })
    }

    const inserted = data[0]

    // 2. 保存成功后，调用 AI 分析 API
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analyzeQuiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      })
    } catch (aiError) {
      console.error("AI analysis trigger error:", aiError)
      // ⚠️ 不影响保存成绩，只是分析失败
    }

    // 3. 返回保存成功
    return NextResponse.json({ success: true, id: inserted.id })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ success: false, error: "SERVER_ERROR" })
  }
}
