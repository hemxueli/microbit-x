import { google } from "@ai-sdk/google"
import { generateText } from "ai"
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
    if (!user_id) {
      return NextResponse.json({ error: "MISSING_USER_ID" }, { status: 400 })
    }

    // 1. 获取最新成绩
    const { data: quizResults, error: resultError } = await supabase
      .from("quiz_results")
      .select("id, user_id, quiz_theme, answers, score, created_at, details")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (resultError || !quizResults || quizResults.length === 0) {
      return NextResponse.json({ error: "NO_QUIZ_DATA" }, { status: 404 })
    }

    const quizResult = quizResults[0]

    // 2. 直接用 details，不再重新拼
    const detailedAnswers =
      typeof quizResult.details === "string"
        ? JSON.parse(quizResult.details)
        : quizResult.details

    if (!detailedAnswers || detailedAnswers.length === 0) {
      return NextResponse.json({ error: "NO_DETAILS" }, { status: 404 })
    }

    // 3. AI Prompt
    const prompt = `
The student scored ${quizResult.score}/${detailedAnswers.length} in the quiz on theme "${quizResult.quiz_theme}".
Here are the answers:

${JSON.stringify(detailedAnswers, null, 2)}

Please provide analysis in THREE languages:
1. English
2. Chinese (中文)
3. Malay (Bahasa Melayu)

Output STRICT JSON format:
{
  "en": "English feedback here",
  "zh": "中文反馈在这里",
  "ms": "Maklum balas Bahasa Melayu di sini"
}
`

    // 4. 调用 AI
    const aiResult = await generateText({ model, prompt })
    const aiText = aiResult.text
    let ai_feedback
    try {
      const match = aiText.match(/\{[\s\S]*\}/)
      ai_feedback = match ? JSON.parse(match[0]) : { en: aiText, zh: aiText, ms: aiText }
    } catch {
      ai_feedback = { en: aiText, zh: aiText, ms: aiText }
    }

    // 5. 保存反馈
    await supabase
      .from("quiz_results")
      .update({ analysis_feedback: ai_feedback })
      .eq("id", quizResult.id)

    // 6. 返回结果
    return NextResponse.json({
      quiz_theme: quizResult.quiz_theme,
      score: quizResult.score,
      total_questions: detailedAnswers.length,
      created_at: quizResult.created_at,
      detailedAnswers,
      ai_feedback
    })
  } catch (error) {
    console.error("❌ AI analysis error:", error)
    return NextResponse.json({ error: "AI_ANALYSIS_FAILED" }, { status: 500 })
  }
}
