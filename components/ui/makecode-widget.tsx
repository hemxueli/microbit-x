'use client'

import { useState } from 'react'

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
        {/* 黑色长方形 + 黄色双点 + 灰色按钮 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-10 h-10">
          {/* 主板：更大黑色长方形，轻微圆角 */}
          <rect x="10" y="16" width="44" height="28" rx="6" fill="black" />

          {/* 黄色 LED 双点（紧贴在一起） */}
          <circle cx="30" cy="22" r="2" fill="#FFD700" />
          <circle cx="32.5" cy="22" r="2" fill="#FFD700" />

          {/* 左右按钮 A/B（缩小版） */}
          <circle cx="16" cy="30" r="2" fill="#cccccc" />
          <circle cx="48" cy="30" r="2" fill="#cccccc" />
        </svg>
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
