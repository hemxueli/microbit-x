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

    // 2. 解析 details
    const detailedAnswers =
      typeof quizResult.details === "string"
        ? JSON.parse(quizResult.details)
        : quizResult.details

    if (!detailedAnswers || detailedAnswers.length === 0) {
      return NextResponse.json({ error: "NO_DETAILS" }, { status: 404 })
    }

    // 3. AI Prompt —— 强制只输出 JSON
    const prompt = `
The student scored ${quizResult.score}/${detailedAnswers.length} in the quiz on theme "${quizResult.quiz_theme}".
Here are the answers:

${JSON.stringify(detailedAnswers, null, 2)}

Please provide analysis in THREE languages:
1. English
2. Chinese (中文)
3. Malay (Bahasa Melayu)

⚠️ IMPORTANT: Output ONLY valid JSON. Do not include any explanation, text, or formatting outside the JSON.
Format:
{
  "en": "English feedback here",
  "zh": "中文反馈在这里",
  "ms": "Maklum balas Bahasa Melayu di sini"
}
`

    // 4. 调用 AI
    const aiResult = await generateText({ model, prompt })
    let ai_feedback: { en: string; zh: string; ms: string }

    try {
      ai_feedback = JSON.parse(aiResult.text)
    } catch {
      ai_feedback = {
        en: aiResult.text || "No feedback available",
        zh: "暂无分析",
        ms: "Tiada maklum balas"
      }
    }

    // 5. 更新数据库（只 update，不 insert）
    const { error: updateError } = await supabase
      .from("quiz_results")
      .update({ analysis_feedback: ai_feedback })
      .eq("id", quizResult.id)

    if (updateError) {
      return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 })
    }

    // 6. 返回结果（包含 details + ai_feedback）
    return NextResponse.json({
      quiz_theme: quizResult.quiz_theme,
      score: quizResult.score,
      total_questions: detailedAnswers.length,
      created_at: quizResult.created_at,
      details: detailedAnswers,
      ai_feedback
    })
  } catch (error) {
    console.error("❌ AI analysis error:", error)
    return NextResponse.json({ error: "AI_ANALYSIS_FAILED" }, { status: 500 })
  }
}
