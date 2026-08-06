'use client'

interface Submission {
  id: string;
  file_url: string;
  feedback: string | null;
  created_at: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  submissions: Submission[];
}

interface StudentClass {
  id: string;
  name: string;
  assignments: Assignment[];
}

interface ClassesResponse {
  class_id: string;
  classes: {
    id: string;
    name: string;
    assignments: {
      id: string;
      title: string;
      description: string;
      file_url: string | null;
      submissions: {
        id: string;
        file_url: string;
        feedback: string | null;
        created_at: string;
      }[];
    }[];
  };
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
  const [showLangModal, setShowLangModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [showJoinClassModal, setShowJoinClassModal] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [textContent, setTextContent] = useState('')

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
  // 加载用户并初始化 + 实时订阅
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await ensureProfile(user)   // 👈 确保 profile 存在
        await loadClasses(user)     // 👈 加载班级

        // ✅ 查学生的班级 ID
        const { data: student } = await supabase
          .from('students')
          .select('class_id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (student?.class_id) {
          // ✅ 订阅 assignments 表变化
          const assignmentChannel = supabase
            .channel('assignments-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'assignments',
                filter: `class_id=eq.${student.class_id}`,
              },
              () => loadClasses(user)
            )
            .subscribe()

          // ✅ 订阅 submissions 表变化
          const submissionChannel = supabase
            .channel('submissions-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'submissions',
              },
              () => loadClasses(user)
            )
            .subscribe()

          // ✅ 订阅 quiz_results 表变化（测验成绩）
          const quizChannel = supabase
            .channel('quiz-results-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'quiz_results',
                filter: `student_id=eq.${user.id}`, // 只监听当前学生的成绩
              },
              () => loadClasses(user)
            )
            .subscribe()

          // 清理订阅
          return () => {
            supabase.removeChannel(assignmentChannel)
            supabase.removeChannel(submissionChannel)
            supabase.removeChannel(quizChannel)
          }
        }
      } else {
        router.push("/sign-in")
      }
    }
    loadUser()
  }, [])

  // 加载学生已加入的班级
  async function loadClasses(user: any) {
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('class_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (studentError || !student?.class_id) {
      setClasses([])
      return
    }

    const { data: cls } = await supabase
      .from('classes')
      .select(`
        id,
        name,
        assignments (
          id,
          title,
          description,
          file_url,
          submissions (
            id,
            file_url,
            feedback,
            created_at
          )
        )
      `)
      .eq('id', student.class_id)

    const formatted: StudentClass[] = (cls || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      assignments: c.assignments.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        file_url: a.file_url,
        submissions: a.submissions || []
      }))
    }))

    setClasses(formatted)
  }

  // 加入班级逻辑
  async function joinClass() {
    if (!joinCode.trim() || !user?.id) {
      alert("Please enter a class code.")
      return
    }

    const { data: cls } = await supabase
      .from('classes')
      .select('id, name, join_code')
      .eq('join_code', joinCode.trim())
      .maybeSingle()

    if (!cls) {
      alert('Invalid class code.')
      return
    }

    const { error } = await supabase
      .from('students')
      .update({ class_id: cls.id })
      .eq('user_id', user.id)

    if (error) {
      alert(error.message)
    } else {
      alert(`${t('student.joinedClass')}: ${cls.name}`)
      setShowJoinClassModal(false)
      setJoinCode('')
      await loadClasses(user)
    }
  }

  // 学生提交作业
  async function submitAssignment() {
    if (!selectedAssignment) return
    const { error } = await supabase.from('submissions').insert({
      assignment_id: selectedAssignment.id,
      student_id: user.id, // ⚠️ 如果你有 students 表里的真实 id，可以替换
      file_url: fileUrl,
      feedback: textContent
    })
    if (!error) {
      alert("提交成功！")
      setSelectedAssignment(null)
      setFileUrl('')
      setTextContent('')
    } else {
      alert("提交失败: " + error.message)
    }
  }

  // 确保 profile 存在并加载
  async function ensureProfile(user: any) {
    const { data, error } = await supabase
      .from('students')
      .select('user_id, name, avatar')
      .eq('user_id', user.id)
      .single()

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
      name: updates.name ?? name,
      avatar: updates.avatar ?? avatar,
    }
    const { error } = await supabase.from('students').upsert(payload)
    if (!error) {
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
                onClick={joinClass}
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
          <div className="flex justify-between items-center mt-12 mb-6">
            <h2 className="text-2xl font-bold">{t('student.learningChallenge')}</h2>
            <button
              onClick={() => window.location.href = '/student/analysis-list'}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              📊 {t('student.analysis')}
            </button>
          </div>

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
          
          {/* Class 区块 */}
          <div className="mt-12">  
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

      {/* 作业弹窗 */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedAssignment(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">{selectedAssignment.title}</h2>
            <p className="mb-2">{selectedAssignment.description}</p>
            {selectedAssignment.file_url && (
              <a
                href={selectedAssignment.file_url}
                target="_blank"
                className="text-teal-600 underline mb-4 block"
              >
                下载老师文件
              </a>
            )}

            {/* 学生提交区 */}
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="上传文件路径"
              className="border rounded px-2 py-1 w-full mb-3"
            />
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="输入文字内容"
              className="border rounded px-2 py-1 w-full mb-3"
            />
            <Button className="bg-teal-500 text-white w-full" onClick={submitAssignment}>
              提交作业
            </Button>
          </div>
        </div>
      )}

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