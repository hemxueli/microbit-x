import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, attempts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  // 查询所有学生账号
  const studentList = await db
    .select()
    .from(users)
    .where(eq(users.role, "student"));

  // 查询每个学生的最新进度
  const studentsWithProgress = await Promise.all(
    studentList.map(async (student) => {
      const latestAttempt = await db
        .select()
        .from(attempts)
        .where(eq(attempts.studentId, student.id))
        .orderBy(desc(attempts.id))
        .limit(1);

      return {
        id: student.id,
        name: student.name,
        avatarUrl: student.avatarUrl,
        email: student.email,
        role: student.role,
        progress:
          latestAttempt.length > 0
            ? `${latestAttempt[0].score}/${latestAttempt[0].total}`
            : "No attempts yet",
      };
    })
  );

  return NextResponse.json(studentsWithProgress);
}
