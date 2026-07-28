"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { MessageCircle, X, Send, Square, Bot, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { UI, LANGS, type Lang } from "@/lib/i18n"
import type { QuizData } from "@/lib/quiz"

type AiChatWidgetProps = {
  quizData?: QuizData
  defaultLanguage?: Lang
}

export function AiChatWidget({ quizData, defaultLanguage = "en" }: AiChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState<Lang>(defaultLanguage)
  const [input, setInput] = useState("")

  const languageRef = useRef(language)
  const quizRef = useRef(quizData)
  languageRef.current = language
  quizRef.current = quizData

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          language: languageRef.current,
          quizData: quizRef.current,
        }),
      }),
    [],
  )

  const { messages, sendMessage, status, stop, error } = useChat({ transport })

  const t = UI[language]
  const busy = status === "submitted" || status === "streaming"

  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, busy])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <>
      {/* Launcher bubble */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.closeLabel : t.openLabel}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t.widgetTitle}
          className="fixed bottom-24 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden h-[32rem] max-h-[calc(100vh-8rem)] rounded-2xl border border-gray-300 bg-white shadow-2xl"
        >
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-gray-200 bg-blue-600 px-4 py-3 text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/30">
              <Bot className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold leading-tight">{t.widgetTitle}</h2>
              <p className="truncate text-xs text-blue-100">{t.widgetSubtitle}</p>
            </div>
            {/* Language switch */}
            <div role="group" aria-label={t.langLabel} className="flex shrink-0 items-center gap-1">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  aria-pressed={language === l.code}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium",
                    language === l.code
                      ? "bg-white text-blue-600"
                      : "bg-blue-500/30 text-white hover:bg-blue-500/50"
                  )}
                >
                  {l.short}
                </button>
              ))}
            </div>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {quizData && quizData.questions.length > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                <ClipboardCheck className="h-4 w-4 shrink-0 text-blue-600" />
                <span className="font-medium">{t.quizAttached}</span>
                {typeof quizData.score === "number" && (
                  <span className="ml-auto tabular-nums">
                    {quizData.score}/{quizData.total ?? quizData.questions.length}
                  </span>
                )}
              </div>
            )}

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
                      className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700"
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
                        ? "bg-blue-600 text-white rounded-tr-sm"
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
                className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500"
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
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
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
