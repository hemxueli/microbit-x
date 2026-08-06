'use client'

import { useState, useEffect } from 'react'
import MakeCodeWidget from '@/components/ui/makecode-widget'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'

export default function PdfPage({
  title,
  subtitle,
  pdfPath,
  websitePath,
  videoPath,
  lang,
}: {
  title: string
  subtitle: string
  pdfPath: string
  websitePath: string
  videoPath: string
  lang: 'en' | 'zh' | 'ms'   // ✅ 限制 lang 类型
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ 定义 labels 类型，避免 TS 报红线
  const labels: Record<'en' | 'zh' | 'ms', { pdf: string; website: string; video: string }> = {
    en: { pdf: 'PDF Notes', website: 'Website', video: 'Video' },
    zh: { pdf: '学习笔记', website: '网站', video: '视频' },
    ms: { pdf: 'Nota PDF', website: 'Laman Web', video: 'Video' },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </header>

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PDF 卡片 */}
          <a
            href={pdfPath}
            target="_blank"
            className="relative h-[220px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-cover bg-center"
            style={{ backgroundImage: "url('/images/pdf.png')" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xl font-bold group-hover:scale-110 transition">
                {labels[lang].pdf}
              </span>
            </div>
          </a>

          {/* Website 卡片 */}
          <a
            href={websitePath}
            target="_blank"
            className="relative h-[220px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-cover bg-center"
            style={{ backgroundImage: "url('/images/website.png')" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xl font-bold group-hover:scale-110 transition">
                {labels[lang].website}
              </span>
            </div>
          </a>

          {/* Video 卡片 */}
          <a
            href={videoPath}
            target="_blank"
            className="relative h-[220px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-cover bg-center"
            style={{ backgroundImage: "url('/images/video.png')" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xl font-bold group-hover:scale-110 transition">
                {labels[lang].video}
              </span>
            </div>
          </a>
        </div>
      </main>

      {mounted && (
        <div className="fixed bottom-22 right-5.5 flex flex-col items-end gap-12 z-50">
          <MakeCodeWidget />
          <AiChatWidget defaultLanguage={lang} />
        </div>
      )}
    </div>
  )
}
