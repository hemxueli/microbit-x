'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'

export default function StudentClass({ user }: { user: any }) {
  const { t } = useI18n()
  const [classInfo, setClassInfo] = useState<any | null>(null)
  const [teacherInfo, setTeacherInfo] = useState<any | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<{[key:number]: any[]}>({})
  const [joinCode, setJoinCode] = useState('')
  const [showJoinModal, setShowJoinModal] = useState(false)

  const [submissionText, setSubmissionText] = useState('')
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (user) loadClass(user)
  }, [user])

  async function loadClass(user: any) {
    const { data: student } = await supabase
      .from('students')
      .select('class_id')
      .eq('user_id', user.id)
      .single()

    if (!student?.class_id) {
      setClassInfo(null)
      setTeacherInfo(null)
      setAssignments([])
      return
    }

    const { data: cls } = await supabase
      .from('classes')
      .select('id, name, teacher_user_id')
      .eq('id', student.class_id)
      .maybeSingle()

    if (!cls) {
      setClassInfo(null)
      setTeacherInfo(null)
      setAssignments([])
      return
    }

    setClassInfo(cls)

    if (cls.teacher_user_id) {
      const { data: teacher } = await supabase
        .from('teachers')
        .select('name, avatar')
        .eq('user_id', cls.teacher_user_id)
        .maybeSingle()
      setTeacherInfo(teacher || null)
    }

    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('id, title, description, created_at, resources, feedback')
      .eq('class_id', cls.id)

    setAssignments(assignmentData || [])

    for (const a of assignmentData || []) {
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, resources, feedback, created_at')
        .eq('assignment_id', a.id)
        .eq('student_id', user.id)
      setSubmissions(prev => ({ ...prev, [a.id]: subs || [] }))
    }
  }

  async function joinClass() {
    if (!joinCode.trim()) {
      alert(t('student.enterCode'))
      return
    }

    const { data: cls, error } = await supabase
      .from('classes')
      .select('id, name, join_code')
      .eq('join_code', joinCode.trim())
      .maybeSingle()

    if (error || !cls) {
      alert("Invalid class code")
      return
    }

    const studentName = user.user_metadata?.full_name || user.email || "Unknown"

    const { error: upsertError } = await supabase
      .from('students')
      .upsert({
        user_id: user.id,
        class_id: cls.id,
        name: studentName
      })

    if (upsertError) {
      alert("Error: " + upsertError.message)
    } else {
      alert(`${t('student.joinClass')}: ${cls.name}`)
      setJoinCode('')
      setShowJoinModal(false)
      await loadClass(user)
    }
  }

  async function leaveClass() {
    const confirmLeave = window.confirm(t('student.leaveClass'))
    if (!confirmLeave) return

    const { error } = await supabase
      .from('students')
      .update({ class_id: null })
      .eq('user_id', user.id)

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert(t('student.leaveClass'))
      setClassInfo(null)
      setTeacherInfo(null)
      setAssignments([])
    }
  }

  async function submitAssignment(assignmentId: number) {
    const resources: string[] = []

    if (submissionText.trim()) {
      resources.push(submissionText.trim())
    }

    if (submissionFile) {
      const filePath = `submissions/${user.id}-${Date.now()}-${submissionFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, submissionFile)

      if (uploadError) {
        alert("文件上传失败: " + uploadError.message)
        return
      }
      const { data } = supabase.storage.from('submissions').getPublicUrl(filePath)
      resources.push(data.publicUrl)
    }

    const { error } = await supabase.from('submissions').insert({
      assignment_id: assignmentId,
      student_id: user.id,
      resources,
      feedback: null
    })

    if (error) {
      alert("提交失败: " + error.message)
    } else {
      alert(t('student.submitAssignment'))
      setSubmissionText('')
      setSubmissionFile(null)
      await loadClass(user)
    }
  }

  async function addStudentComment(submissionId: number, feedback: string) {
    const { error } = await supabase
      .from('submissions')
      .update({ feedback })
      .eq('id', submissionId)

    if (!error) {
      alert(t('student.studentComment'))
      setNewComment('')
      await loadClass(user)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{t('student.myClass')}</h2>

      {!classInfo ? (
        <div className="rounded-lg shadow-md bg-white p-6 flex justify-end">
          <Button onClick={() => setShowJoinModal(true)}>{t('student.joinClass')}</Button>

          {showJoinModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 rounded shadow-md">
                <h3 className="text-lg font-bold mb-4">{t('student.enterCode')}</h3>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder={t('student.enterCode')}
                  className="border rounded px-2 py-1 w-full mb-4"
                />
                <Button onClick={joinClass}>{t('student.confirmJoin')}</Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg shadow-md bg-teal-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-semibold">{classInfo.name}</p>
            <Button variant="destructive" onClick={leaveClass}>{t('student.leaveClass')}</Button>
          </div>

          {teacherInfo && (
            <div className="flex items-center gap-3 mb-6">
              <img
                src={teacherInfo.avatar}
                alt="Teacher avatar"
                className="w-12 h-12 rounded-full border"
              />
              <span className="text-lg font-medium">{t('student.teacher')}: {teacherInfo.name}</span>
            </div>
          )}

          <h3 className="text-lg font-bold mb-4">{t('student.assignments')}</h3>
          {assignments.length === 0 ? (
            <p className="text-gray-500 italic">{t('student.noAssignments')}</p>
          ) : (
            <div className="space-y-6">
              {assignments.map((a) => (
                <div key={a.id} className="rounded-lg shadow-sm border p-4 bg-white">
                  <strong className="block text-teal-700">{a.title}</strong>
                  <p className="text-gray-700">{a.description}</p>

                  {a.feedback && (
                    <div className="mt-2 p-2 border rounded bg-yellow-50">
                      <strong>{t('student.teacherFeedback')}:</strong> {a.feedback}
                    </div>
                  )}

                  {submissions[a.id]?.map((s: any) => (
                                        <div key={s.id} className="mt-2 p-2 border rounded bg-gray-50">
                      <p><strong>{t('student.studentSubmission')}:</strong></p>
                      {s.resources?.map((res: string, idx: number) => (
                        <a key={idx} href={res} target="_blank" className="text-blue-600 underline">
                          🔗 Resource {idx + 1}
                        </a>
                      ))}
                      <p className="mt-2">
                        <strong>{t('student.studentComment')}:</strong> {s.feedback || t('student.noComment')}
                      </p>

                      {/* 评论输入框 */}
                      <input
                        type="text"
                        placeholder={t('student.studentComment')}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="border rounded px-2 py-1 w-full mt-2"
                      />
                      <Button
                        className="bg-teal-500 text-white mt-2"
                        onClick={() => addStudentComment(s.id, newComment)}
                      >
                        {t('student.studentComment')}
                      </Button>
                    </div>
                  ))}

                  <p className="text-xs text-gray-400 mt-2">
                    {t('student.createdAt')}: {new Date(a.created_at).toLocaleDateString()}
                  </p>

                  {/* 提交作业区 */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder={t('student.inputTextOrLink')}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="border rounded px-2 py-1 w-full mb-2"
                    />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                      className="mb-2"
                    />
                    <Button
                      className="bg-teal-500 text-white w-full"
                      onClick={() => submitAssignment(a.id)}
                    >
                      {t('student.submitAssignment')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
