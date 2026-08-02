'use client'

import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
import { Logo } from '@/components/logo'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthShell({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { t } = useI18n()

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <LanguageSwitcher />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md rounded-xl shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-extrabold text-teal-800">
              {mode === 'sign-up' ? t('auth.signUpTitle') : t('auth.signInTitle')}
            </CardTitle>
            <CardDescription className="text-gray-500">{t('app.tagline')}</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode={mode} />

            {mode === 'sign-in' && (
              <div className="mt-4 text-center">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
