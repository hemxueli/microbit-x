'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic, lang } = params
  return (
    <PdfPage
      title="Music Lesson"
      subtitle="Learn micro:bit music"
      pdfPath={`/pdfs/${topic}.pdf`}
      lang={lang}
    />
  )
}
