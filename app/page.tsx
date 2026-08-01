import { HomeLanding } from '@/components/home-landing'

export default async function Page() {
  // 不再检查 session，不再 redirect
  return <HomeLanding isAuthed={false} />
}
