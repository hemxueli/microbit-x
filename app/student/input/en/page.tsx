'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Micro:bit Input Knowledge"
      subtitle="Learn micro:bit input"
      pdfPath={`/slides/input-en.pdf`}
      websitePath={`https://addjkahub.my.canva.site/makecode-micro-bit-input`}
      videoPath={`/videos/video.input.en.mp4`}
      lang="en"
    />
  )
}
