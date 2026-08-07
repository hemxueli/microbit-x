'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Micro:bit 输入知识"
      subtitle="学习 micro:bit 输入"
      pdfPath={`/slides/input-zh.pdf`}
      websitePath={`https://addjkahub.my.canva.site/dahq2bz9ffo`}
      videoPath={`/videos/video.input.zh.mp4`}
      lang="zh"
    />
  )
}
