import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from './ui/SectionHeading'
import { formatINR, useCountUp } from '../hooks/useCountUp'

const ALLOCATION = [
  { label: 'Essentials', value: 45000, percent: 45, color: '#8E8B85' },
  { label: 'Savings', value: 20000, percent: 20, color: '#F3EEE7' },
  { label: 'Investments', value: 15000, percent: 15, color: '#FF9A55' },
  { label: 'Lifestyle', value: 12000, percent: 12, color: '#FF7A24' },
  { label: 'Buffer', value: 8000, percent: 8, color: 'rgba(255,122,36,0.45)' },
]

const TOTAL = 100000

function Row({ item, started, delay }: { item: (typeof ALLOCATION)[number]; started: boolean; delay: number }) {
  const count = useCountUp(item.value, { start: started, delay, duration: 1 })

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <span className="flex items-center gap-2.5 text-sm font-medium text-cream sm:text-base">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
        <span className="text-sm font-semibold tabular-nums text-cream sm:text-base">₹{formatINR(count)}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: item.color }}
          initial={{ width: '0%' }}
          animate={started ? { width: `${item.percent}%` } : {}}
          transition={{ duration: 1.1, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export function SalaryAllocation() {
  const [started, setStarted] = useState(false)
  const total = useCountUp(TOTAL, { start: started, duration: 1.3 })

  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-50 blur-[130px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.25), transparent 70%)' }}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The signature Sparly breakdown"
          title={
            <>
              What should happen to your next{' '}
              <span className="font-serif-italic text-orange-soft">₹1,00,000?</span>
            </>
          }
          subtitle="Every plan starts with a simple breakdown. Here's a realistic example of how Sparly splits a fresh ₹1,00,000 across what matters."
          className="mb-14"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          onViewportEnter={() => setStarted(true)}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[28px] border border-hairline bg-card p-6 sm:p-10"
        >
          <div className="mb-9 flex flex-col items-center gap-1 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Total this cycle</p>
            <p className="text-4xl font-semibold tabular-nums text-cream sm:text-5xl">₹{formatINR(total)}</p>
          </div>

          <div className="flex flex-col gap-7">
            {ALLOCATION.map((item, i) => (
              <Row key={item.label} item={item} started={started} delay={0.3 + i * 0.15} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
