// app/student/basic/quiz/page.tsx
import QuizBasicClient from './QuizBasicClient'

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function Page() {
  return <QuizBasicClient />
}
