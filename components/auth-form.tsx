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

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { t } = useI18n()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
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
        // 注册到 Supabase Auth，并指定 redirectTo
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://microbot-x.vercel.app/confirm-email'
          }
        })
        if (error) throw new Error(error.message)

        // 提示用户去邮箱确认
        alert(`We have sent a confirmation email to ${email}. Please check your inbox.`)

        // 跳转到确认邮箱页面，并带上注册信息
        router.push(`/confirm-email?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&role=${role}`)
      } else {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw new Error(error.message)

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
        <>
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

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">{t('auth.name')}</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@school.edu" />
      </div>

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
