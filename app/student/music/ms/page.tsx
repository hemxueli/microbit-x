'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic, lang } = params
  return (
    <PdfPage
      title="Pelajaran Muzik"
      subtitle="Belajar muzik micro:bit"
      pdfPath={`/pdfs/${topic}.pdf`}
      lang={lang}
    />
  )
}
