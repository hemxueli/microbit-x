import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { user_id, quiz_theme, score, answers, analysis_feedback } = await req.json()

    if (!user_id) {
      return NextResponse.json({ success: false, error: "MISSING_USER_ID" })
    }

    const { data, error } = await supabase.from("quiz_results").insert([
      {
        user_id,
        quiz_theme,
        score,
        total_questions: answers.length, // ✅ ensure total_questions is saved
        answers, // JSONB
        analysis_feedback, // JSONB { en, zh, ms }
        created_at: new Date().toISOString(),
      },
    ]).select()

    if (error) {
      return NextResponse.json({ success: false, error: "SAVE_FAILED" })
    }

    return NextResponse.json({ success: true, id: data[0].id })
  } catch {
    return NextResponse.json({ success: false, error: "SERVER_ERROR" })
  }
}
