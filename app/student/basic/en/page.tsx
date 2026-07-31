'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { lang } = params

  return (
    <PdfPage
      title="Basic Lesson"
      subtitle="Learn micro:bit basics"
      pdfPath={`/slides/basic-en.pdf`}
      websitePath={`/website/basic-en`}
      videoPath={`/video/basic-en`}
      lang={lang}
    />
  )
}
