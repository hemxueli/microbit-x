import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { google } from "@ai-sdk/google"
import { generateText } from "ai"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const model = google("gemini-flash-latest")

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json()
    if (!user_id) {
      return NextResponse.json({ error: "MISSING_USER_ID" }, { status: 400 })
    }

    // 1. 获取最新成绩
    const { data: quizResults, error } = await supabase
      .from("quiz_results")
      .select("id, quiz_theme, score, details, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error || !quizResults || quizResults.length === 0) {
      return NextResponse.json({ error: "NO_QUIZ_DATA" }, { status: 404 })
    }

    const quizResult = quizResults[0]
    const detailedAnswers =
      typeof quizResult.details === "string"
        ? JSON.parse(quizResult.details)
        : quizResult.details

    // 2. AI Prompt
    const prompt = `
    The student scored ${quizResult.score}/${detailedAnswers.length} in the quiz on theme "${quizResult.quiz_theme}".
    Here are the answers:

    ${JSON.stringify(detailedAnswers, null, 2)}

    Please provide analysis in THREE languages:
    - English ("en")
    - Chinese ("zh")
    - Malay ("ms")

    Return ONLY a valid JSON object. Do NOT include any extra text, explanation, or code block markers.
    The output must look exactly like this:

    {
      "en": "English feedback here",
      "zh": "中文反馈在这里",
      "ms": "Maklum balas Bahasa Melayu di sini"
    }
    `


    // 3. 调用 AI
    const aiResult = await generateText({ model, prompt })
    let ai_feedback
    try {
      ai_feedback = JSON.parse(aiResult.text)
    } catch {
      ai_feedback = {
        en: aiResult.text || "No feedback available",
        zh: "暂无分析",
        ms: "Tiada maklum balas"
      }
    }

    // 4. 更新数据库
    await supabase
      .from("quiz_results")
      .update({ analysis_feedback: ai_feedback })
      .eq("id", quizResult.id)

    // 5. 返回结果
    return NextResponse.json({
      quiz_theme: quizResult.quiz_theme,
      score: quizResult.score,
      created_at: quizResult.created_at,
      details: detailedAnswers,
      ai_feedback
    })
  } catch (err) {
    console.error("❌ AI analysis error:", err)
    return NextResponse.json({ error: "AI_ANALYSIS_FAILED" }, { status: 500 })
  }
}
