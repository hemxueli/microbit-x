'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic, lang } = params

  return (
    <PdfPage
      title="基础课程"
      subtitle="学习 micro:bit 基础知识"
      pdfPath={`/slides/basic-zh.pdf`}
      lang={lang}
    />
  )
}
