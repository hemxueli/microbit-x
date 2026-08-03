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

export default function TeacherPage() {
  const { t } = useI18n()
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("/images/default-avatar.png")
  const [menuOpen, setMenuOpen] = useState(false)
  const [editAvatarOpen, setEditAvatarOpen] = useState(false)
  const [editNameOpen, setEditNameOpen] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempAvatar, setTempAvatar] = useState("/images/default-avatar.png")
  const [editClassId, setEditClassId] = useState<string | null>(null)
  const [editClassName, setEditClassName] = useState('')

  const avatarOptions = [
    '/images/tavatar1.png',
    '/images/tavatar2.png',
    '/images/tavatar3.png',
    '/images/tavatar4.png',
    '/images/tavatar5.png',
    '/images/tavatar6.png',
  ]

  const [classes, setClasses] = useState<any[]>([])
  const [newClassName, setNewClassName] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await ensureProfile(user)
        await loadClasses(user)
      } else {
        router.push("/sign-in")
      }
    }
    loadUser()
  }, [])

  async function updateClassName(classId: string, newName: string) {
    const { error } = await supabase.from('classes').update({ name: newName }).eq('id', classId)
    if (error) {
      alert(error.message)
    } else {
      setEditClassId(null)
      await loadClasses(user)
    }
  }

  async function deleteClass(classId: string) {
    if (!confirm("确定要删除这个班级吗？")) return
    const { error } = await supabase.from('classes').delete().eq('id', classId)
    if (error) {
      alert(error.message)
    } else {
      await loadClasses(user)
    }
  }

  async function ensureProfile(user: any) {
    const { data, error } = await supabase
      .from('teachers')
      .select('user_id, name, avatar')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      alert('Error loading profile: ' + error.message)
      return
    }

    if (!data) {
      const defaultName = user.user_metadata?.name || user.email || user.id
      const defaultAvatar = '/images/default-avatar.png'
      await supabase.from('teachers').insert({
        user_id: user.id,
        name: defaultName,
        avatar: defaultAvatar,
      })
      setName(defaultName)
      setAvatar(defaultAvatar)
      setTempName(defaultName)
      setTempAvatar(defaultAvatar)
    } else {
      setName(data.name)
      setAvatar(data.avatar)
      setTempName(data.name)
      setTempAvatar(data.avatar)
    }
  }

  async function loadClasses(user: any) {
    const { data: classesData, error } = await supabase
      .from('classes')
      .select('id, name, created_at, join_code')
      .eq('teacher_user_id', user.id)

    if (error) {
      console.error(error)
      return
    }

    if (!classesData) return

    const classesWithCount = await Promise.all(
      classesData.map(async (cls) => {
        const { count } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('class_id', cls.id)
        return { ...cls, student_count: count ?? 0 }
      })
    )

    setClasses(classesWithCount)
  }

  function generateCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }

  async function createClass() {
    if (!newClassName.trim()) return
    const code = generateCode()
    const { error } = await supabase.from('classes').insert({
      name: newClassName,
      teacher_user_id: user.id,
      created_at: new Date().toISOString(),
      join_code: code,
    })
    if (error) {
      alert(error.message)
    } else {
      setShowCreateModal(false)
      setNewClassName('')
      await loadClasses(user)
    }
  }

  async function updateProfile(updates: { name?: string; avatar?: string }) {
    if (!user) return
    const payload = {
      user_id: user.id,
      name: updates.name ?? name,
      avatar: updates.avatar ?? avatar,
    }
    const { error } = await supabase.from('teachers').upsert(payload)
    if (error) {
      alert(error.message)
    } else {
      if (updates.name) {
        setName(updates.name)
        setTempName(updates.name)
      }
      if (updates.avatar) {
        setAvatar(updates.avatar)
        setTempAvatar(updates.avatar)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-teal-50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 border-b border-teal-300 bg-teal-100 backdrop-blur">
        <div className="flex w-full items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-2 relative">
            <LanguageSwitcher />
            <Image src={avatar} alt="avatar" width={36} height={36} className="rounded-full border border-teal-400" />
            <span className="font-medium text-teal-700">{name}</span>
            <ChevronDown className="w-4 h-4 cursor-pointer text-teal-600" onClick={() => setMenuOpen(!menuOpen)} />
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-700 hover:bg-teal-200"
              onClick={async () => {
                await supabase.auth.signOut()
                router.push('/')
              }}
            >
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-teal-700">{t('teacher.welcomeTitle')}</h1>
        <p className="text-gray-600 mb-6">{t('teacher.welcomeSubtitle')}</p>

        <div className="flex items-center justify-between mt-8 mb-4">
          <h2 className="text-2xl font-semibold text-teal-700">{t('teacher.classesTable')}</h2>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => setShowCreateModal(true)}>
            {t('teacher.enterClass')}
          </Button>
        </div>

        <table className="w-full border border-teal-300 rounded-lg overflow-hidden">
          <thead className="bg-teal-100 text-teal-700">
            <tr>
              <th className="px-4 py-2 text-center">{t('teacher.classList')}</th>
              <th className="px-4 py-2 text-center">{t('teacher.studentsCount')}</th>
              <th className="px-4 py-2 text-center">{t('teacher.createtime')}</th>
              <th className="px-4 py-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
          {classes.map((cls, idx) => (
            <tr key={cls.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
              <td className="px-4 py-2 text-center">{cls.name}</td>
              <td className="px-4 py-2 text-center">{cls.student_count}</td>
              <td className="px-4 py-2 text-center">{new Date(cls.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-500 text-teal-600 hover:bg-teal-100"
                  onClick={() => router.push(`/teacher/classes/${cls.id}`)}
                >
                  {t('teacher.clickClass')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-500 text-gray-600 hover:bg-gray-100"
                  onClick={() => {
                    setEditClassId(cls.id)
                    setEditClassName(cls.name)
                  }}
                >
                  {t('teacher.editClass')}
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
              <h2 className="font-bold mb-4 text-teal-700">{t('teacher.createClass')}</h2>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={t('teacher.enterClass')}
                className="border border-teal-300 rounded px-2 py-1 w-full mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  className="text-teal-700 hover:bg-teal-100"
                  onClick={() => setShowCreateModal(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                  onClick={createClass}
                >
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 编辑头像弹窗 */}
      {editAvatarOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-bold mb-4">{t('editAvatar')}</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {avatarOptions.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt="avatar option"
                  width={64}
                  height={64}
                  className={`rounded-full cursor-pointer border-4 transition ${
                    tempAvatar === src ? 'border-teal-500' : 'border-gray-300'
                  }`}
                  onClick={() => setTempAvatar(src)}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditAvatarOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={() => { updateProfile({ avatar: tempAvatar }); setEditAvatarOpen(false); }}>{t('common.save')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑名字弹窗 */}
      {editNameOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="font-bold mb-4">{t('editUserName')}</h2>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="border border-teal-300 rounded px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditNameOpen(false)}>{t('common.cancel')}</Button>
              <Button onClick={() => { updateProfile({ name: tempName }); setEditNameOpen(false); }}>{t('common.save')}</Button>
            </div>
          </div>
        </div>
      )}

      {editClassId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            {/* 关闭按钮 */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setEditClassId(null)}
            >
              {/* 如果 X 图标有问题，可以直接写 × */}
              {/* <X className="w-10 h-10" /> */}
              ×
            </button>

            <h2 className="text-xl font-bold mb-4 text-teal-700">{t('teacher.editClass')}</h2>

            <input
              type="text"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              className="border border-teal-300 rounded px-2 py-1 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditClassId(null)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => updateClassName(editClassId!, editClassName)}
              >
                {t('common.save')}
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => deleteClass(editClassId!)}
              >
                {t('teacher.deleteClass')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 底部版权栏 */}
      <footer className="border-t border-teal-200 py-6 bg-teal-50">
        <div className="flex w-full items-center justify-between px-6 text-sm text-gray-600">
          <Logo showText={false} />
          <span>© 2026 MicroBOT-X</span>
        </div>
      </footer>
    </div>
  )
}
