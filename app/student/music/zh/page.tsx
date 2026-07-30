'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic, lang } = params
  return (
    <PdfPage
      title="音乐课程"
      subtitle="学习 micro:bit 音乐"
      pdfPath={`/pdfs/${topic}.pdf`}
      lang={lang}
    />
  )
}
