'use client'
type Lang = 'en' | 'zh' | 'ms'

interface QuizResult {
  id: string
  user_id: string
  quiz_theme: 'basic' | 'music' | 'input'
  answers: any
  score: number
  details: any
  analysis_feedback: {
    en: string
    zh: string
    ms: string
  } | null
  created_at: string
  lang?: Lang
}

interface assignments {
  id: number
  title: string
  description: string
  resources: string[]
  teacher_user_id: string
  created_at: string
}

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
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')

  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [selectedResults, setSelectedResults] = useState<QuizResult[]>([])
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
  const [editingAssignmentId, setEditingAssignmentId] = useState<number | null>(null)
  
  async function loadData() {
    try {
      // 查询学生
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('user_id, name, avatar, class_id')
        .eq('class_id', classId)

      if (studentError) {
        console.error("❌ 学生查询失败:", studentError)
        setStudents([])
      } else {
        setStudents(studentData || [])
      }

      // 查询作业
      const { data: assignmentRaw, error: assignmentError } = await supabase
        .from('assignments')
        .select('id, title, description, resources, created_at, teacher_user_id')
        .eq('class_id', classId)

      if (assignmentError) {
        console.error("❌ 作业查询失败:", assignmentError)
        setAssignments([])
      } else {
        const assignmentData = (assignmentRaw ?? []) as any[]

        // 确保 resources 是数组
        setAssignments(
          assignmentData.map(a => ({
            ...a,
            resources: Array.isArray(a.resources)
              ? a.resources
              : (typeof a.resources === 'string'
                  ? (() => {
                      try {
                        return JSON.parse(a.resources)
                      } catch {
                        return []
                      }
                    })()
                  : [])
          }))
        )
      }

      // 查询班级 join_code
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .select('join_code')
        .eq('id', classId)
        .single()

      if (classError) {
        console.error("❌ 班级查询失败:", classError)
        setJoinCode('')
      } else {
        setJoinCode(classData?.join_code || '')
      }
    } catch (err) {
      console.error("❌ loadData 出错:", err)
    }
  }

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error("❌ 获取用户失败:", error)
      } else {
        setCurrentUser(user)
      }
    }
    getUser()
    loadData()
  }, [classId, selectedStudent])

  // 查询学生成绩
  async function loadQuizResults(userId: string) {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('id, user_id, quiz_theme, answers, score, details, analysis_feedback, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) {
      setSelectedResults(data.map(r => ({ ...r, lang: 'en' })))
      setShowResultsModal(true)
    } else {
      console.error('Error loading quiz results:', error.message)
    }
  }

  // 查看学生作业
  async function handleViewSubmissions(assignmentId: number) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('id, text, resources, feedback, student_user_id, students(name)')
        .eq('assignment_id', assignmentId)

      if (error) {
        console.error("❌ 查询作业失败:", error)
        setSubmissions([])
        return
      }

      // 确保 resources 是数组
      const safeData = (data ?? []).map(s => ({
        ...s,
        resources: Array.isArray(s.resources)
          ? s.resources
          : (typeof s.resources === 'string'
              ? (() => {
                  try {
                    return JSON.parse(s.resources)
                  } catch {
                    return []
                  }
                })()
              : [])
      }))

      setSubmissions(safeData)
      setShowSubmissionModal(true)   // ✅ 打开弹窗
    } catch (err) {
      console.error("❌ handleViewSubmissions 出错:", err)
    }
  }

  // 添加评论
  async function handleAddComment(submissionId: number, feedback: string) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ feedback })
        .eq('id', submissionId)

      if (error) {
        console.error("❌ 添加评论失败:", error)
        return
      }

      setNewComment('')
      // 本地更新
      const updated = submissions.map(s =>
        s.id === submissionId ? { ...s, feedback } : s
      )
      setSubmissions(updated)
    } catch (err) {
      console.error("❌ handleAddComment 出错:", err)
    }
  }

  // 工具函数：生成安全的文件路径
  function generateSafeFilePath(classId: string, file: File): string {
    const ext = file.name.split('.').pop() || "dat"
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
    return `submissions/${classId}/${safeName}`
  }

  function handleEditAssignment(assignment: assignments) {
    setNewAssignmentTitle(assignment.title)
    setNewAssignmentDesc(assignment.description)
    setNewAssignmentFile(null) // file not directly editable, re-upload if needed
    setNewAssignmentLink('')
    setShowAssignmentModal(true) // open modal for editing
    setEditingAssignmentId(assignment.id) // save editing ID
  }

  async function handleDeleteAssignment(id: number) {
    if (!confirm("Are you sure you want to delete this assignment?")) return

    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id)

    if (error) {
      alert("Failed to delete assignment: " + error.message)
    } else {
      alert("Assignment deleted successfully.")
      await loadData() // refresh assignments
    }
  }

  // 布置作业
  async function createAssignment() {
    if (!newAssignmentTitle.trim()) return
    if (!currentUser?.id) {
      alert("User not logged in")
      return
    }

    const resources: string[] = []
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
    if (newAssignmentLink.trim()) {
      resources.push(newAssignmentLink.trim())
    }

    let error
    if (editingAssignmentId) {
      // ✅ Update existing assignment
      const { error: updateError } = await supabase
        .from('assignments')
        .update({
          title: newAssignmentTitle,
          description: newAssignmentDesc,
          resources,
        })
        .eq('id', editingAssignmentId)

      error = updateError
    } else {
      // ✅ Insert new assignment
      const { error: insertError } = await supabase
        .from('assignments')
        .insert({
          class_id: classId,
          title: newAssignmentTitle,
          description: newAssignmentDesc,
          resources,
          teacher_user_id: currentUser.id,
        })

      error = insertError
    }

    if (error) {
      alert("Failed to save assignment: " + error.message)
    } else {
      alert(editingAssignmentId ? "Assignment updated successfully." : "Assignment created successfully.")
      setShowAssignmentModal(false)
      setNewAssignmentTitle('')
      setNewAssignmentDesc('')
      setNewAssignmentFile(null)
      setNewAssignmentLink('')
      setEditingAssignmentId(null)
      await loadData() // ✅ Refresh after save
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
            <h2 className="text-2xl font-semibold text-teal-700">{t('teacher.assignments')}</h2>
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
                  className={`rounded-lg shadow-md p-4 transition flex flex-col
                    ${idx % 2 === 0 ? 'bg-teal-50' : 'bg-teal-100'}
                  `}
                >
                  {/* 标题 + 操作区 */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-teal-800">{a.title}</h3>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => handleEditAssignment(a)}
                      >
                        ✏️ {t('common.edit')}
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleDeleteAssignment(a.id)}
                      >
                        🗑️ {t('common.delete')}
                      </button>
                      <button
                        className="text-sm text-purple-600 hover:underline"
                        onClick={() => handleViewSubmissions(a.id)}
                      >
                        👀 {t('teacher.viewSubmissions')}
                      </button>
                    </div>
                  </div>

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
                            className="text-teal-600 hover:underline"
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

      {/* Quiz Results 弹窗 */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col relative">
            
            {/* 固定头部 */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-teal-700">
                {t('teacher.quizResults')}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowResultsModal(false)}
              >
                ✖
              </button>
            </div>

            {/* 可滚动内容区 */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedResults.length === 0 ? (
                <p className="text-gray-500 italic">{t('teacher.noResults')}</p>
              ) : (
                <ul className="space-y-6">
                  {selectedResults.map(r => (
                    <li key={r.id} className="p-6 bg-teal-50 border border-teal-200 rounded-lg shadow relative">
                      <h3 className="font-bold text-lg text-teal-800">
                        {t(`quiz.${r.quiz_theme}`)} - {t('analysis.score')} {r.score}/10
                      </h3>

                      {/* 语言选择器 */}
                      <div className="absolute top-4 right-4">
                        <select
                          value={r.lang}
                          onChange={(e) => {
                            const newLang = e.target.value as Lang
                            setSelectedResults(prev =>
                              prev.map(item =>
                                item.id === r.id ? { ...item, lang: newLang } : item
                              )
                            )
                          }}
                          className="border border-teal-600 rounded p-2 text-white bg-teal-600 text-sm font-medium"
                        >
                          <option value="en">{t('common.english')}</option>
                          <option value="zh">{t('common.chinese')}</option>
                          <option value="ms">{t('common.malay')}</option>
                        </select>
                      </div>

                      {/* AI 分析反馈 */}
                      <p className="whitespace-pre-line mt-3 text-teal-700 text-lg">
                        {r.analysis_feedback
                          ? r.analysis_feedback[r.lang || 'en'] || t('analysis.noFeedback')
                          : t('analysis.noFeedback')}
                      </p>

                      {/* 时间 */}
                      <p className="text-sm text-teal-600 mt-2">
                        {t('analysis.savedAt')}: {new Date(r.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Student Submissions 弹窗 */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-white rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col relative">
            
            {/* 固定头部 */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-teal-700">
                {t('teacher.studentSubmissions')}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowSubmissionModal(false)}
              >
                ✖
              </button>
            </div>

            {/* 可滚动内容区 */}
            <div className="flex-1 overflow-y-auto p-6">
              {submissions.length === 0 ? (
                <p className="text-gray-500 italic">{t('teacher.noSubmissions')}</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((s) => (
                    <div key={s.id} className="border rounded-lg p-4 bg-teal-50 shadow-sm">
                      {/* 学生名字 */}
                      <p className="font-semibold text-teal-800 mb-2">
                        👤 {s.students?.name || t('teacher.unknownStudent')}
                      </p>

                      {/* 学生上传的文字说明 */}
                      {s.text && (
                        <p className="text-gray-700 mb-2">
                          <strong>{t('teacher.studentText')}:</strong> {s.text}
                        </p>
                      )}

                      {/* 学生上传的资源 */}
                      {s.resources?.map((res: any, idx: number) => {
                        // 兼容旧数据（字符串）和新数据（对象）
                        const url = typeof res === "string" ? res : res?.url || ""
                        const name =
                          typeof res === "string"
                            ? res
                            : (res?.name || (url ? url.split("/").pop() : "未知资源"))

                        if (!url) {
                          return (
                            <div key={idx} className="mt-2 text-red-500">
                              ⚠️ 无效资源
                            </div>
                          )
                        }

                        if (res.type === "file") {
                          const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i)
                          const isPdf = url.match(/\.pdf$/i)

                          if (isImage) {
                            return (
                              <img
                                key={idx}
                                src={url}
                                alt={name}
                                className="rounded-lg max-h-40 object-cover mb-2"
                              />
                            )
                          }
                          if (isPdf) {
                            return (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                className="text-blue-600 underline block"
                              >
                                📄 {name}
                              </a>
                            )
                          }
                        }

                        if (res.type === "link" || typeof res === "string") {
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              className="text-blue-600 underline block"
                            >
                              🔗 {name}
                            </a>
                          )
                        }

                        return null
                      })}

                      {/* 评论区 */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>{t('teacher.comment')}:</strong>{" "}
                          {s.feedback || t('teacher.noComment')}
                        </p>
                        <input
                          type="text"
                          placeholder={t('teacher.addComment')}
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="border rounded px-2 py-1 w-full mt-2"
                        />
                        <Button
                          className="bg-teal-500 text-white mt-2"
                          onClick={() => handleAddComment(s.id, newComment)}
                        >
                          💬 {t('teacher.saveComment')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
