"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export type Lang = "en" | "zh" | "ms"

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "zh", label: "中文", short: "中" },
  { code: "ms", label: "Bahasa Melayu", short: "MS" },
]

// 用于 API system prompt 的语言名称映射
export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  zh: "Chinese",
  ms: "Malay",
}

type Dict = Record<string, { en: string; zh: string; ms: string }>

// 这里是你的多语言字典（保持原样）
export const dict: Dict = {
  "app.name": { en: "MicroBOT-X", zh: "MicroBOT-X", ms: "MicroBOT-X" },
  // ... 省略其他条目，保持你之前的定义
}

// UI 文案（保持原样）
type UIStrings = {
  widgetTitle: string
  widgetSubtitle: string
  openLabel: string
  closeLabel: string
  inputPlaceholder: string
  send: string
  stop: string
  thinking: string
  emptyTitle: string
  emptyBody: string
  quizAttached: string
  evaluateQuiz: string
  langLabel: string
  errorMessage: string
  billingMessage: string
  suggestions: string[]
}

export const UI: Record<Lang, UIStrings> = {
  en: {
    widgetTitle: "micro:bit Helper",
    widgetSubtitle: "Ask questions & get quiz feedback",
    openLabel: "Open chat assistant",
    closeLabel: "Close chat",
    inputPlaceholder: "Ask me anything about micro:bit...",
    send: "Send",
    stop: "Stop",
    thinking: "Thinking...",
    emptyTitle: "Hi! I'm your micro:bit helper.",
    emptyBody:
      "Ask me about coding, sensors, buttons, or send your quiz results and I'll help you review them.",
    quizAttached: "Quiz results loaded",
    evaluateQuiz: "Evaluate my quiz results",
    langLabel: "Language",
    errorMessage: "Something went wrong. Please try again.",
    billingMessage:
      "The AI service isn't active yet. The site owner needs to add a free Google Gemini API key (GOOGLE_GENERATIVE_AI_API_KEY) to the project. Once that's done, I'll be able to reply.",
    suggestions: ["How do I use the button?", "What is an accelerometer?", "Evaluate my quiz results"],
  },
  zh: {
    widgetTitle: "micro:bit 助手",
    widgetSubtitle: "提问问题 & 获取测验反馈",
    openLabel: "打开聊天助手",
    closeLabel: "关闭聊天",
    inputPlaceholder: "问我任何关于 micro:bit 的问题...",
    send: "发送",
    stop: "停止",
    thinking: "思考中...",
    emptyTitle: "你好！我是你的 micro:bit 助手。",
    emptyBody: "问我关于编程、传感器、按钮的问题，或把你的测验结果发给我，我会帮你评估。",
    quizAttached: "已加载测验结果",
    evaluateQuiz: "评估我的测验结果",
    langLabel: "语言",
    errorMessage: "出错了，请再试一次。",
    billingMessage:
      "AI 服务尚未启用。网站管理员需要在项目中添加一个免费的 Google Gemini API 密钥（GOOGLE_GENERATIVE_AI_API_KEY）。完成后我就能回复你了。",
    suggestions: ["按钮怎么用？", "什么是加速度传感器？", "评估我的测验结果"],
  },
  ms: {
    widgetTitle: "Pembantu micro:bit",
    widgetSubtitle: "Tanya soalan & dapat maklum balas kuiz",
    openLabel: "Buka pembantu sembang",
    closeLabel: "Tutup sembang",
    inputPlaceholder: "Tanya apa sahaja tentang micro:bit...",
    send: "Hantar",
    stop: "Berhenti",
    thinking: "Sedang berfikir...",
    emptyTitle: "Hai! Saya pembantu micro:bit anda.",
    emptyBody:
      "Tanya saya tentang pengekodan, penderia, butang, atau hantar keputusan kuiz anda dan saya akan bantu semak.",
    quizAttached: "Keputusan kuiz dimuatkan",
    evaluateQuiz: "Nilai keputusan kuiz saya",
    langLabel: "Bahasa",
    errorMessage: "Sesuatu tidak kena. Sila cuba lagi.",
    billingMessage:
      "Perkhidmatan AI belum aktif. Pemilik laman perlu menambah kunci API Google Gemini percuma (GOOGLE_GENERATIVE_AI_API_KEY) pada projek. Selepas itu, saya boleh menjawab.",
    suggestions: ["Bagaimana guna butang?", "Apa itu akselerometer?", "Nilai keputusan kuiz saya"],
  },
}

// i18n Context
type I18nContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const stored = window.localStorage.getItem("mbx-lang") as Lang | null
    if (stored && ["en", "zh", "ms"].includes(stored)) setLangState(stored)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    window.localStorage.setItem("mbx-lang", l)
  }, [])

  const t = useCallback(
    (key: string) => {
      const entry = dict[key]
      if (!entry) return key
      return entry[lang] ?? entry.en
    },
    [lang],
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}
