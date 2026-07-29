'use client'

import { AiChatWidget } from '@/components/ui/ai-chat-widget'
import MakeCodeWidget from '@/components/ui/makecode-widget'

export default function BasicEnPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header className="bg-teal-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-lg font-bold">Basic Micro:bit Learning</h1>
        <p className="text-sm">English Version</p>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 p-6">
        {/* Canva Slide 学习内容 */}
        <iframe
          src="https://addjkahub.my.canva.site/makecode-micro-bit-basics-preview"
          className="w-full h-[600px] rounded-lg shadow-md"
          allow="fullscreen"
        />
      </main>

      {/* 悬浮球容器：右下角堆叠 */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-20 z-50">
        {/* 上面：MakeCode 悬浮球 */}
        <MakeCodeWidget />

        {/* 下面：AI 聊天悬浮球 */}
        <AiChatWidget defaultLanguage="en" />
      </div>
    </div>
  )
}
