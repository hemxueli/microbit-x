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
      const name = url.searchParams.get('name')
      const role = url.searchParams.get('role')

      let verified = false

      // 1. Try to verify email (only if token exists)
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

      // 2. Get user info
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.confirmed_at) {
        setUser(user)

        // 3. Save to teachers/students table
        if (name && role) {
          await supabase.from(role === 'teacher' ? 'teachers' : 'students').upsert({
            user_id: user.id,
            name,
            avatar: '/images/default-avatar.png',
          })
        }

        // 4. Jump directly to role page
        alert('Email confirmed successfully! Redirecting to your dashboard...')
        router.replace(role === 'teacher' ? '/teacher' : '/student')
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
