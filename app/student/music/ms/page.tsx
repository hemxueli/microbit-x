'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Pembelajaran Muzik Micro:bit"
      subtitle="Belajar muzik micro:bit"
      pdfPath={`/slides/music-ms.pdf`}
      websitePath={`https://addjkahub.my.canva.site/pengenalan-makecode-untuk-micro-bit-muzik`}
      videoPath={`/videos/video.music.ms.mp4`}
      lang="ms"
    />
  )
}
