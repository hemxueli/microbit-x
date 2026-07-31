'use client'

import { useState } from 'react'
import { useI18n, dict } from '@/lib/i18n'
import { supabase } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { lang } = useI18n()

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
      // 调用 Supabase 内置 API 更新密码
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setMessage(error.message || dict['reset.error'][lang])
      } else {
        setMessage(dict['reset.success'][lang])
      }
    } catch (err) {
      setMessage('Server error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {dict['reset.title'][lang]}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder={dict['reset.newPassword'][lang]}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          placeholder={dict['reset.confirmPassword'][lang]}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`p-2 w-full rounded text-white ${
            loading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {loading ? dict['auth.processing'][lang] : dict['common.submit'][lang]}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-gray-700">{message}</p>
      )}
    </div>
  )
}
