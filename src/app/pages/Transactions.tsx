import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Repeat } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ExplainPopover } from '../components/ui/ExplainPopover'
import { getRecentTransactions, getDiningAverage, getSubscriptions } from '../../lib/financeEngine'
import { getDiningInsight } from '../../lib/aiCoach'
import { formatINR } from '../../hooks/useCountUp'
import type { ExpenseCategory } from '../../lib/types'

const CATEGORIES: (ExpenseCategory | 'All')[] = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Subscriptions',
]

export function Transactions() {
  const [filter, setFilter] = useState<ExpenseCategory | 'All'>('All')
  const [subs, setSubs] = useState(getSubscriptions())
  const transactions = getRecentTransactions()
  const dining = getDiningAverage()
  const diningInsight = getDiningInsight()

  const filtered = useMemo(
    () => (filter === 'All' ? transactions : transactions.filter((t) => t.category === filter)),
    [filter, transactions],
  )

  const toggleConfirm = (id: string) => {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, confirmed: !s.confirmed } : s)))
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Transactions" title="Everything you've spent" subtitle="Grouped and explained, not just listed." />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3 rounded-2xl border border-orange/20 bg-orange/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-sm leading-relaxed text-cream/90">
          Your dining spend is{' '}
          <span className="font-semibold text-orange-soft">{dining.percentIncrease}% higher</span> than your 3-month
          average.
        </p>
        <ExplainPopover question="Why is my dining spend higher?" explanation={`${diningInsight.what} ${diningInsight.why} ${diningInsight.action}`} />
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === c ? 'border-orange/40 bg-orange/10 text-orange-soft' : 'border-hairline text-muted hover:text-cream'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-white/[0.02] text-left text-xs uppercase tracking-[0.06em] text-muted">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Merchant</th>
              <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-hairline/60 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3.5 text-muted">
                  {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </td>
                <td className="px-5 py-3.5 font-medium text-cream">{t.merchant}</td>
                <td className="hidden px-5 py-3.5 text-muted sm:table-cell">{t.category}</td>
                <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-cream">₹{formatINR(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-cream">
          <Repeat size={15} className="text-orange-soft" />
          Potential subscriptions detected
        </p>
        <p className="mb-5 text-xs text-muted">Confirm which of these are recurring so Sparly can plan around them.</p>
        <ul className="flex flex-col gap-3">
          {subs.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-cream">{s.label}</p>
                <p className="text-xs text-muted">Last used {s.lastUsed} · ₹{formatINR(s.amount)}/{s.cadence === 'monthly' ? 'mo' : 'yr'}</p>
              </div>
              <button
                onClick={() => toggleConfirm(s.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  s.confirmed ? 'border-orange/40 bg-orange/10 text-orange-soft' : 'border-hairline text-muted hover:text-cream'
                }`}
              >
                {s.confirmed && <Check size={12} />}
                {s.confirmed ? 'Recurring' : 'Confirm'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
