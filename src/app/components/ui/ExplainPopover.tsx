import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Modal } from './Modal'

interface ExplainPopoverProps {
  question: string
  explanation: string | (() => string)
  trigger?: string
}

export function ExplainPopover({ question, explanation, trigger = 'Explain' }: ExplainPopoverProps) {
  const [open, setOpen] = useState(false)
  const text = typeof explanation === 'function' ? explanation() : explanation

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-white/20 hover:text-cream"
      >
        <Sparkles size={12} className="text-orange-soft" />
        {trigger}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Ask Sparly">
        <p className="mb-4 text-sm font-medium text-cream/80">{question}</p>
        <div className="rounded-2xl border border-hairline bg-elevated/60 p-4">
          <p className="text-sm leading-relaxed text-cream/90">{text}</p>
        </div>
      </Modal>
    </>
  )
}
