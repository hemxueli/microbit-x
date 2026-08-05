'use client'

import { useState, useEffect } from 'react'
import { Languages } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANGS, useI18n } from '@/lib/i18n'

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const current = LANGS.find((l) => l.code === lang)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ SSR 阶段不渲染，避免 hydration mismatch
  if (!mounted) return null

  return (
    <DropdownMenu>
      {/* ✅ 直接用 DropdownMenuTrigger 渲染按钮样式，避免嵌套 */}
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Languages className="size-4" />
        <span className="hidden sm:inline">{current?.label}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={l.code === lang ? 'font-semibold text-primary' : ''}
          >
            {l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
