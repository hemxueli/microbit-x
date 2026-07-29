'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { ChevronDown } from 'lucide-react'

interface Class {
  id: string
  name: string
  subject?: string
}

export default function TeacherPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classes, setClasses] = useState<Class[]>([])
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

  const handleSave = () => {
    // TODO: 调用 API 保存头像和名字
    setEditing(false)
  }

  const addClass = () => {
    if (!newClass.trim()) return
    const newEntry: Class = {
      id: Date.now().toString(),
      name: newClass,
    }
    setClasses([...classes, newEntry])
    setNewClass('')
    // TODO: 调用 API 保存班级
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
              <ChevronDown className="w-4 h-4 text-gray-500" />
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
          {/* 欢迎老师 */}
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
            {t('teacher.welcome') ?? `欢迎回来，${name}老师！`}
          </h1>

          {/* 创建班级输入框 */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder={t('teacher.enterClass') ?? '输入班级名称'}
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <Button onClick={addClass}>{t('teacher.createClass') ?? '创建班级'}</Button>
          </div>

          {/* 班级卡片列表 */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
                <div className="border rounded-lg p-6 shadow hover:shadow-md cursor-pointer">
                  <h3 className="text-lg font-bold">{cls.name}</h3>
                  <p className="text-sm text-gray-500">{cls.subject ?? t('teacher.noSubject')}</p>
                  <Button size="sm" className="mt-2">{t('common.view')}</Button>
                </div>
              </Link>
            ))}
            {classes.length === 0 && (
              <p className="text-gray-500">{t('teacher.noClasses') ?? '还没有班级，请先创建一个'}</p>
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

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">
              {t('common.editProfile') ?? 'Edit Profile'}
            </h2>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">{t('auth.name')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">{t('auth.avatar')}</span>
                <div className="flex items-center gap-3">
                  <Image
                    src={avatar}
                    alt="avatar preview"
                    width={48}
                    height={48}
                    className="rounded-full border"
                  />
                  <div className="cursor-pointer px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200">
                    {t('auth.chooseFile')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setAvatar(url)
                        }
                      }}
                    />
                  </div>
                </div>
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
