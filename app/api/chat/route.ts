import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { google } from "@ai-sdk/google"
import { LANGUAGE_NAMES, type Lang } from "@/lib/i18n"

export const maxDuration = 30

function buildSystemPrompt(language: Lang) {
  const languageName = LANGUAGE_NAMES[language] ?? LANGUAGE_NAMES.en

  return `You are a friendly, patient tutor embedded in a BBC micro:bit learning website for school students.

CRITICAL LANGUAGE RULE: You MUST write your entire reply in ${languageName}. Do not mix languages unless the student explicitly asks. If the student writes in another language, still answer in ${languageName}.

Your role:
- Help students understand micro:bit topics: MakeCode blocks, MicroPython, buttons (A/B), LEDs, the accelerometer, compass, temperature sensor, radio, pins, and general programming concepts.
- You can also answer general school/learning questions.
- Keep answers short, clear, and age-appropriate. Use simple words and concrete examples.
- Encourage the student. Never just give the final answer to a graded question—guide them to understand it.
- Use short paragraphs or bullet points. Avoid long walls of text.`
}

export async function POST(req: Request) {
  const {
    messages,
    language = "en",
  }: { messages: UIMessage[]; language?: Lang } = await req.json()

  const result = streamText({
    model: google("gemini-flash-latest"), 
    system: buildSystemPrompt(language),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error("[v0] chat stream error:", error) // ✅ 打印完整错误
        const message = error instanceof Error ? error.message : String(error)
        if (/API key|API_KEY|GOOGLE_GENERATIVE_AI|permission|credential|unauthenticated|401|403/i.test(message)) {
          return "NEEDS_KEY"
        }
        return message
      },
    }),
  })
}
