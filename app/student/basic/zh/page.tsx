'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="基础 Micro:bit 学习"
      subtitle="学习 micro:bit 基础知识"
      pdfPath={`/slides/basic-zh.pdf`}
      websitePath={`https://example.com/basic/zh`}
      videoPath={`/videos/video.basic.zh.mp4`}
      lang="zh"
    />
  )
}
