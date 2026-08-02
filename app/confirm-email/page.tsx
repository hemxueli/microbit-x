'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/logo'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifyEmail = async () => {
      const url = new URL(window.location.href)
      const token = url.searchParams.get('token')
      const email = url.searchParams.get('email')

      // 固定 type 为 signup，因为这是邮箱注册确认
      if (token && email) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        })
        if (error) {
          alert(error.message)
        }
      }

      // 验证后获取用户信息
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)

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

          // 如果没有角色，跳到默认首页
          router.push('/')
        }
      }
      setLoading(false)
    }

    verifyEmail()
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
              Your email <span className="font-semibold">{user.email}</span> has been confirmed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting you to your dashboard...
            </p>
          </>
        ) : (
          <p className="text-gray-600">No user found. Please sign up again.</p>
        )}
      </div>
    </div>
  )
}
