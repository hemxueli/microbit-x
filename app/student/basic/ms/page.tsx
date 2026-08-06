'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Pembelajaran Asas Micro:bit"
      subtitle="Belajar asas micro:bit"
      pdfPath={`/slides/basic-ms.pdf`}
      websitePath={`https://addjkahub.my.canva.site/makecode-micro-bit-pengenalan`}
      videoPath={`/videos/video.basic.ms.mp4`}
      lang="ms"
    />
  )
}
