'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, School } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Role = 'student' | 'teacher'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { t } = useI18n()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<Role>('student')

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
        // 1. 注册到 Supabase Auth
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw new Error(error.message)

        // 2. 获取用户对象
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not created')

        // 3. 保存到 teachers/students 表
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            name,
            role,
          }),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to save user profile')
        }

        // 4. 跳转到确认邮箱页面
        router.push('/confirm-email')
      } else {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)

        // 登录成功后获取用户
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not found")

        alert(`We have sent a confirmation email to ${email}. Please check your inbox and click the confirmation link.`)

        // 登录成功后直接跳转首页（或根据角色跳转）
        router.push('/')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {mode === 'sign-up' && (
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
                onClick={() => setRole(value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-semibold transition-colors',
                  role === value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40',
                )}
                aria-pressed={role === value}
              >
                <Icon className="size-6" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'sign-up' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t('auth.name')}</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@school.edu" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading
          ? t('auth.processing')
          : mode === 'sign-up'
            ? t('auth.signUp')
            : t('auth.signIn')}
      </Button>

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
