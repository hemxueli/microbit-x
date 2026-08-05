// app/student/input/quiz/page.tsx
import QuizInputClient from './QuizInputClient'

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function Page() {
  return <QuizInputClient />
}
