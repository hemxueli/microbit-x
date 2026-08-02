'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function TeacherPage({ user }: { user: any }) {
  const { t } = useI18n()
  const router = useRouter()

  const [name, setName] = useState(user?.name ?? user?.id)
  const [avatar, setAvatar] = useState(user?.avatar ?? '/images/default-avatar.png')
  const [menuOpen, setMenuOpen] = useState(false)
  const [editAvatarOpen, setEditAvatarOpen] = useState(false)
  const [editNameOpen, setEditNameOpen] = useState(false)
  const [tempName, setTempName] = useState(name)
  const [tempAvatar, setTempAvatar] = useState(avatar)

  const [classes, setClasses] = useState<any[]>([])
  const [newClassName, setNewClassName] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // 自动补全逻辑：检查 teachers 表是否有记录，没有就插入
  useEffect(() => {
    async function ensureProfile() {
      if (!user?.id) return

      const { data } = await supabase
        .from('teachers')
        .select('user_id, name, avatar')
        .eq('user_id', user.id)
        .single()

      if (!data) {
        await supabase.from('teachers').insert({
          user_id: user.id,
          name: user.email ?? user.id,
          avatar: '/images/default-avatar.png',
        })
        setName(user.email ?? user.id)
        setAvatar('/images/default-avatar.png')
      } else {
        setName(data.name)
        setAvatar(data.avatar)
      }
    }

    ensureProfile()
  }, [user])

  // 加载班级
  useEffect(() => {
    async function loadClasses() {
      if (!user?.id) return
      const { data } = await supabase
        .from('classes')
        .select('id, name, created_at, students(count)')
        .eq('teacher_id', user.id)
      setClasses(data || [])
    }
    loadClasses()
  }, [user])

  // 更新名字或头像
  async function updateProfile(updates: { name?: string; avatar?: string }) {
    const { error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('user_id', user.id)

    if (error) alert(error.message)
    else {
      if (updates.name) setName(updates.name)
      if (updates.avatar) setAvatar(updates.avatar)
    }
  }

  // 创建班级
  async function createClass() {
    if (!newClassName.trim()) return
    const { error } = await supabase.from('classes').insert({
      name: newClassName,
      teacher_id: user.id,
      created_at: new Date().toISOString(),
    })
    if (error) {
      alert(error.message)
    } else {
      setShowCreateModal(false)
      setNewClassName('')
      const { data } = await supabase
        .from('classes')
        .select('id, name, created_at, students(count)')
        .eq('teacher_id', user.id)
      setClasses(data || [])
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-2 relative">
            <LanguageSwitcher />
            <Image src={avatar} alt="avatar" width={36} height={36} className="rounded-full border" />
            <span className="font-medium">{name}</span>
            <ChevronDown className="w-4 h-4 cursor-pointer text-gray-600" onClick={() => setMenuOpen(!menuOpen)} />
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
              }}
            >
              {t('nav.logout')}
            </Button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded shadow">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setEditAvatarOpen(true)
                    setMenuOpen(false)
                  }}
                >
                  {t('teacher.editAvatar')}
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setEditNameOpen(true)
                    setMenuOpen(false)
                  }}
                >
                  {t('teacher.editUserName')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t('teacher.welcomeTitle')}</h1>
        <p className="text-gray-600 mb-6">{t('teacher.welcomeSubtitle')}</p>

        <Button onClick={() => setShowCreateModal(true)}>{t('teacher.createClass')}</Button>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('teacher.classList')}</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">{t('teacher.classList')}</th>
              <th className="border px-4 py-2">{t('teacher.studentsCount')}</th>
              <th className="border px-4 py-2">创建时间</th>
              <th className="border px-4 py-2">{t('teacher.enterClass')}</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td className="border px-4 py-2">{cls.name}</td>
                <td className="border px-4 py-2">{cls.students?.[0]?.count ?? 0}</td>
                <td className="border px-4 py-2">{new Date(cls.created_at).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                  >
                    {t('teacher.enterClass')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 创建班级弹窗 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="font-bold mb-4">{t('teacher.createClass')}</h2>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={t('teacher.className')}
                className="border rounded px-2 py-1 w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={createClass}>{t('common.save')}</Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部 Footer */}
      <footer className="border-t border-border bg-background py-4">
        <div className="mx-auto max-w-6xl px-6 text-center text-gray-500 text-sm">
          © 2026 {t('app.name')} — {t('app.tagline')}
        </div>
      </footer>
    </div>
  )
}
