'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const verifyAndRegister = async () => {
      const url = new URL(window.location.href)
      const token = url.searchParams.get('token')
      const email = url.searchParams.get('email')

      let verified = false

      // 1. 验证邮箱
      if (token && email) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        })
        if (!error) {
          verified = true
        }
      }

      // 2. 获取用户信息
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.confirmed_at) {
        setUser(user)

        // 3. 从 metadata 里拿 name 和 role
        const name = user.user_metadata?.name || user.email || user.id
        const role = user.user_metadata?.role

        if (role) {
          try {
            // 调用你写的 API，自动 upsert
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
              alert(errData.error || 'Failed to save user profile')
            } else {
              alert('Email confirmed successfully! Redirecting to your dashboard...')
              router.replace(role === 'teacher' ? '/teacher' : '/student')
            }
          } catch (err) {
            alert('Register API error: ' + (err instanceof Error ? err.message : String(err)))
          }
        } else {
          alert('Email confirmed, but role not found. Please sign up again.')
        }
      } else {
        alert(verified ? 'Email confirmed, but user not found.' : 'Email not confirmed yet. Please check your inbox.')
      }

      setLoading(false)
    }

    verifyAndRegister()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <Logo />
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Confirm Your Email</h1>
        {user ? (
          <p className="text-gray-600">
            Your email <span className="font-semibold">{user.email}</span> has been confirmed. Redirecting...
          </p>
        ) : (
          <p className="text-gray-600">No user found. Please sign up again.</p>
        )}
      </div>
    </div>
  )
}
