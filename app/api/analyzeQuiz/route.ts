// app/api/analyzeQuiz/route.ts
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'

if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY")
}

const model = google("gemini-1.5-flash-latest", {
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})


export async function POST(req: Request) {
  try {
    const { quiz_theme, score } = await req.json()

    const prompt = `The student scored ${score}/10 in the quiz on theme "${quiz_theme}". 
Please analyze which knowledge points are weak and provide improvement suggestions.`

    return streamText({
      model,
      prompt,
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    return NextResponse.json(
      { error: 'AI analysis failed, please check configuration.' },
      { status: 500 }
    )
  }
}
