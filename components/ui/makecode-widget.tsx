'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'

export default function MakeCodeWidget() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  const handleConfirm = () => {
    window.open("https://makecode.microbit.org/#editor", "_blank")
    setOpen(false)
  }

  return (
    <>
      {/* 悬浮球按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-full bg-green-500 shadow-lg flex items-center justify-center hover:bg-green-600 transition-transform hover:scale-105"
        title={t('makecode.open')}
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

      {/* 弹窗 */}
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[320px] text-center">
            <h2 className="text-lg font-bold mb-4">{t('makecode.title')}</h2>
            <p className="mb-6">{t('makecode.confirmText')}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {t('makecode.yes')}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                {t('makecode.no')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
