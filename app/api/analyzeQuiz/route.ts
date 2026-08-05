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

    // 1. Get latest quiz result
    const { data: quizResult, error: resultError } = await supabase
      .from("quiz_results")
      .select("quiz_theme, answers, score, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (resultError || !quizResult) {
      return NextResponse.json({ error: "NO_QUIZ_DATA" }, { status: 404 })
    }

    // 2. Get questions
    const { data: questions, error: questionError } = await supabase
      .from("quiz_questions")
      .select("id, question_text, options, correct_answer")
      .eq("quiz_theme", quizResult.quiz_theme)
      .order("id")

    if (questionError || !questions) {
      return NextResponse.json({ error: "NO_QUESTIONS" }, { status: 404 })
    }

    // 3. Build detailedAnswers
    const detailedAnswers = questions.map((q, idx) => ({
      question_id: q.id,
      question_text: q.question_text,
      options: q.options,
      student_answer: quizResult.answers[idx],
      student_answer_text:
        quizResult.answers[idx] > 0 ? q.options[quizResult.answers[idx] - 1] : null,
      correct_answer: q.correct_answer,
      correct_answer_text: q.options[q.correct_answer - 1],
      is_correct: quizResult.answers[idx] === q.correct_answer,
    }))

    // 4. AI Prompt (force JSON output)
    const prompt = `
The student scored ${quizResult.score}/${questions.length} in the quiz on theme "${quizResult.quiz_theme}".
Here are the answers:

${JSON.stringify(detailedAnswers, null, 2)}

Please provide analysis in THREE languages:
1. English
2. Chinese (中文)
3. Malay (Bahasa Melayu)

Include:
- Incorrect questions
- Weak knowledge points
- Improvement suggestions

Output STRICT JSON format:
{
  "en": "English feedback here",
  "zh": "中文反馈在这里",
  "ms": "Maklum balas Bahasa Melayu di sini"
}
`

    // 5. Call AI and parse JSON
    const aiResult = await generateText({ model, prompt })
    const aiText = aiResult.text
    let ai_feedback
    try {
      ai_feedback = JSON.parse(aiText)
    } catch {
      ai_feedback = { en: aiText, zh: aiText, ms: aiText }
    }

    // 6. Return response
    return NextResponse.json({
      quiz_theme: quizResult.quiz_theme,
      score: quizResult.score,
      created_at: quizResult.created_at,
      detailedAnswers,
      ai_feedback,
    })
  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json({ error: "AI_ANALYSIS_FAILED" }, { status: 500 })
  }
}
