'use client'

import { useState } from 'react'

export default function MakeCodeWidget() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')

  const handleSave = async () => {
    // 假设我们能拿到代码 JSON（这里用示例代替）
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
      <button
        onClick={() => {
          setMode('preview')
          setOpen(true)
        }}
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

      {open && (
        <div className="fixed inset-0 z-[9999] bg-white">
          <div className="flex justify-between items-center bg-green-600 text-white px-4 py-2">
            <span className="font-semibold">MakeCode {mode === 'preview' ? '预览' : '编辑'}</span>
            <div className="flex gap-2">
              <button onClick={() => setMode('preview')} className="bg-white text-green-600 px-3 py-1 rounded">预览</button>
              <button onClick={() => setMode('edit')} className="bg-white text-green-600 px-3 py-1 rounded">编辑</button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">保存</button>
              <button onClick={() => setOpen(false)} className="bg-red-500 text-white px-3 py-1 rounded">✕</button>
            </div>
          </div>

          <iframe
            src={mode === 'preview'
              ? 'https://makecode.microbit.org/---run'
              : 'https://makecode.microbit.org/#editor'}
            className="w-full h-[calc(100%-48px)]"
          />
        </div>
      )}
    </>
  )
}
