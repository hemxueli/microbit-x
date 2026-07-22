'use server'

import { asc, eq } from 'drizzle-orm'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { db } from '@/lib/db'
import { attempts, questions, quizzes, topics } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'

const feedbackSchema = z.object({
  summary: z.string().describe('One or two sentences summarizing performance.'),
  strengths: z.array(z.string()).describe('Concepts the student did well on.'),
  weaknesses: z
    .array(z.string())
    .describe('Concepts the student needs to improve.'),
  suggestions: z
    .array(z.string())
    .describe('Concrete, actionable next steps to improve.'),
  encouragement: z.string().describe('A short motivating sentence.'),
})

export type QuizFeedback = z.infer<typeof feedbackSchema>

const LANG_NAME: Record<string, string> = {
  en: 'English',
  zh: 'Simplified Chinese',
  ms: 'Malay (Bahasa Melayu)',
}

export async function submitAttempt(input: {
  quizId: number
  answers: number[]
  lang?: string
}) {
  const userId = await getUserId()
  const { quizId, answers } = input
  const lang = input.lang ?? 'en'

  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId))
  if (!quiz) throw new Error('Quiz not found')
  const [topic] = await db.select().from(topics).where(eq(topics.id, quiz.topicId))
  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.orderIndex))

  let score = 0
  const detail = qs.map((q, i) => {
    const chosen = answers[i]
    const correct = chosen === q.correctIndex
    if (correct) score++
    const opts = (q.options as string[]) ?? []
    return {
      prompt: q.prompt,
      chosen: typeof chosen === 'number' ? opts[chosen] : 'No answer',
      correctAnswer: opts[q.correctIndex],
      correct,
    }
  })
  const total = qs.length

  // Generate personalized AI feedback based on the student's answers.
  let feedback: QuizFeedback
  try {
    const result = await generateText({
      model: 'openai/gpt-4o-mini',
      output: Output.object({ schema: feedbackSchema }),
      system: `You are a supportive micro:bit programming tutor for school students.
Analyze the student's quiz results and give personalized, specific, age-appropriate feedback.
Base your feedback ONLY on the questions they got wrong/right. Be concrete about micro:bit concepts.
Write ALL feedback text in ${LANG_NAME[lang] ?? 'English'}.`,
      prompt: `Topic: ${topic?.title ?? 'micro:bit'}
Quiz level: ${quiz.level} (1=basic, 2=intermediate, 3=advanced)
Score: ${score}/${total}

Per-question results:
${detail
  .map(
    (d, i) =>
      `${i + 1}. ${d.prompt}\n   Student answered: ${d.chosen}\n   Correct answer: ${d.correctAnswer}\n   Result: ${d.correct ? 'CORRECT' : 'WRONG'}`,
  )
  .join('\n')}`,
    })
    feedback = result.output
  } catch (err) {
    console.log('[v0] AI feedback failed:', err instanceof Error ? err.message : err)
    const ratio = total > 0 ? score / total : 0
    feedback = {
      summary:
        ratio >= 0.8
          ? 'Great work on this quiz!'
          : 'Good effort — there is room to improve.',
      strengths: [],
      weaknesses: [],
      suggestions: ['Review the topic notes and try the quiz again.'],
      encouragement: 'Keep practicing — you are making progress!',
    }
  }

  const [row] = await db
    .insert(attempts)
    .values({
      studentId: userId,
      quizId,
      topicId: quiz.topicId,
      level: quiz.level,
      score,
      total,
      answers: answers,
      aiFeedback: feedback,
    })
    .returning({ id: attempts.id })

  return { attemptId: row.id, score, total, feedback }
}
