import { NextResponse } from "next/server";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await generateText({
    model: "openai/gpt-4o-mini",
    system: "You are a helpful Micro:bit tutor for students.",
    prompt: message,
  });

  return NextResponse.json({ reply: result.text });
}
