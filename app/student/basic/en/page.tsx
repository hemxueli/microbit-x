'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Basic Micro:bit Learning"
      subtitle="Learn micro:bit basics"
      pdfPath={`/slides/basic-en.pdf`}
      websitePath={`https://example.com/basic/en`}
      videoPath={`/videos/video.basic.en.mp4`}
      lang="en"
    />
  )
}
