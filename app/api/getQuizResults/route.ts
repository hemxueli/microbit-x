import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get("user_id")

    if (!user_id) {
      return NextResponse.json({ error: "MISSING_USER_ID" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("quiz_results")
      .select("id, quiz_theme, score, created_at, analysis_feedback")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: "GET_RESULTS_FAILED" }, { status: 500 })
    }

    const parsedData = data.map(r => ({
      ...r,
      analysis_feedback: typeof r.analysis_feedback === "string"
        ? JSON.parse(r.analysis_feedback)
        : r.analysis_feedback
    }))

    return NextResponse.json({ results: parsedData })
  } catch {
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 })
  }
}
