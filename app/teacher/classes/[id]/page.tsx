'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { X } from 'lucide-react'

export default function ClassDetailPage({ user }: { user: any }) {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams()
  const classId = params.id as string

  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [quizResults, setQuizResults] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [showJoinCodeModal, setShowJoinCodeModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)

  const [newAssignmentTitle, setNewAssignmentTitle] = useState('')
  const [newAssignmentDesc, setNewAssignmentDesc] = useState('')
  const [newAssignmentFile, setNewAssignmentFile] = useState<File | null>(null)
  const [newAssignmentLink, setNewAssignmentLink] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  async function loadData() {
    const { data: studentData } = await supabase
      .from('students')
      .select('user_id, class_id, name, avatar')
      .eq('class_id', classId)

    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('id, title, description, resources, created_at') // ✅ 记得选 resources
      .eq('class_id', classId)

    const { data: classData } = await supabase
      .from('classes')
      .select('join_code')
      .eq('id', classId)
      .single()

    setStudents(studentData || [])
    setAssignments(
      (assignmentData || []).map(a => ({
        ...a,
        resources: Array.isArray(a.resources)
          ? a.resources
          : (typeof a.resources === 'string'
              ? JSON.parse(a.resources)
              : [])
      }))
    )
    setJoinCode(classData?.join_code || '')
  }

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()

    loadData()
  }, [classId, selectedStudent])

  // 查询学生成绩
  async function loadQuizResults(studentId: string) {
    const { data } = await supabase
      .from('quiz_results')
      .select('id, score, feedback, created_at')
      .eq('class_id', classId)
      .eq('student_id', studentId)
    setQuizResults(data || [])
    setSelectedStudent(studentId)
  }

  // 保存评语
  async function giveFeedback(resultId: string, feedback: string) {
    await supabase.from('quiz_results').update({ feedback }).eq('id', resultId)
    if (selectedStudent) {
      loadQuizResults(selectedStudent)
    }
  }

  // 工具函数：生成安全的文件路径
  function generateSafeFilePath(classId: string, file: File): string {
    const ext = file.name.split('.').pop()
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    return `${classId}/${safeName}`
  }

  // 布置作业
  async function createAssignment() {
    if (!newAssignmentTitle.trim()) return
    if (!currentUser?.id) {
      alert("User not logged in")
      return
    }

    const resources: string[] = []

    // 上传文件
    if (newAssignmentFile) {
      const filePath = generateSafeFilePath(classId, newAssignmentFile)
      const { error: uploadError } = await supabase.storage
        .from('assignments')
        .upload(filePath, newAssignmentFile)

      if (uploadError) {
        alert("File upload failed: " + uploadError.message)
        return
      }

      const { data } = supabase.storage.from('assignments').getPublicUrl(filePath)
      resources.push(data.publicUrl)
    }

    // 保存链接
    if (newAssignmentLink.trim()) {
      resources.push(newAssignmentLink.trim())
    }

    const { error } = await supabase.from('assignments').insert({
      class_id: classId,
      title: newAssignmentTitle,
      description: newAssignmentDesc,
      resources,   // ✅ 存 JSON 数组
      teacher_user_id: currentUser.id
    })

    if (error) {
      alert("Save failed: " + error.message)
    } else {
      alert("Assignment saved successfully")
      setShowAssignmentModal(false)
      setNewAssignmentTitle('')
      setNewAssignmentDesc('')
      setNewAssignmentFile(null)
      setNewAssignmentLink('')
      await loadData()
    }

  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 border-b border-teal-500 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-full items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-600"
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
      <main className="flex-1 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6 text-teal-700">{t('teacher.classDetail')}</h1>

        {/* 学生列表 */}
        <section className="mb-8 border border-teal-300 rounded-lg shadow-sm p-4 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-teal-600">{t('teacher.students')}</h2>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => setShowJoinCodeModal(true)}>
              {t('teacher.joinStudent')}
            </Button>
          </div>
          {students.length === 0 ? (
            <p className="text-gray-500 italic">{t('teacher.noStudents')}</p>
          ) : (
            <table className="w-full border-collapse border border-teal-200 rounded-lg shadow-sm">
              <thead className="bg-teal-100 text-teal-700">
                <tr>
                  <th className="px-4 py-2 text-center">{t('teacher.avatar')}</th>
                  <th className="px-4 py-2 text-center">{t('teacher.name')}</th>
                  <th className="px-4 py-2 text-center">{t('teacher.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr key={s.user_id} className={idx % 2 === 0 ? 'bg-white' : 'bg-teal-50'}>
                    <td className="px-4 py-2 text-center">
                      <img
                        src={s.avatar || '/images/default-avatar.png'}
                        alt="avatar"
                        className="w-10 h-10 rounded-full border border-teal-300 mx-auto"
                      />
                    </td>
                    <td className="px-4 py-2 text-center font-medium">
                      {s.name || s.user_id}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                        onClick={() => loadQuizResults(s.user_id)}
                      >
                        {t('teacher.viewResults')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* 作业区 */}
        <section className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">{t('teacher.assignments')}</h2>
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white"
              onClick={() => setShowAssignmentModal(true)}
            >
              {t('teacher.addAssignment')}
            </Button>
          </div>

          {assignments.length === 0 ? (
            <p className="text-gray-500 italic">{t('teacher.noAssignments')}</p>
          ) : (
            <div className="space-y-4">
              {assignments.map((a, idx) => (
                <div
                  key={a.id}
                  className={`rounded-lg shadow-md p-4 transition
                    ${idx % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}
                  `}
                >
                  {/* 标题 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{a.title}</h3>

                  {/* 描述 */}
                  <p className="text-gray-700 mb-3">{a.description}</p>

                  {/* 文件/链接区 */}
                  {a.resources && a.resources.length > 0 ? (
                    <ul className="space-y-1">
                      {a.resources.map((url: string, i: number) => (
                        <li key={i}>
                          <a
                            href={url}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            {url.endsWith('.pdf') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')
                              ? `📄 ${url.split('/').pop()}`
                              : `🔗 Link ${i+1}`}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 italic">{t('teacher.noFile')}</span>
                  )}

                  {/* 时间 */}
                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 作业弹窗 */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 h-[500px] flex flex-col relative">
            {/* 关闭按钮 */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAssignmentModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 标题 */}
            <h2 className="text-xl font-bold mb-4 text-teal-700">
              {t('teacher.newAssignment')}
            </h2>

            {/* 内容区可滚动 */}
            <div className="flex-1 overflow-y-auto space-y-3">
              <input
                type="text"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                placeholder={t('teacher.assignmentTitle')}
                className="border rounded px-2 py-1 w-full border-teal-300"
              />
              <textarea
                value={newAssignmentDesc}
                onChange={(e) => setNewAssignmentDesc(e.target.value)}
                placeholder={t('teacher.assignmentDesc')}
                className="border rounded px-2 py-1 w-full border-teal-300"
              />

              {/* 上传按钮区 */}
              <div className="flex gap-4">
                {/* 上传文件按钮 */}
                <button
                  type="button"
                  className="flex flex-col items-center justify-center w-16 h-16 border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 relative group"
                  onClick={() => setShowFileModal(true)}
                >
                  📁
                  <span className="absolute bottom-[-1.5rem] text-xs text-gray-500 opacity-0 group-hover:opacity-100">
                    {t('teacher.uploadFile')}
                  </span>
                </button>

                {/* 上传链接按钮 */}
                <button
                  type="button"
                  className="flex flex-col items-center justify-center w-16 h-16 border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 relative group"
                  onClick={() => setShowLinkModal(true)}
                >
                  🔗
                  <span className="absolute bottom-[-1.5rem] text-xs text-gray-500 opacity-0 group-hover:opacity-100">
                    {t('teacher.uploadLink')}
                  </span>
                </button>
              </div>

              {/* 显示已选择的文件或链接 */}
              {newAssignmentFile && (
                <p className="text-sm text-gray-600 mt-2">
                  📄 {t('teacher.uploadFile')}: {newAssignmentFile.name} ({(newAssignmentFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
              {newAssignmentLink && (
                <p className="text-sm text-gray-600">
                  🔗 {t('teacher.uploadLink')}: {newAssignmentLink}
                </p>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowAssignmentModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={createAssignment}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* 上传文件弹窗 */}
      {showFileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 relative">
            {/* 关闭按钮 */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowFileModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 标题 */}
            <h2 className="text-lg font-bold mb-4 text-teal-700">
              {t('teacher.uploadFile')}
            </h2>

            {/* 自定义上传框 */}
            <label
              htmlFor="fileUpload"
              className="flex items-center justify-center w-full h-12 border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 text-teal-700 font-medium"
            >
              {t('teacher.uploadFile')}
            </label>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setNewAssignmentFile(file) // ✅ 保存 File 对象
                }
              }}
            />

            {/* 显示已选择的文件 */}
            {newAssignmentFile && (
              <p className="text-sm text-gray-600 mt-2">
                📄 {t('teacher.uploadFile')}: {newAssignmentFile.name} ({(newAssignmentFile.size / 1024).toFixed(1)} KB)
              </p>
            )}

            {/* 底部按钮 */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setShowFileModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => setShowFileModal(false)}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 上传链接弹窗 */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowLinkModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold mb-4 text-teal-700">
              {t('teacher.uploadLink')}
            </h2>

            <input
              type="text"
              value={newAssignmentLink}
              onChange={(e) => setNewAssignmentLink(e.target.value)}
              placeholder="https://"
              className="border rounded px-2 py-1 w-full mb-4 border-teal-300"
            />

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowLinkModal(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => {
                  if (newAssignmentLink.trim()) {
                    setShowLinkModal(false)
                  }
                }}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {showJoinCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowJoinCodeModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-teal-700">{t('teacher.joinCode')}</h2>
            <p className="text-lg font-mono text-center text-teal-600 border rounded p-3 bg-teal-50">
              {joinCode || t('teacher.noJoinCode')}
            </p>
            <div className="flex justify-end mt-4">
              <Button
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => {
                  navigator.clipboard.writeText(joinCode)
                  alert(t('teacher.copied'))
                }}
              >
                {t('common.copy')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBOT-X</span>
        </div>
      </footer>
    </div>
  )
}
