'use client'

import { useState } from 'react'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'
import MakeCodeWidget from '@/components/ui/makecode-widget'

interface PdfPageProps {
  title: string
  subtitle: string
  pdfPath: string
}

export default function PdfPage({ title, subtitle, pdfPath }: PdfPageProps) {
  // 默认语言是英文
  const [language, setLanguage] = useState("en")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header className="bg-teal-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-sm">{subtitle}</p>
        </div>

      </header>

      {/* 主体内容：PDF Slide */}
      <main className="flex-1 p-6">
        <iframe
          src={pdfPath}
          className="w-full h-[600px] rounded-lg shadow-md"
        />
      </main>

      {/* 悬浮球容器：右下角，22/5.5 */}
      <div className="fixed bottom-22 right-5.5 flex flex-col items-end gap-12 z-50">
        <MakeCodeWidget />
        <AiChatWidget />
      </div>
    </div>
  )
}
