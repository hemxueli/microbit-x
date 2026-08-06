import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ✅ 定义返回数据类型
interface QuizResult {
  id: string
  quiz_theme: string
  score: number
  created_at: string
  analysis_feedback: { en: string; zh: string; ms: string }
  details?: any[] // ✅ 可选
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get("user_id")
    const mode = searchParams.get("mode") // list 或 detail

    if (!user_id) {
      return NextResponse.json({ error: "MISSING_USER_ID" }, { status: 400 })
    }

    // ✅ 根据 mode 决定返回字段
    const fields =
      mode === "detail"
        ? "id, quiz_theme, score, created_at, analysis_feedback, details"
        : "id, quiz_theme, score, created_at, analysis_feedback"

    const { data, error } = await supabase
      .from("quiz_results")
      .select(fields)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "GET_RESULTS_FAILED" }, { status: 500 })
    }

    // ✅ 安全解析
    const parsedData: QuizResult[] = (data || []).map((r: any) => ({
      id: r.id,
      quiz_theme: r.quiz_theme,
      score: r.score,
      created_at: r.created_at,
      analysis_feedback:
        typeof r.analysis_feedback === "string"
          ? JSON.parse(r.analysis_feedback)
          : r.analysis_feedback,
      details:
        mode === "detail" && r.details
          ? typeof r.details === "string"
            ? JSON.parse(r.details)
            : r.details
          : undefined,
    }))

    return NextResponse.json({ results: parsedData })
  } catch (err) {
    console.error("❌ GET results error:", err)
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
