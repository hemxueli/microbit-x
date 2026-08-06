'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Pembelajaran Input Micro:bit"
      subtitle="Belajar input micro:bit"
      pdfPath={`/slides/input-ms.pdf`}
      websitePath={`https://example.com/input/ms`}
      videoPath={`/videos/video.input.ms.mp4`}
      lang="ms"
    />
  )
}
