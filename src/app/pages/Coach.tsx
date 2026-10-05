import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Sparkles } from 'lucide-react'
import { ChatBubble, TypingIndicator } from '../components/coach/ChatBubble'
import { answerCoachPrompt } from '../../lib/aiCoach'
import type { ChatMessage } from '../../lib/types'
import { useProfile } from '../context/ProfileContext'

const SUGGESTED_PROMPTS = [
  'Can I afford a ₹15,000 vacation?',
  'Why did I spend more this month?',
  'How much should I save from my next salary?',
  'Should I increase my SIP?',
  'Can I afford to buy a new phone?',
  'Why is my safe-to-spend amount lower this month?',
  'How long will it take me to reach my emergency fund goal?',
  'What happens if my salary increases by 10%?',
  'Should I pay off my loan faster or invest more?',
]

export function Coach() {
  const { displayName, model } = useProfile()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${displayName} — I can see your income, spending and goals. Ask me anything about your money, or pick a question below.`,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const navigate = useNavigate()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    if (trimmed === 'Open simulator') {
      navigate('/app/simulator')
      return
    }

    const userMessage: ChatMessage = { id: `u_${Date.now()}`, role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setTyping(true)

    window.setTimeout(() => {
      const response = answerCoachPrompt(model, trimmed)
      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant', content: response.content, quickReplies: response.quickReplies },
      ])
      setTyping(false)
    }, 850)
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col lg:h-[calc(100vh-6rem)]">
      <div className="mb-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.1em] text-muted">Ask Sparly</p>
        <h1 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
          Your money is complicated. <span className="font-serif-italic text-orange-soft">Your next decision</span>{' '}
          doesn't have to be.
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto rounded-3xl border border-hairline bg-card/40 p-5">
        <div className="flex flex-col gap-5">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} onQuickReply={send} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={endRef} />
        </div>
      </div>

      {messages.length <= 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="flex items-center gap-1.5 rounded-full border border-hairline bg-white/[0.02] px-3.5 py-2 text-xs font-medium text-muted transition-colors hover:border-white/20 hover:text-cream"
            >
              <Sparkles size={11} className="text-orange-soft" />
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="mt-4 flex items-center gap-3 rounded-full border border-hairline bg-card px-2 py-2 pl-5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder="Ask about your spending, goals, or safe-to-spend amount..."
          className="flex-1 bg-transparent text-sm text-cream placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange text-[#140a04] transition-transform hover:scale-105"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}
