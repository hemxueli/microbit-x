import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const model = google("gemini-flash-latest")
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json()

    const { data, error } = await supabase
      .from("quiz_results")
      .select("quiz_theme, score, answers")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "No quiz data found" }, { status: 404 })
    }

    const prompt = `
The student scored ${data.score}/10 in the quiz on theme "${data.quiz_theme}".
Here are the answers:

${JSON.stringify(data.answers, null, 2)}

Please analyze:
1. Which questions were answered incorrectly.
2. What knowledge points are weak.
3. Provide improvement suggestions.
    `

    return streamText({ model, prompt })
  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 })
  }
}
