'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Micro:bit Music Learning"
      subtitle="Learn micro:bit music"
      pdfPath={`/slides/music-en.pdf`}
      websitePath={`https://example.com/music/en`}
      videoPath={`/videos/video.music.en.mp4`}
      lang="en"
    />
  )
}
