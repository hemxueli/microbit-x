'use client'

import { useState } from 'react'
import { useI18n, dict } from '@/lib/i18n'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { lang } = useI18n() // 当前语言

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      setMessage(data.message || dict['forgot.success'][lang])
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {dict['forgot.title'][lang]}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder={dict['forgot.placeholder'][lang]}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? dict['auth.processing'][lang] : dict['forgot.button'][lang]}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-gray-700">{message}</p>
      )}
    </div>
  )
}
