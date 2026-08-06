'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Pembelajaran Muzik Micro:bit"
      subtitle="Belajar muzik micro:bit"
      pdfPath={`/slides/music-ms.pdf`}
      websitePath={`https://example.com/music/ms`}
      videoPath={`/videos/video.music.ms.mp4`}
      lang="ms"
    />
  )
}
