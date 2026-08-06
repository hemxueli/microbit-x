'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Micro:bit 音乐学习"
      subtitle="学习 micro:bit 音乐"
      pdfPath={`/slides/music-zh.pdf`}
      websitePath={`https://addjkahub.my.canva.site/dahq2h9hsik`}
      videoPath={`/videos/video.music.zh.mp4`}
      lang="zh"
    />
  )
}
