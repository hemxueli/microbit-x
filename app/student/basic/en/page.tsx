'use client'

import PdfPage from '@/components/ui/PdfPage'

export default function Page({ params }: { params: { topic: string; lang: string } }) {
  const { topic } = params

  return (
    <PdfPage
      title="Basic Micro:bit Learning"
      subtitle="Learn micro:bit basics"
      pdfPath={`/slides/basic-en.pdf`}
      websitePath={*BASIC :*
BM - https://canva.link/aupvux6jrt367na
BI - https://canva.link/q0xkb735w9if6ff
BC - https://canva.link/9xpo3h34ro21xps

*INPUT :*
BM - https://canva.link/hxqkv3li0l1i0t1
BI - https://canva.link/mxomqxrtx4dkekq
BC - https://canva.link/j8kd63i2erc6wok

*MUSIC :*
BM - https://canva.link/fju3y586zossl9q
BI - https://canva.link/m00hpxu274cdqo7
BC - https://canva.link/bs4yluvq9fj9p8x
      videoPath={`/videos/video.basic.en.mp4`}
      lang="en"
    />
  )
}
