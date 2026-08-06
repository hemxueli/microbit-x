'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Micro:bit Input Learning"
      subtitle="Learn micro:bit input"
      pdfPath={`/slides/input-en.pdf`}
      websitePath={`https://example.com/input/en`}
      videoPath={`/videos/video.input.en.mp4`}
      lang="en"
    />
  )
}
