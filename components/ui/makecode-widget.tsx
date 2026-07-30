'use client'

import { useState } from 'react'

interface MakeCodeWidgetProps {
  language: 'en' | 'zh' | 'ms'
}

export default function MakeCodeWidget({ language }: MakeCodeWidgetProps) {
  const [open, setOpen] = useState(false)

  const labels = {
    title: { en: 'MakeCode Editor', zh: 'MakeCode 编辑器', ms: 'Editor MakeCode' },
    confirmText: {
      en: 'Do you want to jump to MakeCode official editor?',
      zh: '要跳转到 MakeCode 官方编辑器吗？',
      ms: 'Adakah anda mahu pergi ke editor rasmi MakeCode?'
    },
    yes: { en: 'Yes', zh: '确定', ms: 'Ya' },
    no: { en: 'Cancel', zh: '取消', ms: 'Batal' }
  }

  const handleConfirm = () => {
    window.open("https://makecode.microbit.org/#editor", "_blank")
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-105"
        title="Open MakeCode"
      >
        {/* micro:bit 图标 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-10 h-10">
          <rect x="10" y="16" width="44" height="28" rx="6" fill="black" />
          <circle cx="30" cy="22" r="2" fill="#FFD700" />
          <circle cx="32.5" cy="22" r="2" fill="#FFD700" />
          <circle cx="16" cy="30" r="2" fill="#cccccc" />
          <circle cx="48" cy="30" r="2" fill="#cccccc" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-lg font-bold mb-4">{labels.title[language]}</h2>
            <p className="mb-6">{labels.confirmText[language]}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {labels.yes[language]}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                {labels.no[language]}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
