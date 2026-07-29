'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function MakeCodeWidget() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 悬浮球按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-105"
        title="Open MakeCode"
      >
        <Image
          src="/images/makec.png"   // 你上传的 micro:bit 彩色图标
          alt="micro:bit icon"
          width={32}
          height={32}
        />
      </button>

      {/* 全屏 MakeCode 弹窗 */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-white">
          {/* 顶部关闭按钮 */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
          >
            ✕
          </button>

          {/* iframe 区域 */}
          <iframe
            src="https://makecode.microbit.org/"
            className="w-full h-full"
          />
        </div>
      )}
    </>
  )
}
