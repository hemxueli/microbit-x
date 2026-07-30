'use client'

import { useSearchParams } from 'next/navigation'
import { I18nProvider } from '@/lib/i18n'
import MakeCodeWidget from '@/components/ui/makecode-widget'
import { AiChatWidget } from '@/components/ui/ai-chat-widget'

export default function PdfPage({ title, subtitle, pdfPath }: { title: string; subtitle: string; pdfPath: string }) {
  const searchParams = useSearchParams()

  return (
    <I18nProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="bg-teal-600 text-white px-6 py-4 shadow-md">
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-sm">{subtitle}</p>
        </header>

        <main className="flex-1 p-6">
          <iframe src={pdfPath} className="w-full h-[600px] rounded-lg shadow-md" />
        </main>

        <div className="fixed bottom-22 right-5.5 flex flex-col items-end gap-12 z-50">
          <MakeCodeWidget />
          <AiChatWidget />
        </div>
      </div>
    </I18nProvider>
  )
}
