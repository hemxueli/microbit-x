'use client'

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
  lang: string
}) {
  return (
    <div className="flex flex-col min-h-screen bg-teal-50">
      {/* 顶部标题 */}
      <header className="bg-teal-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm">{subtitle}</p>
      </header>

      {/* 主体：三个卡片 */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PDF 卡片 */}
          <a
            href={pdfPath}
            className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-cover bg-center"
            style={{ backgroundImage: "url('/images/pdf.png')" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                {lang === 'en' ? 'Knowledge Scroll' : lang === 'ms' ? 'Gulungan Ilmu' : '知识卷轴'}
              </span>
            </div>
          </a>

          {/* Website 卡片 */}
          <a
            href={websitePath}
            className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-cover bg-center"
            style={{ backgroundImage: "url('/images/website.png')" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                {lang === 'en' ? 'Discovery Portal' : lang === 'ms' ? 'Pintu Penemuan' : '探索入口'}
              </span>
            </div>
          </a>

          {/* Video 卡片 */}
          <a
            href={videoPath}
            className="relative h-[280px] rounded-lg shadow-md overflow-hidden cursor-pointer group bg-cover bg-center"
            style={{ backgroundImage: "url('/images/video.png')" }}
          >
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold group-hover:scale-110 transition">
                {lang === 'en' ? 'Vision Stream' : lang === 'ms' ? 'Aliran Visual' : '视觉之流'}
              </span>
            </div>
          </a>
        </div>
      </main>

      {/* 悬浮球容器 */}
      <div className="fixed bottom-22 right-5.5 flex flex-col items-end gap-12 z-50">
        <MakeCodeWidget />
        <AiChatWidget />
      </div>
    </div>
  )
}
