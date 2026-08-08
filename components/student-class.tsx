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

  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [currentAssignmentId, setCurrentAssignmentId] = useState<number | null>(null)
  const [submissionText, setSubmissionText] = useState('')
  const [submissionFile, setSubmissionFile] = useState<File | null>(null)
  const [submissionLink, setSubmissionLink] = useState('')
  const [showLinkModal, setShowLinkModal] = useState(false)

  useEffect(() => {
    if (user) loadClass(user)
  }, [user])

  async function loadClass(user: any) {
    const { data: student } = await supabase
      .from('students')
      .select('class_id')
      .eq('user_id', user.id)   // user.id 是 Auth UID
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

    const { data: assignmentData, error } = await supabase
      .from('assignments')
      .select('id, title, description, resources, created_at')
      .eq('class_id', cls.id)
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    setAssignments(assignmentData || [])

    for (const a of assignmentData || []) {
      const { data: subs } = await supabase
        .from('submissions')
        .select('id, resources, feedback, created_at')
        .eq('assignment_id', a.id)
        .eq('student_user_id', user.id)   // ✅ 改成 student_user_id
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
        user_id: user.id,   // ✅ 存 Auth UID
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
      .eq('user_id', user.id)   // ✅ Auth UID

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
    const resources: { type: string; url: string; name?: string }[] = []

    // 如果有文件上传
    if (submissionFile) {
      const filePath = `submissions/${user.id}-${Date.now()}-${submissionFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(filePath, submissionFile)

      if (uploadError) {
        alert("File Upload Failed: " + uploadError.message)
        return
      }

      const { data } = supabase.storage.from('submissions').getPublicUrl(filePath)
      resources.push({
        type: "file",
        url: data.publicUrl,
        name: submissionFile.name
      })
    }

    // 如果有链接输入
    if (submissionLink.trim()) {
      resources.push({
        type: "link",
        url: submissionLink.trim(),
        name: "参考链接"
      })
    }

    // 插入数据库
    const { error } = await supabase.from('submissions').insert({
      assignment_id: assignmentId,
      student_user_id: user.id,
      text: submissionText.trim(),   // ✅ 文字单独放在 text
      resources,                     // ✅ 文件和链接放在 resources(JSONB)
      feedback: null
    })

    if (error) {
      alert("Upload Failed: " + error.message)
    } else {
      alert(t('student.submitAssignment'))
      setSubmissionText('')
      setSubmissionFile(null)
      setSubmissionLink('')
      await loadClass(user)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{t('student.myClass')}</h2>

      {!classInfo ? (
      <div className="rounded-lg shadow-md bg-white p-6 flex justify-between items-center">
        {/* 左边显示没有班级的提示 */}
        <span className="text-gray-500 italic">
          {t('student.noClasses')}
        </span>

        {/* 右边按钮 */}
        <Button onClick={() => setShowJoinModal(true)}>
          {t('student.joinClass')}
        </Button>

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

                  {/* 老师上传的资源 */}
                  {a.resources && a.resources.length > 0 && (
                    <div className="mt-2">
                      <strong className="block text-teal-700">{t('student.resources')}:</strong>
                      {a.resources.map((res: string, idx: number) => {
                        const isImage = res.match(/\.(jpg|jpeg|png|gif)$/i)
                        const isPdf = res.match(/\.pdf$/i)
                        return (
                          <div key={idx} className="mt-2">
                            {isImage ? (
                              <img src={res} alt={`Resource ${idx + 1}`} className="w-full max-w-md rounded border" />
                            ) : isPdf ? (
                              <iframe src={res} className="w-full h-64 border rounded" />
                            ) : (
                              <a href={res} target="_blank" className="text-blue-600 underline block">
                                🔗 {res}
                              </a>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* 老师反馈 */}
                  {a.feedback && (
                    <div className="mt-2 p-2 border rounded bg-yellow-50">
                      <strong>{t('student.teacherFeedback')}:</strong> {a.feedback}
                    </div>
                  )}

                  {/* 学生提交显示 */}
                  {submissions[a.id]?.map((s: any) => (
                    <div key={s.id} className="mt-2 p-2 border rounded bg-gray-50">
                      <p><strong>{t('student.studentSubmission')}:</strong></p>
                      {s.resources?.map((res: string, idx: number) => {
                        const isImage = res.match(/\.(jpg|jpeg|png|gif)$/i)
                        const isPdf = res.match(/\.pdf$/i)
                        return (
                          <div key={idx} className="mt-2">
                            {isImage ? (
                              <img src={res} alt={`Submission ${idx + 1}`} className="w-full max-w-md rounded border" />
                            ) : isPdf ? (
                              <iframe src={res} className="w-full h-64 border rounded" />
                            ) : (
                              <a href={res} target="_blank" className="text-blue-600 underline block">
                                🔗 {res}
                              </a>
                            )}
                          </div>
                        )
                      })}
                      <p className="mt-2">
                        <strong>{t('student.teacherFeedback')}:</strong> {s.feedback || t('student.noComment')}
                      </p>
                    </div>
                  ))}

                  <p className="text-xs text-gray-400 mt-2">
                    {t('student.createdAt')}: {new Date(a.created_at).toLocaleDateString()}
                  </p>

                  {/* Upload 按钮 */}
                  <div className="mt-4">
                    <Button
                      className="bg-teal-500 text-white w-full"
                      onClick={() => {
                        setCurrentAssignmentId(a.id)
                        setShowSubmissionModal(true)
                      }}
                    >
                      {t('student.upload')}
                    </Button>


                    {showSubmissionModal && (
                      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] h-[500px] flex flex-col relative">
                          {/* 关闭按钮 */}
                          <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowSubmissionModal(false)}
                          >
                            ✖
                          </button>

                          {/* 标题 */}
                          <h2 className="text-xl font-bold mb-4 text-teal-700">
                            {t('student.submitAssignment')}
                          </h2>

                          {/* 内容区：自动拉长输入框 + 文件上传 */}
                          <div className="flex-1 overflow-y-auto">
                            {/* 自动拉长输入框 */}
                            <textarea
                              placeholder={t('student.inputTextOrLink')}
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement
                                target.style.height = "auto"
                                target.style.height = target.scrollHeight + "px"
                              }}
                              className="border rounded px-2 py-2 w-full mb-4 resize-none overflow-hidden min-h-[120px]"
                              rows={3}
                            />

                            {/* 美化文件上传按钮 */}
                            <div className="flex flex-col items-start mb-4">
                              <label
                                htmlFor="fileUpload"
                                className="flex items-center justify-center px-4 py-2 border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 text-teal-700 font-medium"
                              >
                                📂 {t('student.uploadFile')}
                              </label>
                              <input
                                id="fileUpload"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                              />
                              {submissionFile && (
                                <p className="text-sm text-gray-600 mt-2">
                                  ✅ {submissionFile.name} ({(submissionFile.size / 1024).toFixed(1)} KB)
                                </p>
                              )}
                            </div>
                            {/* 上传链接输入框 */}
                            <div className="flex flex-col items-start mb-4">
                              <label className="flex items-center justify-center px-4 py-2 border border-teal-300 rounded-lg cursor-pointer hover:bg-teal-50 text-teal-700 font-medium">
                                🔗 {t('student.uploadLink')}
                              </label>
                              <input
                                type="text"
                                placeholder="https://"
                                value={submissionLink}
                                onChange={(e) => setSubmissionLink(e.target.value)}
                                className="border rounded px-2 py-2 w-full mt-2"
                              />
                            </div>
                          </div>

                          {/* 底部按钮固定 */}
                          <div className="mt-4">
                            <Button
                              className="bg-teal-500 text-white w-full"
                              onClick={() => {
                                if (currentAssignmentId) {
                                  submitAssignment(currentAssignmentId)
                                }
                                setShowSubmissionModal(false)
                              }}
                            >
                              {t('student.submit')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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
