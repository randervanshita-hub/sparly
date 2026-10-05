import { motion } from 'framer-motion'
import { getSafeToSpend } from '../../../lib/financeEngine'
import { getSafeToSpendExplanation } from '../../../lib/aiCoach'
import { formatINR, useCountUp } from '../../../hooks/useCountUp'
import { ExplainPopover } from '../ui/ExplainPopover'

export function SafeToSpendCard() {
  const safe = getSafeToSpend()
  const amount = useCountUp(safe.amount, { start: true, duration: 1.3, delay: 0.2 })

  const rows = [
    { label: 'Next salary', value: `${safe.daysToSalary} days` },
    { label: 'Upcoming commitments', value: `₹${formatINR(safe.upcomingCommitments)}` },
    { label: 'Goal contribution', value: `₹${formatINR(safe.goalContribution)}` },
    { label: 'Recommended buffer', value: `₹${formatINR(safe.recommendedBuffer)}` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 rounded-3xl border border-hairline bg-card p-6 sm:p-7"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Safe to spend</p>
        <p className="mt-2 text-4xl font-semibold tabular-nums text-cream">₹{formatINR(amount)}</p>
        <p className="mt-1 text-sm text-muted">until your next salary</p>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-hairline pt-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-muted">{r.label}</span>
            <span className="font-medium text-cream">{r.value}</span>
          </div>
        ))}
      </div>

      <ExplainPopover
        question="Why is my safe-to-spend amount what it is?"
        explanation={getSafeToSpendExplanation}
        trigger="Why this number?"
      />
    </motion.div>
  )
}
