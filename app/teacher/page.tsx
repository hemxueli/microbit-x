'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { ChevronDown, MoreVertical, X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function TeacherPage({ user }: { user?: any }) {
  const { t } = useI18n()
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name] = useState(user?.name ?? 'Teacher')
  const [avatar] = useState(user?.image ?? '/images/default-avatar.png')
  const [newClass, setNewClass] = useState('')

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes')
        const data = await res.json()
        setClasses(data)
      } catch (err) {
        console.error('Failed to load classes:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  const addClass = () => {
    if (!newClass.trim()) return
    const newEntry = { id: Date.now().toString(), name: newClass, students: [] }
    setClasses([...classes, newEntry])
    setNewClass('')
    setEditing(false)
    // TODO: 调用 API 保存班级
  }

  if (loading) return <p className="text-gray-500">{t('common.loading')}</p>

  const colors = [
    { bg: 'bg-blue-100 hover:bg-blue-200', dot: 'bg-blue-500' },
    { bg: 'bg-green-100 hover:bg-green-200', dot: 'bg-green-500' },
    { bg: 'bg-yellow-100 hover:bg-yellow-200', dot: 'bg-yellow-500' },
    { bg: 'bg-pink-100 hover:bg-pink-200', dot: 'bg-pink-500' },
    { bg: 'bg-purple-100 hover:bg-purple-200', dot: 'bg-purple-500' },
    { bg: 'bg-orange-100 hover:bg-orange-200', dot: 'bg-orange-500' },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <div className="flex items-center gap-2 cursor-pointer">
              <Image src={avatar} alt="avatar" width={36} height={36} className="rounded-full border" />
              <span className="font-medium">{name}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <Button variant="ghost" size="sm">{t('nav.logout')}</Button>
          </div>
        </div>
      </header>

      {/* 页面主体 */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-6 py-12 md:py-20">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight">
            {t('teacher.welcomeTitle')}
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            {t('teacher.welcomeSubtitle')}
          </p>

          {/* 顶部只显示创建班级按钮 */}
          <Button onClick={() => setEditing(true)}>{t('teacher.createClass')}</Button>

          {/* 班级卡片列表 */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-6">
            {classes.map((cls, index) => {
              const color = colors[index % colors.length]
              const [menuOpen, setMenuOpen] = useState(false)
              const [editOpen, setEditOpen] = useState(false)
              const [deleteOpen, setDeleteOpen] = useState(false)
              const [editName, setEditName] = useState(cls.name)

              return (
                <div
                  key={cls.id}
                  className={`border rounded-lg p-6 shadow transition-colors duration-300 ${color.bg} relative`}
                >
                  {/* 标题 + 彩色圆点 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${color.dot}`}></span>
                    <h3 className="text-lg font-bold">{cls.name}</h3>
                  </div>

                  {/* 学生人数统计 */}
                  <p className="text-sm text-gray-700 mb-6">
                    👥 {cls.students?.length ?? 0} students
                  </p>

                  {/* 底部操作区 */}
                  <div className="flex justify-between items-center">
                    {/* 左下角三个点 */}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1 rounded hover:bg-gray-300 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {menuOpen && (
                        <div className="absolute bottom-8 left-0 bg-white border rounded shadow-lg w-36">
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setEditOpen(true)
                              setMenuOpen(false)
                            }}
                          >
                            Edit class name
                          </button>
                          <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                            onClick={() => {
                              setDeleteOpen(true)
                              setMenuOpen(false)
                            }}
                          >
                            Delete class
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 右下角管理班级按钮 */}
                    <Button size="sm">{t('teacher.classesTable')}</Button>
                  </div>

                  {/* 编辑班级名称窗口 */}
                  {editOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fadeIn">
                      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative animate-scaleIn">
                        <button
                          onClick={() => setEditOpen(false)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold mb-4">Edit class name</h2>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border rounded px-2 py-1 w-full mb-4"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => {
                              // TODO: Save new class name logic
                              setEditOpen(false)
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 删除确认窗口 */}
                  {deleteOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fadeIn">
                      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative animate-scaleIn">
                        <button
                          onClick={() => setDeleteOpen(false)}
                          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold mb-4">Delete class</h2>
                        <p className="text-gray-700 mb-4">Are you sure you want to delete this class?</p>
                        <div className="flex justify-end gap-2">
                                                    <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => {
                              // TODO: Delete class logic
                              setDeleteOpen(false)
                            }}
                          >
                            Confirm Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {classes.length === 0 && (
              <p className="text-gray-500">{t('teacher.noClasses')}</p>
            )}
          </div>
        </section>
      </main>

      {/* 创建班级窗口 */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fadeIn">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative animate-scaleIn">
            <button
              onClick={() => setEditing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">{t('teacher.createClass')}</h2>
            <input
              type="text"
              placeholder={t('teacher.enterClass')}
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              className="border rounded px-2 py-1 w-full mb-4"
            />
            <div className="flex justify-end">
              <Button onClick={addClass}>{t('teacher.createClass')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* 底部版权栏 */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 text-sm text-muted-foreground">
          <Logo showText={false} />
          <span>{'\u00A9'} 2026 MicroBit-X</span>
        </div>
      </footer>
    </div>
  )
}
