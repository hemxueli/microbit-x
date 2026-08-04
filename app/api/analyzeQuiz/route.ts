// app/api/analyzeQuiz/route.ts
import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'

const model = google("gemini-flash-latest")

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
