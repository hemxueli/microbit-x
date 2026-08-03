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

  const [newAssignmentTitle, setNewAssignmentTitle] = useState('')
  const [newAssignmentDesc, setNewAssignmentDesc] = useState('')
  const [newAssignmentFile, setNewAssignmentFile] = useState('')
  const [newAssignmentLink, setNewAssignmentLink] = useState('')
  const [joinCode, setJoinCode] = useState('')

  // 加载班级数据
  useEffect(() => {
    async function loadData() {
      const { data: studentData } = await supabase
        .from('students')
        .select('user_id, name, avatar')
        .eq('class_id', classId)

      const { data: assignmentData } = await supabase
        .from('assignments')
        .select('id, title, description, file_url, created_at')
        .eq('class_id', classId)

      const { data: classData } = await supabase
        .from('classes')
        .select('join_code')
        .eq('id', classId)
        .single()

      setStudents(studentData || [])
      setAssignments(assignmentData || [])
      setJoinCode(classData?.join_code || '')
    }
    loadData()
  }, [classId])

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

  // 布置作业
  async function createAssignment() {
    if (!newAssignmentTitle.trim()) return
    await supabase.from('assignments').insert({
      class_id: classId,
      title: newAssignmentTitle,
      description: newAssignmentDesc,
      file_url: newAssignmentFile || newAssignmentLink || null,
    })
    setNewAssignmentTitle('')
    setNewAssignmentDesc('')
    setNewAssignmentFile('')
    setNewAssignmentLink('')
    setShowAssignmentModal(false)
    const { data } = await supabase
      .from('assignments')
      .select('*')
      .eq('class_id', classId)
    setAssignments(data || [])
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
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-teal-600">{t('teacher.students')}</h2>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white" onClick={() => setShowJoinCodeModal(true)}>
              {t('teacher.joinStudent')}
            </Button>
          </div>
          {students.length === 0 ? (
            <p className="text-gray-500 italic">{t('teacher.noStudents')}</p>
          ) : (
            <ul className="space-y-3">
              {students.map((s) => (
                <li key={s.user_id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-teal-100">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-teal-300" />
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                    onClick={() => loadQuizResults(s.user_id)}
                  >
                    {t('teacher.viewResults')}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 学生成绩 */}
        {selectedStudent && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-teal-600">{t('teacher.quizResults')}</h2>
            {quizResults.length === 0 ? (
              <p className="text-gray-500 italic">{t('teacher.noQuiz')}</p>
            ) : (
              <table className="w-full border-collapse border rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-teal-50 text-left">
                    <th className="border px-4 py-2">{t('teacher.score')}</th>
                    <th className="border px-4 py-2">{t('teacher.feedback')}</th>
                    <th className="border px-4 py-2">{t('teacher.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((qr) => (
                    <tr key={qr.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{qr.score}</td>
                      <td className="border px-4 py-2 flex items-center gap-2">
                        <span>{qr.feedback || t('teacher.noFeedback')}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-teal-600"
                          onClick={() => {
                            const fb = prompt(t('teacher.enterFeedback'), qr.feedback || '')
                            if (fb) giveFeedback(qr.id, fb)
                          }}
                        >
                          ✏️
                        </Button>
                      </td>
                      <td className="border px-4 py-2">{new Date(qr.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* 作业区 */}
        <section>
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-teal-600">{t('teacher.assignments')}</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-500 italic">{t('teacher.noAssignments')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => (
                <div key={a.id} className="border rounded-lg p-4 shadow-sm bg-white border-teal-200">
                  <h3 className="font-bold text-lg mb-2 text-teal-700">{a.title}</h3>
                  <p className="text-gray-600 mb-2">{a.description}</p>
                  {a.file_url && (
                    <a href={a.file_url} target="_blank" className="text-teal-600 hover:underline">
                      {t('teacher.viewFile')}
                    </a>
                  )}
                </
                                  )}
                </div>
              ))}
            </div>
          )}

          {/* 布置作业按钮 */}
          <div className="mt-6">
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white"
              onClick={() => setShowAssignmentModal(true)}
            >
              {t('teacher.addAssignment')}
            </Button>
          </div>
        </section>
      </main>

      {/* 作业弹窗 */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAssignmentModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-4 text-teal-700">
              {t('teacher.newAssignment')}
            </h2>
            <input
              type="text"
              value={newAssignmentTitle}
              onChange={(e) => setNewAssignmentTitle(e.target.value)}
              placeholder={t('teacher.assignmentTitle')}
              className="border rounded px-2 py-1 w-full mb-3 border-teal-300"
            />
            <textarea
              value={newAssignmentDesc}
              onChange={(e) => setNewAssignmentDesc(e.target.value)}
              placeholder={t('teacher.assignmentDesc')}
              className="border rounded px-2 py-1 w-full mb-3 border-teal-300"
            />
            <input
              type="text"
              value={newAssignmentFile}
              onChange={(e) => setNewAssignmentFile(e.target.value)}
              placeholder={t('teacher.uploadFile')}
              className="border rounded px-2 py-1 w-full mb-3 border-teal-300"
            />
            <input
              type="text"
              value={newAssignmentLink}
              onChange={(e) => setNewAssignmentLink(e.target.value)}
              placeholder={t('teacher.uploadLink')}
              className="border rounded px-2 py-1 w-full mb-3 border-teal-300"
            />
            <div className="flex justify-end gap-2">
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

      {/* 加入码弹窗 */}
      {showJoinCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowJoinCodeModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-teal-700">
              {t('teacher.joinCode')}
            </h2>
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
