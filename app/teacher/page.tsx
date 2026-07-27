'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/lib/i18n'
import { ChevronDown } from 'lucide-react'

interface Student {
  id: string
  name: string
  quizScore?: number
  evaluation?: string
}

export default function TeacherPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classes, setClasses] = useState<any[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name ?? 'Teacher')
  const [avatar, setAvatar] = useState(user?.image ?? '/images/default-avatar.png')
  const [newStudent, setNewStudent] = useState('')

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes')
        const data = await res.json()
        setClasses(data)
        // TODO: fetch students for the selected class
      } catch (err) {
        console.error('Failed to load classes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const handleSave = () => {
    // TODO: 调用 API 保存头像和名字
    setEditing(false)
  }

  const addStudent = () => {
    if (!newStudent.trim()) return
    const newEntry: Student = {
      id: Date.now().toString(),
      name: newStudent,
      quizScore: undefined,
      evaluation: ''
    }
    setStudents([...students, newEntry])
    setNewStudent('')
    // TODO: 调用 API 保存学生
  }

  const handleEvaluation = (id: string, value: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, evaluation: value } : s))
    // TODO: 调用 API 保存评估
  }

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setEditing(true)}>
              <Image
                src={avatar}
                alt="avatar"
                width={36}
                height={36}
                className="rounded-full border"
              />
              <span className="font-medium">{name}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <Button variant="ghost" size="sm">
              {t('nav.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h1 className="mb-8 text-3xl font-extrabold tracking-tight">
            {t('teacher.classesTable') ?? 'Class Management'}
          </h1>

          {/* 添加学生输入框 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder={t('teacher.enterStudent') ?? 'Enter student account or code'}
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <Button onClick={addStudent}>{t('teacher.addStudent') ?? 'Add Student'}</Button>
          </div>

          {/* 学生表格 */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">{t('teacher.studentName') ?? 'Student Name'}</th>
                <th className="border px-4 py-2">{t('teacher.quizScore') ?? 'Quiz Score'}</th>
                <th className="border px-4 py-2">{t('teacher.evaluation') ?? 'Evaluation'}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.quizScore ?? '-'}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      placeholder={t('teacher.writeEvaluation') ?? 'Write evaluation'}
                      value={student.evaluation ?? ''}
                      onChange={(e) => handleEvaluation(student.id, e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    {t('teacher.noStudents') ?? 'No students yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBit-X</span>
        </div>
      </footer>

      {/* 编辑弹窗 */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">
              {t('common.editProfile') ?? 'Edit Profile'}
            </h2>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">{t('auth.name')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-600">{t('auth.avatar')}</span>
                <div className="flex items-center gap-3">
                  <Image
                    src={avatar}
                    alt="avatar preview"
                    width={48}
                    height={48}
                    className="rounded-full border"
                  />
                  <div className="cursor-pointer px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200">
                    {t('auth.chooseFile')}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setAvatar(url)
                        }
                      }}
                    />
                  </div>
                </div>
              </label>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditing(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSave}>{t('common.save')}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
