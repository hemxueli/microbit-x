'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Basic Micro:bit Knowledge"
      subtitle="Learn micro:bit basics"
      pdfPath={`/slides/basic-en.pdf`}
      websitePath={`https://canva.link/2zf0ojd0e5x0e7t`}
      videoPath={`/videos/video.basic.en.mp4`}
      lang="en"
    />
  )
}
