export type QuizQuestion = {
  question: string
  studentAnswer: string
  correctAnswer: string
  isCorrect?: boolean
}

export type QuizData = {
  title?: string
  studentName?: string
  score?: number
  total?: number
  questions: QuizQuestion[]
}
