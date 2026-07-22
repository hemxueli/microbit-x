import { pgTable, text, timestamp, boolean, serial, integer, jsonb } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // Custom field: "student" | "teacher". Managed via Better Auth additionalFields.
  role: text("role").notNull().default("student"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})

// --- App tables ------------------------------------------------------------
// No foreign keys on app tables (per stack conventions). Ownership/relations
// are represented by plain id columns and enforced in server actions.

// A class created by a teacher. Students join with joinCode.
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  teacherId: text("teacherId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  joinCode: text("joinCode").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Membership of a student in a class.
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  classId: integer("classId").notNull(),
  studentId: text("studentId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// A learning topic (unit). Content is markdown notes + optional media.
export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary"),
  // Ordered index for display.
  orderIndex: integer("orderIndex").notNull().default(0),
  // Markdown notes body (teacher-editable).
  notes: text("notes"),
  // Media items: [{ type: "image"|"video", url, caption }]
  media: jsonb("media").$type<{ type: string; url: string; caption?: string }[]>().default([]),
  // Optional MakeCode share/project url to embed for this topic.
  makecodeUrl: text("makecodeUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// A quiz belongs to a topic and has a difficulty level (1=basic,2=intermediate,3=advanced).
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  topicId: integer("topicId").notNull(),
  level: integer("level").notNull(), // 1 | 2 | 3
  title: text("title").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// A multiple-choice question. options is an array of strings; correctIndex is
// the index of the correct option.
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quizId").notNull(),
  prompt: text("prompt").notNull(),
  options: jsonb("options").$type<string[]>().notNull().default([]),
  correctIndex: integer("correctIndex").notNull().default(0),
  explanation: text("explanation"),
  orderIndex: integer("orderIndex").notNull().default(0),
})

// A student's attempt at a quiz.
export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  studentId: text("studentId").notNull(),
  quizId: integer("quizId").notNull(),
  topicId: integer("topicId").notNull(),
  level: integer("level").notNull(),
  score: integer("score").notNull(), // number correct
  total: integer("total").notNull(), // number of questions
  // Per-question answers: [{ questionId, selectedIndex, correct }]
  answers: jsonb("answers")
    .$type<{ questionId: number; selectedIndex: number; correct: boolean }[]>()
    .notNull()
    .default([]),
  // AI-generated personalized feedback (structured).
  aiFeedback: jsonb("aiFeedback").$type<{
    summary: string
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
  } | null>(),
  // Optional manual override / comment by a teacher.
  teacherComment: text("teacherComment"),
  teacherMark: integer("teacherMark"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
