'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n, dict } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { lang } = useI18n()
  const router = useRouter()

  async function handleSendCode() {
    setMessage('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://your-app.com/reset-password',
      })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage(dict['forgot.success'][lang])
      }
    } catch {
      setMessage('Server error.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('reset_codes')
        .select('*')
        .eq('email', email)
        .eq('code', code)
        .single()

      if (error || !data) {
        setMessage(dict['reset.error'][lang])
      } else if (new Date(data.expires_at).getTime() < Date.now()) {
        setMessage(dict['reset.error'][lang])
      } else {
        // ✅ 验证成功 → 跳转到 reset-password 页面
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      }
    } catch {
      setMessage('Server error.')
    } finally {
      setLoading(false)
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
            <CardTitle className="text-2xl font-extrabold text-teal-800">
              {dict['forgot.title'][lang]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              {/* 邮箱输入 */}
              <Input
                type="email"
                placeholder={dict['forgot.placeholder'][lang]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* 验证码输入 */}
              <Input
                type="text"
                placeholder={dict['reset.code'][lang]}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              {/* 两个按钮并排 */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading || !email} // 没填邮箱时禁用
                  className="flex-1"
                >
                  {loading ? dict['auth.processing'][lang] : dict['forgot.button'][lang]}
                </Button>

                <Button
                  type="submit"
                  disabled={loading || !code} // 没填验证码时禁用
                  className="flex-1"
                >
                  {loading ? dict['auth.processing'][lang] : dict['common.submit'][lang]}
                </Button>
              </div>
            </form>

            {message && (
              <p className="mt-4 text-sm text-gray-700 text-center">{message}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
