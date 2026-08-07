'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n, dict } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const { lang } = useI18n()
  const router = useRouter()

  useEffect(() => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('token')
    const email = url.searchParams.get('email')

    if (token && email) {
      supabase.auth.verifyOtp({ email, token, type: 'recovery' })
        .then(({ error }) => {
          if (error) setMessage(error.message)
        })
    }
  }, [])

  async function handleReset() {
    setMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage(dict['reset.success'][lang])
      // 延迟 1.5 秒后跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/"><Logo /></Link>
        <LanguageSwitcher />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md rounded-xl shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-extrabold text-red-600">
              {dict['reset.title'][lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={dict['reset.newPassword'][lang]}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

              <Button
                onClick={handleReset}
                disabled={!password}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {dict['common.submit'][lang]}
              </Button>

              {message && (
                <p className="mt-4 text-sm text-gray-700 text-center">{message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
