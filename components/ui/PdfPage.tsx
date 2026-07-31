'use client'

import { useState, useEffect } from 'react'
import MakeCodeWidget from '@/components/ui/makecode-widget'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'

export default function PdfPage({
  title,
  subtitle,
  pdfPath,
  lang,
}: {
  title: string
  subtitle: string
  pdfPath: string
  lang: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </header>

      <main className="flex-1 p-6">
        <iframe src={pdfPath} className="w-full h-[600px] rounded-lg shadow-md" />
      </main>

      {/* ✅ SSR 阶段不渲染悬浮球，避免 hydration mismatch */}
      {mounted && (
        <div className="fixed bottom-22 right-5.5 flex flex-col items-end gap-12 z-50">
          <MakeCodeWidget />
          <AiChatWidget defaultLanguage={lang as any} />
        </div>
      )}
    </div>
  )
}
