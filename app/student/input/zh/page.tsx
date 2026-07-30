'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic, lang } = params
  return (
    <PdfPage
      title="输入课程"
      subtitle="学习 micro:bit 输入"
      pdfPath={`/pdfs/${topic}.pdf`}
      lang={lang}
    />
  )
}
