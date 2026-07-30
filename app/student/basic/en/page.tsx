'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic, lang } = params

  return (
    <PdfPage
      title="Basic Micro:bit Learning"
      subtitle="Bahasa Melayu Version"
      pdfPath={`/slides/basic-en.pdf`}
      lang={lang}
    />
  )
}
