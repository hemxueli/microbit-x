import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { google } from "@ai-sdk/google"
import { LANGUAGE_NAMES, type Lang } from "@/lib/i18n"
import type { QuizData } from "@/lib/quiz"

export const maxDuration = 30

function buildSystemPrompt(language: Lang, quizData?: QuizData) {
  const languageName = LANGUAGE_NAMES[language] ?? LANGUAGE_NAMES.en

  let prompt = `You are a friendly, patient tutor embedded in a BBC micro:bit learning website for school students.

CRITICAL LANGUAGE RULE: You MUST write your entire reply in ${languageName}. Do not mix languages unless the student explicitly asks. If the student writes in another language, still answer in ${languageName}.

Your role:
- Help students understand micro:bit topics: MakeCode blocks, MicroPython, buttons (A/B), LEDs, the accelerometer, compass, temperature sensor, radio, pins, and general programming concepts.
- You can also answer general school/learning questions.
- Keep answers short, clear, and age-appropriate. Use simple words and concrete examples.
- Encourage the student. Never just give the final answer to a graded question—guide them to understand it.
- Use short paragraphs or bullet points. Avoid long walls of text.`

  if (quizData && Array.isArray(quizData.questions) && quizData.questions.length > 0) {
    const lines = quizData.questions.map((q, i) => {
      const correct = q.isCorrect ?? q.studentAnswer?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase()
      return `Q${i + 1}: ${q.question}
   - Student answered: "${q.studentAnswer}"
   - Correct answer: "${q.correctAnswer}"
   - Result: ${correct ? "CORRECT" : "INCORRECT"}`
    })

    prompt += `

QUIZ RESULTS AVAILABLE FOR THIS STUDENT:
Title: ${quizData.title ?? "Quiz"}
Student: ${quizData.studentName ?? "Student"}
Score: ${quizData.score ?? "?"}/${quizData.total ?? quizData.questions.length}

${lines.join("\n")}

When the student asks you to evaluate or review their quiz:
- Summarize how they did overall in an encouraging tone.
- For each incorrect answer, gently explain the correct concept and why.
- Praise the correct answers briefly.
- Suggest 1-2 concrete things to study or try next on the micro:bit.
- Always respond in ${languageName}.`
  }

  return prompt
}
console.log("Google Key loaded:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

export async function POST(req: Request) {
  const {
    messages,
    language = "en",
    quizData,
  }: { messages: UIMessage[]; language?: Lang; quizData?: QuizData } = await req.json()

  const result = streamText({
    model: google("gemini-flash-latest"),
    system: buildSystemPrompt(language, quizData),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        const message = error instanceof Error ? error.message : String(error)
        console.log("[v0] chat stream error:", message)
        // Surface a recognizable code when the Google API key is missing or
        // invalid, so the client can show clear, localized guidance.
        if (/API key|API_KEY|GOOGLE_GENERATIVE_AI|permission|credential|unauthenticated|401|403/i.test(message)) {
          return "NEEDS_KEY"
        }
        return message
      },
    }),
  })
}
