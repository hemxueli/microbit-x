'use client'

import { useState } from 'react'

export default function MakeCodeWidget() {
  const [open, setOpen] = useState(false)

  const handleSave = async () => {
    // 示例：这里你可以通过 postMessage 或 API 获取代码 JSON
    const codeData = { source: "example code json" }

    const res = await fetch('/api/save-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codeData),
    })

    if (res.ok) {
      alert('代码已保存到数据库！')
    } else {
      alert('保存失败')
    }
  }

  return (
    <>
      {/* 悬浮球按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-105"
        title="Open MakeCode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-10 h-10">
          <rect x="10" y="16" width="44" height="28" rx="6" fill="black" />
          <circle cx="30" cy="22" r="2" fill="#FFD700" />
          <circle cx="32.5" cy="22" r="2" fill="#FFD700" />
          <circle cx="16" cy="30" r="2" fill="#cccccc" />
          <circle cx="48" cy="30" r="2" fill="#cccccc" />
        </svg>
      </button>

      {/* 全屏 MakeCode 弹窗 */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-white">
          {/* 顶部工具栏 */}
          <div className="flex justify-between items-center bg-green-600 text-white px-4 py-2">
            <span className="font-semibold">MakeCode 编辑器</span>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                保存
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          </div>

          {/* iframe 永远是编辑模式 */}
          <iframe
            src="https://makecode.microbit.org/#editor"
            className="w-full h-[calc(100%-48px)]"
          />
        </div>
      )}
    </>
  )
}
