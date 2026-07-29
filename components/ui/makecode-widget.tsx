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
        {/* 扁平化 micro:bit 图标 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-9 h-9">
          {/* 主板 */}
          <rect x="8" y="12" width="48" height="32" rx="6" fill="black" />
          
          {/* LED 心形 */}
          <circle cx="24" cy="22" r="2" fill="#ff4d4d"/>
          <circle cx="28" cy="26" r="2" fill="#ff4d4d"/>
          <circle cx="32" cy="22" r="2" fill="#ff4d4d"/>
          <circle cx="36" cy="26" r="2" fill="#ff4d4d"/>
          <circle cx="28" cy="30" r="2" fill="#ff4d4d"/>
          <circle cx="32" cy="30" r="2" fill="#ff4d4d"/>

          {/* 按钮 A/B */}
          <circle cx="14" cy="28" r="3" fill="#cccccc"/>
          <circle cx="50" cy="28" r="3" fill="#cccccc"/>

          {/* 底部引脚 */}
          <rect x="12" y="44" width="6" height="6" fill="#ffd700"/>
          <rect x="22" y="44" width="6" height="6" fill="#ffd700"/>
          <rect x="32" y="44" width="6" height="6" fill="#ffd700"/>
          <rect x="42" y="44" width="6" height="6" fill="#ffd700"/>
          <rect x="52" y="44" width="6" height="6" fill="#ffd700"/>
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
