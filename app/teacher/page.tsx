'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function TeacherPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? 'Teacher')
  const [avatar, setAvatar] = useState(user?.image ?? '/images/default-avatar.png')
  const [newClass, setNewClass] = useState('')

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes')
        const data = await res.json()
        setClasses(data)
      } catch (err) {
        console.error('Failed to load classes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const addClass = () => {
    if (!newClass.trim()) return
    const newEntry = { id: Date.now().toString(), name: newClass, students: [] }
    setClasses([...classes, newEntry])
    setNewClass('')
    // TODO: 调用 API 保存班级
  }

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>

  const colors = [
    { bg: 'bg-blue-100 hover:bg-blue-200', dot: 'bg-blue-500' },
    { bg: 'bg-green-100 hover:bg-green-200', dot: 'bg-green-500' },
    { bg: 'bg-yellow-100 hover:bg-yellow-200', dot: 'bg-yellow-500' },
    { bg: 'bg-pink-100 hover:bg-pink-200', dot: 'bg-pink-500' },
    { bg: 'bg-purple-100 hover:bg-purple-200', dot: 'bg-purple-500' },
    { bg: 'bg-orange-100 hover:bg-orange-200', dot: 'bg-orange-500' },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditing(true)}>
              <Image src={avatar} alt="avatar" width={36} height={36} className="rounded-full border" />
              <span className="font-medium">{name}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <Button variant="ghost" size="sm">{t('nav.logout')}</Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
            {t('teacher.welcomeTitle')}
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            {t('teacher.welcomeSubtitle')}
          </p>

          {/* 创建班级输入框 */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder={t('teacher.enterClass')}
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <Button onClick={addClass}>{t('teacher.createClass')}</Button>
          </div>

          {/* 班级卡片列表 */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls, index) => {
              const color = colors[index % colors.length]
              return (
                <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
                  <div
                    className={`border rounded-lg p-6 shadow cursor-pointer transition-colors duration-300 ${color.bg}`}
                  >
                    {/* 标题 + 彩色圆点 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${color.dot}`}></span>
                      <h3 className="text-lg font-bold">{cls.name}</h3>
                    </div>

                    {/* 学生人数统计 */}
                    <p className="text-sm text-gray-700 mb-3">
                      👥 {cls.students?.length ?? 0} students
                    </p>

                    <Button size="sm">{t('common.view')}</Button>
                  </div>
                </Link>
              )
            })}
            {classes.length === 0 && (
              <p className="text-gray-500">{t('teacher.noClasses')}</p>
            )}
          </div>
        </section>
      </main>

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBit-X</span>
        </div>
      </footer>
    </div>
  )
}
