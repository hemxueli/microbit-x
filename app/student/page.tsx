'use client'

interface Assignment {
  id: string
  title: string
  description: string
}

interface StudentClass {
  id: string
  name: string
  assignments: Assignment[]
}

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function StudentPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [showJoin, setShowJoin] = useState(false)
  const [classCode, setClassCode] = useState('')
  const [showLangModal, setShowLangModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [showJoinClassModal, setShowJoinClassModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  // 名字和头像状态（保留你的 const）
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("/images/default-avatar.png")
  const [menuOpen, setMenuOpen] = useState(false)
  const [editAvatarOpen, setEditAvatarOpen] = useState(false)
  const [editNameOpen, setEditNameOpen] = useState(false)
  const [tempName, setTempName] = useState("")
  const [tempAvatar, setTempAvatar] = useState("/images/default-avatar.png")

  const avatarOptions = [
    '/images/savatar1.png',
    '/images/savatar2.png',
    '/images/savatar3.png',
    '/images/savatar4.png',
    '/images/savatar5.png',
    '/images/savatar6.png',
  ]

  // 加载用户并初始化
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await ensureProfile(user)   // 👈 确保 profile 存在
        await loadClasses(user)     // 👈 加载班级
      } else {
        router.push("/sign-in")
      }
    }
    loadUser()
  }, [])

  // 加载学生已加入的班级
  async function loadClasses(user: any) {
    const { data, error } = await supabase
      .from('student_classes')
      .select('classes(id, name, assignments(id, title, description))')
      .eq('student_id', user.id)

    if (!error && data) {
      const formatted: StudentClass[] = data.map((sc: any) => ({
        id: sc.classes.id,
        name: sc.classes.name,
        assignments: sc.classes.assignments || []
      }))
      setClasses(formatted)
    }
  }

  // 加入班级逻辑（带调试打印）
  async function handleJoinClass() {
    if (!joinCode) {
      alert("Please enter a class code.")
      return
    }

    // 调试打印输入的代码
    console.log("输入的 joinCode:", joinCode.trim().toUpperCase())

    const { data, error } = await supabase
      .from('classes')
      .select('id, name, join_code') // 👈 先查出 join_code 一起看
      .eq('join_code', joinCode.trim().toUpperCase())
      .maybeSingle()

    console.log("数据库返回:", data, "错误:", error)

    if (error || !data) {
      alert("Invalid class code.")
      return
    }

    // 插入学生班级关系
    const { error: insertError } = await supabase.from('student_classes').insert({
      student_id: user.id,
      class_id: data.id,
    })

    if (insertError) {
      alert("加入失败: " + insertError.message)
      return
    }

    setShowJoinClassModal(false)
    setJoinCode('')
    await loadClasses(user)
  }


  // 确保 profile 存在并加载
  async function ensureProfile(user: any) {
    const { data, error } = await supabase
      .from('students')
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
      await supabase.from('students').insert({
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

  // 更新名字或头像
  async function updateProfile(updates: { name?: string; avatar?: string }) {
  if (!user) return
    const payload = {
      user_id: user.id,
      name: updates.name ?? name,   // 👈 保证 name 永远有值
      avatar: updates.avatar ?? avatar,
    }
    const { error } = await supabase.from('students').upsert(payload)
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
  
  async function joinClass() {
  if (!classCode.trim() || !user?.id) return

  // 查询班级是否存在
  const { data: cls, error: clsError } = await supabase
    .from('classes')
    .select('id, name')
    .eq('id', classCode)
    .single()

  if (clsError || !cls) {
    alert(t('student.classNotFound'))
    return
  }

  // 更新学生的 class_id
  const { error } = await supabase
    .from('students')
    .update({ class_id: cls.id })
    .eq('user_id', user.id)

  if (error) {
    alert(error.message)
  } else {
    alert(`${t('student.joinedClass')}: ${cls.name}`)
    setShowJoin(false)
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
                  {t('editAvatar')}
                </button>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setEditNameOpen(true)
                    setMenuOpen(false)
                  }}
                >
                  {t('editUserName')}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

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
            <h2 className="font-bold mb-4">{t('editUserName')}</h2>
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

      {/* 加入班级弹窗 */}
      {showJoinClassModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowJoinClassModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-teal-700">{t('student.enterJoinCode')}</h2>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter class code"
              className="border border-teal-300 rounded px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowJoinClassModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={handleJoinClass}
              >
                {t('student.confirmJoin')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          {/* 欢迎语区 */}
          <div className="relative mb-8 bg-green-100 rounded-lg p-6">
            <h1 className="text-4xl font-extrabold tracking-tight">
              {t('student.welcomeTitle')}
            </h1>
            <p className="text-gray-700 mt-2">
              {t('student.welcomeSubtitle')}
            </p>
          </div>

          {/* 学习内容卡片区 */}
          <h2 className="text-2xl font-bold mb-6">{t('student.learningContent')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'basic', image: '/images/basic.png' },
              { key: 'input', image: '/images/input.png' },
              { key: 'music', image: '/images/music.png' },
            ].map(({ key, image }) => (
              <div
                key={key}
                className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => {
                  setSelectedTopic(key)      // 先记录点击的主题
                  setShowLangModal(true)     // 打开语言选择弹窗
                }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                    {t(`student.${key}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Learning Challenge 卡片区 */}
          <h2 className="text-2xl font-bold mt-12 mb-6">{t('student.learningChallenge')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'basic', image: '/images/quiz-basic.png' },
              { key: 'input', image: '/images/quiz-input.png' },
              { key: 'music', image: '/images/quiz-music.png' },
            ].map(({ key, image }) => (
              <div
                key={key}
                className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onClick={() => window.location.href = `/student/${key}/quiz`}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                    {t(`student.${key}`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Class 区块 */}
        <section className="mt-12 px-6">
          {/* 标题 + 按钮在同一行 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{t('student.classes')}</h2>
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white"
              onClick={() => setShowJoinClassModal(true)}
            >
              {t('student.joinClass')}
            </Button>
          </div>

          {/* 班级卡片区 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.length === 0 ? (
              <div className="col-span-3 text-gray-500 italic text-center">
                {t('student.noClasses')}
              </div>
            ) : (
              classes.map((cls) => (
                <div
                  key={cls.id}
                  className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-teal-100"
                >
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
                    <span className="text-white text-2xl font-bold mb-2 group-hover:scale-110 transition">
                      {cls.name}
                    </span>
                    {cls.assignments.length === 0 ? (
                      <span className="text-gray-200 italic">{t('student.noAssignments')}</span>
                    ) : (
                      <ul className="text-white text-sm list-disc list-inside text-left">
                        {cls.assignments.map((a) => (
                          <li key={a.id}>
                            <span className="font-semibold">{a.title}</span> – {a.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AiChatWidget defaultLanguage="en"
      />

      {/* 语言选择弹窗 */}
      {showLangModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
            <button
              onClick={() => setShowLangModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">{t('student.chooseLanguage')}</h2>
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = `/student/${selectedTopic}/en`
                }}
              >
                English
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = `/student/${selectedTopic}/ms`
                }}
              >
                Bahasa Melayu
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  window.location.href = `/student/${selectedTopic}/zh`
                }}
              >
                中文
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}