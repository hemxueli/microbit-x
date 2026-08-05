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

    // 1. 查学生最新一次答题
    const { data: quizResult, error: resultError } = await supabase
      .from("quiz_results")
      .select("quiz_theme, answers, score, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (resultError || !quizResult) {
      return NextResponse.json({ error: "No quiz data found" }, { status: 404 })
    }

    // 2. 查题库里的题目和正确答案
    const { data: questions, error: questionError } = await supabase
      .from("quiz_questions")
      .select("id, question_text, options, correct_answer")
      .eq("quiz_theme", quizResult.quiz_theme)
      .order("id")

    if (questionError || !questions) {
      return NextResponse.json({ error: "No questions found" }, { status: 404 })
    }

    // 3. 生成 detailedAnswers
    const detailedAnswers = questions.map((q, idx) => ({
      question_id: q.id,
      question_text: q.question_text,
      options: q.options,
      student_answer: quizResult.answers[idx],
      student_answer_text: q.options[quizResult.answers[idx] - 1],
      correct_answer: q.correct_answer,
      correct_answer_text: q.options[q.correct_answer - 1],
      is_correct: quizResult.answers[idx] === q.correct_answer,
    }))

    // 4. AI 分析 Prompt
    const prompt = `
The student scored ${quizResult.score}/${questions.length} in the quiz on theme "${quizResult.quiz_theme}".
Here are the answers:

${JSON.stringify(detailedAnswers, null, 2)}

Please analyze:
1. Which questions were answered incorrectly.
2. What knowledge points are weak.
3. Provide improvement suggestions.
    `

    // 5. 返回 JSON + AI 分析
    const aiStream = await streamText({ model, prompt })

    return NextResponse.json({
      quiz_theme: quizResult.quiz_theme,
      score: quizResult.score,
      created_at: quizResult.created_at,
      detailedAnswers,
      ai_feedback: aiStream, // AI 分析结果
    })
  } catch (error) {
    console.error("AI analysis error:", error)
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 })
  }
}
