'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

// 三语言翻译对象
const translations: Record<string, { en: string; zh: string; ms: string }> = {
  'teacher.welcomeTitle': {
    en: 'Welcome back, Teacher!',
    zh: '欢迎回来，老师！',
    ms: 'Selamat kembali, Cikgu!',
  },
  'teacher.welcomeSubtitle': {
    en: 'Welcome, respected teacher! This is your space to manage classes and students.',
    zh: '欢迎您，尊敬的老师！这里是您管理班级与学生的空间',
    ms: 'Selamat datang, cikgu yang dihormati! Inilah ruang anda untuk mengurus kelas dan pelajar.',
  },
  'teacher.enterClass': {
    en: 'Enter class name',
    zh: '请输入班级名称',
    ms: 'Masukkan nama kelas',
  },
  'teacher.createClass': {
    en: 'Create Class',
    zh: '创建班级',
    ms: 'Cipta Kelas',
  },
  'teacher.noClasses': {
    en: "You don't have any classes yet, please create one",
    zh: '您还没有班级，请先创建一个',
    ms: 'Anda belum mempunyai kelas, sila cipta dahulu',
  },
  'nav.logout': {
    en: 'Log out',
    zh: '退出登录',
    ms: 'Log keluar',
  },
  'common.loading': {
    en: 'Loading...',
    zh: '加载中...',
    ms: 'Sedang dimuatkan...',
  },
  'common.view': {
    en: 'View Details',
    zh: '查看详情',
    ms: 'Lihat Butiran',
  },
}

export default function TeacherPage({ user }: { user?: any }) {
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? 'Teacher')
  const [avatar, setAvatar] = useState(user?.image ?? '/images/default-avatar.png')
  const [newClass, setNewClass] = useState('')
  const [lang, setLang] = useState<'en' | 'zh' | 'ms'>('zh') // 默认中文，可切换

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

  const t = (key: string) => translations[key]?.[lang] ?? key

  const addClass = () => {
    if (!newClass.trim()) return
    const newEntry = { id: Date.now().toString(), name: newClass }
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
            <LanguageSwitcher onChange={(val: 'en' | 'zh' | 'ms') => setLang(val)} />
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
            {classes.map((cls) => (
              <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
                <div className="border rounded-lg p-6 shadow hover:shadow-md cursor-pointer">
                  <h3 className="text-lg font-bold">{cls.name}</h3>
                  <Button size="sm" className="mt-2">{t('common.view')}</Button>
                </div>
              </Link>
            ))}
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
