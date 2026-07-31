'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useI18n, dict } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { lang } = useI18n()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') // ✅ 自动读取 URL 参数

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setMessage(dict['reset.mismatch'][lang])
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setMessage(error.message || dict['reset.error'][lang])
      } else {
        setMessage(dict['reset.success'][lang])
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
              {dict['reset.title'][lang]}
            </CardTitle>
            <CardDescription className="text-gray-500">
              {dict['app.tagline'][lang]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ✅ 邮箱自动读取，不需要用户再输入 */}
              <p className="text-sm text-gray-600 text-center">
                {dict['auth.email'][lang]}: <span className="font-semibold">{email}</span>
              </p>

              <Input
                type="password"
                placeholder={dict['reset.newPassword'][lang]}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder={dict['reset.confirmPassword'][lang]}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? dict['auth.processing'][lang] : dict['common.submit'][lang]}
              </Button>
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
