'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { classes, enrollments } from '@/lib/db/schema'
import { getUserId } from '@/lib/session'

export async function joinClass(code: string) {
  const userId = await getUserId()
  const normalized = code.trim().toUpperCase()
  const [cls] = await db
    .select()
    .from(classes)
    .where(eq(classes.joinCode, normalized))
  if (!cls) return { ok: false, error: 'invalid-code' as const }

  const existing = await db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.classId, cls.id), eq(enrollments.studentId, userId)),
    )
  if (existing.length === 0) {
    await db.insert(enrollments).values({ classId: cls.id, studentId: userId })
  }
  revalidatePath('/student')
  return { ok: true as const, className: cls.name }
}

export async function getMyClasses() {
  const userId = await getUserId()
  return db
    .select({ class: classes })
    .from(enrollments)
    .innerJoin(classes, eq(enrollments.classId, classes.id))
    .where(eq(enrollments.studentId, userId))
}
