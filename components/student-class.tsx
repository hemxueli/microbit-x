'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

export default function StudentClass({ user }: { user: any }) {
  const [classInfo, setClassInfo] = useState<any | null>(null)
  const [teacherInfo, setTeacherInfo] = useState<any | null>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [joinCode, setJoinCode] = useState('')

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
      setComments([])
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
      setComments([])
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
      .select('id, title, description, created_at, resources')
      .eq('class_id', cls.id)
    setAssignments(assignmentData || [])

    const { data: commentData } = await supabase
      .from('comments')
      .select('id, content, created_at')
      .eq('student_id', user.id)
    setComments(commentData || [])
  }

  async function joinClass() {
    if (!joinCode.trim()) {
      alert("Please enter a class code")
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
      alert("Joined class: " + cls.name)
      setJoinCode('')
      await loadClass(user)
    }
  }

  async function leaveClass() {
    const confirmLeave = window.confirm("Are you sure you want to leave this class?")
    if (!confirmLeave) return

    const { error } = await supabase
      .from('students')
      .update({ class_id: null })
      .eq('user_id', user.id)

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert("You have left the class")
      setClassInfo(null)
      setTeacherInfo(null)
      setAssignments([])
      setComments([])
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">My Class</h2>

      {!classInfo ? (
        <div className="relative h-[200px] rounded-lg shadow-md overflow-hidden flex items-center justify-between bg-teal-100 p-6">
          <Button variant="destructive" onClick={leaveClass}>
            Leave Class
          </Button>
          <div className="flex gap-2">
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter class code"
              className="border rounded px-2 py-1"
            />
            <Button onClick={joinClass}>Join Class</Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg shadow-md bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <Button variant="destructive" onClick={leaveClass}>
              Leave Class
            </Button>
            <p className="text-xl font-semibold">{classInfo.name}</p>
          </div>

          {teacherInfo && (
            <div className="flex items-center gap-3 mb-6">
              <img
                src={teacherInfo.avatar}
                alt="Teacher avatar"
                className="w-12 h-12 rounded-full border"
              />
              <span className="text-lg font-medium">Teacher: {teacherInfo.name}</span>
            </div>
          )}

          <h3 className="text-lg font-bold mb-4">Assignments</h3>
          {assignments.length === 0 ? (
            <p className="text-gray-500 italic">No assignments yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg shadow-sm border p-4 bg-gray-50"
                >
                  <strong className="block text-teal-700">{a.title}</strong>
                  <p className="text-gray-700">{a.description}</p>

                  {/* 显示 resources */}
                  {a.resources && Array.isArray(a.resources) && (
                    <div className="mt-2 space-y-2">
                      {a.resources.map((res: string, idx: number) => (
                        <div key={idx}>
                          {res.endsWith('.jpg') || res.endsWith('.png') || res.endsWith('.jpeg') ? (
                            <img
                              src={res}
                              alt={`Resource ${idx + 1}`}
                              className="rounded-lg max-h-40 object-cover"
                            />
                          ) : (
                            <a
                              href={res}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              🔗 Resource {idx + 1}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Created at: {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-lg font-bold mt-6 mb-4">Comments from Teacher</h3>
          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg shadow-sm border p-3 bg-gray-50"
                >
                  {c.content}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
