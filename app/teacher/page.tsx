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

  const avatarOptions = [
    '/images/tavatar1.png',
    '/images/tavatar2.png',
    '/images/tavatar3.png',
    '/images/tavatar4.png',
    '/images/tavatar5.png',
    '/images/tavatar6.png',
  ]

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
                  Edit Avatar
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setEditNameOpen(true)
                    setMenuOpen(false)
                  }}
                >
                  Edit User Name
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        {/* 这里可以放老师专属的内容，比如班级管理、学生列表 */}
      </main>

      {/* 编辑头像弹窗 */}
      {editAvatarOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-bold mb-4">Choose Avatar</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {avatarOptions.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="avatar option"
                  width={64}
                  height={64}
                  className={`rounded-full cursor-pointer border-4 transition ${
                    tempAvatar === src ? 'border-primary' : 'border-gray-300'
                  }`}
                  onClick={() => setTempAvatar(src)}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditAvatarOpen(false)}>Cancel</Button>
              <Button onClick={() => { updateProfile({ avatar: tempAvatar }); setEditAvatarOpen(false); }}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑名字弹窗 */}
      {editNameOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-bold mb-4">Edit Name</h2>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditNameOpen(false)}>Cancel</Button>
              <Button onClick={() => { updateProfile({ name: tempName }); setEditNameOpen(false); }}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
