'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Micro:bit 输入学习"
      subtitle="学习 micro:bit 输入"
      pdfPath={`/slides/input-zh.pdf`}
      websitePath={`https://example.com/input/zh`}
      videoPath={`/videos/video.input.zh.mp4`}
      lang="zh"
    />
  )
}
