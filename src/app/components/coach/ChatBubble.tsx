import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { ChatMessage } from '../../../lib/types'

export function ChatBubble({ message, onQuickReply }: { message: ChatMessage; onQuickReply?: (text: string) => void }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <div className={`flex max-w-[85%] items-start gap-2.5 sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange-soft text-[#140a04]">
            <Sparkles size={12} />
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser ? 'bg-orange text-[#140a04]' : 'border border-hairline bg-card text-cream/90'
          }`}
        >
          {message.content}
        </div>
      </div>
      {message.quickReplies && (
        <div className="ml-9 flex flex-wrap gap-2">
          {message.quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => onQuickReply?.(q)}
              className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-white/25 hover:text-cream"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange-soft text-[#140a04]">
        <Sparkles size={12} />
      </span>
      <div className="flex items-center gap-1 rounded-2xl border border-hairline bg-card px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-muted"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}
