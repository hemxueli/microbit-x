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
  const { lang } = useI18n()
  const router = useRouter()

  async function handleSendEmail() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) {
      alert(error.message) // 出错时直接弹窗提示
    } else {
      // 成功时弹窗提示，按 OK 后跳转
      alert(dict['forgot.success'][lang] || 'Check your email to reset your password.')
      router.push('/login')
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
            <div className="space-y-4">
              <Input
                type="email"
                placeholder={dict['forgot.placeholder'][lang]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                onClick={handleSendEmail}
                disabled={!email}
                className="w-full"
              >
                {dict['forgot.button'][lang]}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
