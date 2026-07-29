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
        {/* 白色 MakeCode 图案 (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-8 h-8"
        >
          {/* 一个简化的 micro:bit 风格图案 */}
          <rect x="4" y="4" width="16" height="16" rx="3" ry="3" />
          <circle cx="9" cy="10" r="1.5" fill="black" />
          <circle cx="15" cy="10" r="1.5" fill="black" />
          <rect x="9" y="14" width="6" height="1.5" rx="0.5" ry="0.5" fill="black" />
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
