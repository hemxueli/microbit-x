'use server'

import { and, asc, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  attempts,
  questions,
  quizzes,
  topics,
} from '@/lib/db/schema'
import { getUserId } from '@/lib/session'

export type MediaItem = { type: 'image' | 'video'; url: string; caption?: string }

export async function getTopics() {
  await getUserId()
  return db.select().from(topics).orderBy(asc(topics.orderIndex))
}

export async function getTopicBySlug(slug: string) {
  await getUserId()
  const [topic] = await db.select().from(topics).where(eq(topics.slug, slug))
  if (!topic) return null
  const topicQuizzes = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.topicId, topic.id))
    .orderBy(asc(quizzes.level))
  return { topic, quizzes: topicQuizzes }
}

export async function getQuizWithQuestions(quizId: number) {
  await getUserId()
  const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId))
  if (!quiz) return null
  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId))
    .orderBy(asc(questions.orderIndex))
  const [topic] = await db.select().from(topics).where(eq(topics.id, quiz.topicId))
  return { quiz, questions: qs, topic }
}

// Best score per quiz for the current student, keyed by quizId
export async function getMyBestScores() {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(attempts)
    .where(eq(attempts.studentId, userId))
    .orderBy(desc(attempts.createdAt))

  const best: Record<number, { score: number; total: number }> = {}
  for (const row of rows) {
    const current = best[row.quizId]
    if (!current || row.score / row.total > current.score / current.total) {
      best[row.quizId] = { score: row.score, total: row.total }
    }
  }
  return best
}

export async function getMyAttempts() {
  const userId = await getUserId()
  const rows = await db
    .select({
      attempt: attempts,
      topicTitle: topics.title,
      topicSlug: topics.slug,
    })
    .from(attempts)
    .leftJoin(topics, eq(attempts.topicId, topics.id))
    .where(eq(attempts.studentId, userId))
    .orderBy(desc(attempts.createdAt))
  return rows
}

export async function getMyAttempt(attemptId: number) {
  const userId = await getUserId()
  const [row] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.studentId, userId)))
  return row ?? null
}
