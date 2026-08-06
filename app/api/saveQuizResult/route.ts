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
      console.error("❌ Supabase insert error:", error)
      return NextResponse.json({ success: false, error: "SAVE_FAILED" })
    }

    const inserted = data[0]

    // 2. 调用 AI 分析
    let ai_feedback = { en: "", zh: "", ms: "" }
    try {
      const prompt = `
The student scored ${score}/${details?.length || 0} in the quiz on theme "${quiz_theme}".
Here are the answers:

${JSON.stringify(details, null, 2)}

Please provide analysis in THREE languages:
1. English
2. Chinese (中文)
3. Malay (Bahasa Melayu)

⚠️ IMPORTANT: Output ONLY valid JSON. Do not include any explanation.
Format:
{
  "en": "English feedback here",
  "zh": "中文反馈在这里",
  "ms": "Maklum balas Bahasa Melayu di sini"
}
`
      const aiResult = await generateText({ model, prompt })

      // 打印 AI 原始输出
      console.log("🔎 AI raw output:", aiResult.text)

      try {
        ai_feedback = JSON.parse(aiResult.text)
      } catch {
        console.error("❌ AI output not JSON, fallback:", aiResult.text)
        ai_feedback = {
          en: aiResult.text || "No feedback available",
          zh: "暂无分析",
          ms: "Tiada maklum balas"
        }
      }

      // 更新数据库 —— 如果列是 JSONB 可以直接传对象；如果是 text 就用 JSON.stringify
      const { error: updateError } = await supabase
        .from("quiz_results")
        .update({ analysis_feedback: ai_feedback }) // 如果列是 text 改成 JSON.stringify(ai_feedback)
        .eq("id", inserted.id)

      if (updateError) {
        console.error("❌ Supabase update error:", updateError)
      } else {
        console.log("✅ Supabase update success:", ai_feedback)
      }
    } catch (aiError) {
      console.error("❌ AI analysis error:", aiError)
    }

    // 3. 返回保存成功 + analysis_feedback
    return NextResponse.json({ success: true, id: inserted.id, analysis_feedback: ai_feedback })
  } catch (err) {
    console.error("❌ Server error:", err)
    return NextResponse.json({ success: false, error: "SERVER_ERROR" })
  }
}
