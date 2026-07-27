'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useI18n } from '@/lib/i18n'

export default function TeacherPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? 'Teacher')
  const [avatar, setAvatar] = useState(user?.image ?? '/default-avatar.png')

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes')
        const data = await res.json()
        setClasses(data)
      } catch (err) {
        console.error('加载班级失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const handleSave = () => {
    // TODO: 调用 API 保存头像和名字
    setEditing(false)
  }

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditing(true)}>
              <Image
                src={avatar}
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full border"
              />
              <span className="font-medium">{name}</span>
            </div>
            <Button variant="ghost" size="sm">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
            {t('teacher.dashboard')}
          </h1>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* 班级管理 */}
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">📘</span>
                <h3 className="text-lg font-bold">{t('teacher.classes')}</h3>
                <p className="leading-relaxed text-muted-foreground">{t('teacher.noClasses')}</p>
                <Link href="/teacher/classes/new">
                  <Button size="sm" className="mt-2">{t('teacher.createClass')}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* 学生进度 */}
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">📊</span>
                <h3 className="text-lg font-bold">{t('teacher.progress')}</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {t('teacher.avgScore')} / {t('teacher.attempts')}
                </p>
                <Link href="/teacher/progress">
                  <Button size="sm" className="mt-2">{t('common.view')}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* 成绩审阅 */}
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">📝</span>
                <h3 className="text-lg font-bold">{t('teacher.reviewMarks')}</h3>
                <p className="leading-relaxed text-muted-foreground">{t('teacher.noAttempts')}</p>
                <Link href="/teacher/review">
                  <Button size="sm" className="mt-2">{t('common.view')}</Button>
                </Link>
              </CardContent>
            </Card>

            {/* 学生名单 */}
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">👥</span>
                <h3 className="text-lg font-bold">{t('teacher.students')}</h3>
                <p className="leading-relaxed text-muted-foreground">{t('teacher.noStudents')}</p>
                <Link href="/teacher/students">
                  <Button size="sm" className="mt-2">{t('common.view')}</Button>
                </Link>
              </CardContent>
            </Card>
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

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">{t('common.editProfile') ?? 'Edit Profile'}</h2>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">{t('auth.name')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm text-gray-600">{t('auth.avatar') ?? 'Avatar'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setAvatar(url)
                    }
                  }}
                />
              </label>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSave}>{t('common.save')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
