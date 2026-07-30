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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-xl shadow-2xl w-[360px] p-8 text-center animate-fadeIn">
            {/* 标题 */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('makecode.title')}
            </h2>

            {/* 提示文字 */}
            <p className="text-gray-600 mb-6">
              {t('makecode.confirmText')}
            </p>

            {/* 按钮区 */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConfirm}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
              >
                {t('makecode.yes')}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md transition-transform hover:scale-105"
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
