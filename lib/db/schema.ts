import { pgTable, text, timestamp, boolean, serial, integer, jsonb } from "drizzle-orm/pg-core"

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  // App-specific: "teacher" | "student"
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
// No foreign keys by default; scope queries by the relevant owner id column.

// A class created by a teacher. `teacherId` is the owning user.
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  teacherId: text("teacherId").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  // Short human-friendly code students can use to join.
  joinCode: text("joinCode").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Links a student user to a class.
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  classId: integer("classId").notNull(),
  studentId: text("studentId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Homework/assignments a teacher gives to a class.
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  classId: integer("classId").notNull(),
  teacherId: text("teacherId").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// A student's attempt at one of the three quiz levels.
// level: "1" | "2" | "3" (stored as text for flexibility).
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  studentId: text("studentId").notNull(),
  classId: integer("classId"),
  level: text("level").notNull(),
  score: integer("score").notNull().default(0),
  maxScore: integer("maxScore").notNull().default(0),
  // Raw answers payload, left flexible for later quiz content.
  answers: jsonb("answers"),
  // AI generated evaluation of this attempt (nullable until generated).
  aiEvaluation: text("aiEvaluation"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Teacher feedback/comments on a student's quiz attempt.
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  teacherId: text("teacherId").notNull(),
  studentId: text("studentId").notNull(),
  attemptId: integer("attemptId"),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})
