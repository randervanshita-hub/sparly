import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiggyBank, ShoppingBag, LineChart, ShieldCheck, Sparkles } from 'lucide-react'
import { AnimatedDonut } from './AnimatedDonut'
import { AllocationCard } from './AllocationCard'
import { UPCOMING_TRANSACTIONS } from './transactions'
import { formatINR, useCountUp } from '../../hooks/useCountUp'

const INCOME = 80000

const ALLOCATIONS = [
  { label: 'Spend', value: 32000, percent: 40, icon: ShoppingBag, accent: '#FF7A24' },
  { label: 'Save', value: 16000, percent: 20, icon: PiggyBank, accent: '#F3EEE7' },
  { label: 'Invest', value: 12000, percent: 15, icon: LineChart, accent: '#FF9A55' },
  { label: 'Buffer', value: 20000, percent: 25, icon: ShieldCheck, accent: '#8E8B85' },
]

export function MoneyDashboard() {
  const [started, setStarted] = useState(false)
  const income = useCountUp(INCOME, { start: started, duration: 1.2 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={() => setStarted(true)}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-5xl rounded-[28px] border border-hairline bg-card/90 p-4 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-6 md:p-8"
    >
      <div className="bg-grain pointer-events-none absolute inset-0 rounded-[28px] opacity-40" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-muted">
              <Sparkles size={13} className="text-orange-soft" />
              Your money plan — this month
            </p>
            <p className="mt-2 text-sm text-muted">Monthly income</p>
            <p className="text-3xl font-semibold tabular-nums text-cream sm:text-4xl">₹{formatINR(income)}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-hairline bg-white/[0.04] px-4 py-2 text-xs sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
            <span className="text-muted">Safe to spend today</span>
            <span className="font-semibold text-cream">₹1,060</span>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-hairline bg-elevated/50 p-5 sm:p-6 md:grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <AnimatedDonut
              segments={ALLOCATIONS.map((a) => ({ label: a.label, value: a.value, color: a.accent }))}
              started={started}
              centerLabel="Planned"
              centerValue="100%"
            />
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4">
            {ALLOCATIONS.map((a) => (
              <li key={a.label} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: a.accent }} />
                <span className="text-sm text-muted">
                  {a.label} <span className="text-cream">{a.percent}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {ALLOCATIONS.map((a, i) => (
            <AllocationCard
              key={a.label}
              label={a.label}
              value={a.value}
              percent={a.percent}
              icon={a.icon}
              accent={a.accent}
              started={started}
              delay={0.3 + i * 0.15}
            />
          ))}
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-muted">Upcoming this month</p>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {UPCOMING_TRANSACTIONS.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 12 }}
                animate={started ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-[180px] shrink-0 items-center gap-3 rounded-xl border border-hairline bg-white/[0.03] p-3 sm:min-w-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-muted">
                  <t.icon size={14} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{t.label}</p>
                  <p className="truncate text-xs text-muted">{t.meta}</p>
                </div>
                <p className="ml-auto shrink-0 text-sm font-semibold tabular-nums text-cream">
                  ₹{formatINR(t.amount)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
