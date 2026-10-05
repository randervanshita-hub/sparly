import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { RevealOnScroll } from './ui/RevealOnScroll'

const FAQS = [
  {
    q: 'How does Sparly decide how much I can spend?',
    a: 'Sparly looks at your income, known recurring costs like rent and EMIs, and the savings and investment goals you set. From that, it works out a realistic daily and monthly spending number — one that still leaves room for saving and a buffer.',
  },
  {
    q: 'Do I need to connect my bank account?',
    a: "No. You can enter your income and expenses manually to get a full plan. Bank or UPI connections, where available, are entirely optional and only make the picture more automatic.",
  },
  {
    q: 'Does Sparly invest money for me?',
    a: 'No. Sparly recommends how much you might consider saving or investing based on your plan, but it does not move money or execute investments on your behalf.',
  },
  {
    q: 'Can I change my plan every month?',
    a: 'Yes. Your plan is meant to move with you — update your income, goals, or priorities any time and Sparly recalculates the breakdown.',
  },
  {
    q: 'What if my income changes?',
    a: 'Update your income whenever it changes — a raise, a bonus, a slower month — and your spend, save, invest and buffer numbers adjust automatically.',
  },
  {
    q: 'Can I include EMIs and recurring expenses?',
    a: 'Yes. EMIs, rent, subscriptions and other recurring costs are treated as essentials in your plan, so your spend and buffer numbers already account for them.',
  },
  {
    q: 'Is Sparly financial advice?',
    a: 'No. Sparly is a planning tool that helps you organize and understand your own money. It is not a registered investment advisor and does not provide personalized financial or investment advice.',
  },
  {
    q: 'How is my financial information protected?',
    a: 'Your data is encrypted in transit and at rest, and is never sold. You stay in control of what you connect and can remove your information at any time.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Questions"
          title={
            <>
              Everything you're <span className="font-serif-italic text-orange-soft">wondering</span> about.
            </>
          }
          className="mb-12"
        />

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const open = openIndex === i
            return (
              <RevealOnScroll key={faq.q} delay={i * 0.04} y={14}>
                <div className="overflow-hidden rounded-2xl border border-hairline bg-card">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span className="text-sm font-medium text-cream sm:text-base">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: open ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-orange-soft"
                    >
                      <Plus size={14} />
                    </motion.span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`px-5 pb-5 text-sm leading-relaxed text-muted transition-opacity duration-300 sm:px-6 ${
                          open ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
