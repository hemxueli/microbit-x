// app/student/basic/music/page.tsx
import QuizMusicClient from './QuizMusicClient'

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default function Page() {
  return <QuizMusicClient />
}
