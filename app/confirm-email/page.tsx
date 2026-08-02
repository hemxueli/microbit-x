'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)

        // 如果邮箱已经确认
        if (user.confirmed_at) {
          // 查询角色
          const { data: teacher } = await supabase
            .from('teachers')
            .select('user_id')
            .eq('user_id', user.id)
            .single()

          if (teacher) {
            router.push('/teacher')
            return
          }

          const { data: student } = await supabase
            .from('students')
            .select('user_id')
            .eq('user_id', user.id)
            .single()

          if (student) {
            router.push('/student')
            return
          }
        }
      }
      setLoading(false)
    }

    // 每隔 3 秒检查一次用户状态
    const interval = setInterval(checkUser, 3000)
    return () => clearInterval(interval)
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
          <>
            <p className="text-gray-600 mb-6">
              We’ve sent a confirmation link to <span className="font-semibold">{user.email}</span>.
              Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              If you don’t see the email, check your spam folder.
            </p>
            <Button
              onClick={async () => {
                const { error } = await supabase.auth.resend({
                  type: 'signup',
                  email: user.email,
                })
                if (error) {
                  alert(error.message)
                } else {
                  alert(`Confirmation email resent to ${user.email}. Please check your inbox.`)
                  // 立即检查一次用户状态
                  const { data: { user: refreshedUser } } = await supabase.auth.getUser()
                  if (refreshedUser?.confirmed_at) {
                    router.push('/student') // 或 /teacher，根据角色
                  }
                }
              }}
            >
              Resend Email
            </Button>
          </>
        ) : (
          <p className="text-gray-600">No user found. Please sign up again.</p>
        )}
      </div>
    </div>
  )
}
