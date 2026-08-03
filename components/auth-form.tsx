'use client'

import { Eye, EyeOff, GraduationCap, School } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Role = 'student' | 'teacher'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
  role?: Role   // 👈 支持传入 role
}

export function AuthForm({ mode, role }: AuthFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>(role || 'student') // 默认用传入的 role

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))
    const name = String(form.get('name') ?? '')

    try {
      if (mode === 'sign-up') {
        // 注册
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/confirm-email`,
            data: { name, role: selectedRole } // 保存名字和角色到 metadata
          }
        })
        if (error) throw new Error(error.message)

        const user = data.user
        if (user) {
          await supabase.from(selectedRole === 'teacher' ? 'teachers' : 'students').insert({
            user_id: user.id,
            name,
            avatar: '/images/default-avatar.png',
          })
        }

        alert(`Sign-up successful! A confirmation email has been sent to ${email}. Please check your inbox and verify your account before logging in.`)
        router.push('/sign-in')
      } else {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: teacher } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', user.id)
            .single()

          if (teacher) {
            router.push('/teacher')
          } else {
            router.push('/student')
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {mode === 'sign-up' && (
        <>
          {/* 角色选择 */}
          <div className="flex flex-col gap-2">
            <Label>{t('auth.role')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: 'student', label: t('auth.student'), Icon: GraduationCap },
                  { value: 'teacher', label: t('auth.teacher'), Icon: School },
                ] as const
              ).map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRole(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-colors',
                    selectedRole === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  )}
                  aria-pressed={selectedRole === value}
                >
                  <Icon className="size-6" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 姓名输入 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t('auth.name')}</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
        </>
      )}

      {/* 邮箱输入 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@school.edu" />
      </div>

      {/* 密码输入 */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* 提交按钮 */}
      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading
          ? t('auth.processing')
          : mode === 'sign-up'
            ? t('auth.signUp')
            : t('auth.signIn')}
      </Button>

      {/* 底部切换链接 */}
      <p className="text-center text-sm text-muted-foreground">
        {mode === 'sign-up' ? (
          <>
            {t('auth.haveAccount')}{' '}
            <Link href="/sign-in" className="font-semibold text-primary hover:underline">
              {t('auth.signIn')}
            </Link>
          </>
        ) : (
          <>
            {t('auth.noAccount')}{' '}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              {t('auth.signUp')}
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
