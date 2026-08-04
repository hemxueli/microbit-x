import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { google } from "@ai-sdk/google"
import { LANGUAGE_NAMES, type Lang } from "@/lib/i18n"

export const maxDuration = 30

function buildSystemPrompt(language: Lang) {
  const languageName = LANGUAGE_NAMES[language] ?? LANGUAGE_NAMES.en

  return `You are a friendly, patient tutor embedded in a BBC micro:bit learning website for school students.

CRITICAL LANGUAGE RULE: You MUST write your entire reply in ${languageName}. Do not mix languages unless the student explicitly asks. If the student writes in another language, still answer in ${languageName}.

Your role:
- Help students understand micro:bit topics: MakeCode blocks, MicroPython, buttons (A/B), LEDs, the accelerometer, compass, temperature sensor, radio, pins, and general programming concepts.
- You can also answer general school/learning questions.
- Keep answers short, clear, and age-appropriate. Use simple words and concrete examples.
- Encourage the student. Never just give the final answer to a graded question—guide them to understand it.
- Use short paragraphs or bullet points. Avoid long walls of text.`
}

export async function POST(req: Request) {
  const {
    messages,
    language = "en",
  }: { messages: UIMessage[]; language?: Lang } = await req.json()

  const result = streamText({
    model: google(""use client"
    
    import { useChat } from "@ai-sdk/react"
    import { DefaultChatTransport } from "ai"
    import { useEffect, useMemo, useRef, useState } from "react"
    import { X, Send, Square, Bot } from "lucide-react"
    import { cn } from "@/lib/utils"
    import { UI, LANGS, type Lang } from "@/lib/i18n"
    
    type AiChatWidgetProps = {
      defaultLanguage?: Lang
    }
    
    export function AiChatWidget({ defaultLanguage = "en" }: AiChatWidgetProps) {
      const [open, setOpen] = useState(false)
      const [language, setLanguage] = useState<Lang>(defaultLanguage)
      const [input, setInput] = useState("")
      const [mounted, setMounted] = useState(false)   // ✅ 新增 mounted 检查
    
      useEffect(() => {
        setMounted(true)
      }, [])
    
      const languageRef = useRef(language)
      languageRef.current = language
    
      const transport = useMemo(
        () =>
          new DefaultChatTransport({
            api: "/api/chat",
            body: () => ({
              language: languageRef.current,
            }),
          }),
        []
      )
    
      const { messages, sendMessage, status, stop, error } = useChat({ transport })
    
      const t = UI[language]
      const busy = status === "submitted" || status === "streaming"
    
      const scrollRef = useRef<HTMLDivElement>(null)
      useEffect(() => {
        if (mounted) {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
        }
      }, [messages, busy, mounted])
    
      function submit(text: string) {
        const value = text.trim()
        if (!value || busy) return
        sendMessage({ text: value })
        setInput("")
      }
    
      // ✅ SSR 阶段只渲染一个空壳，避免 hydration mismatch
      if (!mounted) {
        return (
          <button
            type="button"
            aria-label={t.openLabel}
            title="micro:bit helper"
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full 
                      bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-transform hover:scale-105"
          >
            <Bot className="h-6 w-6" />
          </button>
        )
      }
      
      return (
        <>
          {/* Launcher bubble */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.closeLabel : t.openLabel}
            title="micro:bit helper"
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full 
                      bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-transform hover:scale-105"
          >
            {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          </button>
    
          {/* Chat panel */}
          {open && (
            <div
              role="dialog"
              aria-label={t.widgetTitle}
              className="fixed bottom-24 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden h-[32rem] max-h-[calc(100vh-8rem)] rounded-2xl border border-gray-300 bg-white shadow-2xl"
            >
              {/* Header */}
              <header className="flex items-center gap-3 border-b border-gray-200 bg-teal-600 px-4 py-3 text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/30">
                  <Bot className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold leading-tight">
                    {UI[language].widgetTitle}
                  </h2>
                  <p className="truncate text-xs text-teal-100">{UI[language].widgetSubtitle}</p>
                </div>
                <div className="flex shrink-0 items-center">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Lang)}
                    className="px-2 py-1 rounded-md text-xs font-medium bg-white text-teal-600 
                              focus:outline-none focus:ring-2 focus:ring-teal-500 w-auto max-w[6rem]"
                  >
                    {LANGS.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </header>
    
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-start gap-3">
                    <div className="max-w-[85%] rounded-xl bg-gray-100 px-3.5 py-2.5 text-sm text-gray-800">
                      <p className="font-medium">{t.emptyTitle}</p>
                      <p className="mt-1 text-gray-600">{t.emptyBody}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {t.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => submit(s)}
                          className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
    
                {messages.map((message) => {
                  const isUser = message.role === "user"
                  const text = message.parts.map((p) => (p.type === "text" ? p.text : "")).join("")
                  return (
                    <div key={message.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] whitespace-pre-wrap rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                          isUser
                            ? "bg-teal-600 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-800 rounded-tl-sm"
                        )}
                      >
                        {text}
                      </div>
                    </div>
                  )
                })}
    
                {status === "submitted" && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-3">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                    </div>
                  </div>
                )}
    
                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {/NEEDS_KEY|API key|API_KEY|GOOGLE_GENERATIVE_AI/i.test(error.message)
                      ? t.billingMessage
                      : t.errorMessage}
                  </div>
                )}
              </div>
    
              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  submit(input)
                }}
                className="border-t border-gray-200 bg-white p-3"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        !e.nativeEvent.isComposing &&
                        e.keyCode !== 229
                      ) {
                        e.preventDefault()
                        submit(input)
                      }
                    }}
                    rows={1}
                    placeholder={t.inputPlaceholder}
                    className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-teal-500"
                  />
                  {busy ? (
                    <button
                      type="button"
                      onClick={() => stop()}
                      aria-label={t.stop}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      aria-label={t.send}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </>
      )
    }
    "), 
    system: buildSystemPrompt(language),
    messages: await convertToModelMessages(messages),
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error("[v0] chat stream error:", error) // ✅ 打印完整错误
        const message = error instanceof Error ? error.message : String(error)
        if (/API key|API_KEY|GOOGLE_GENERATIVE_AI|permission|credential|unauthenticated|401|403/i.test(message)) {
          return "NEEDS_KEY"
        }
        return message
      },
    }),
  })
}
