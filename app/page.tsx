import { HomeLanding } from '@/components/home-landing'

export default async function Page() {
  // 固定未登录界面，不需要传 isAuthed
  return <HomeLanding />
}
