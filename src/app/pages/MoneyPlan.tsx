import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { AllocationBar } from '../components/ui/AllocationBar'
import { Modal } from '../components/ui/Modal'
import { getMoneyPlan, getMonthlyIncome } from '../../lib/financeEngine'
import { getCategoryExplanation } from '../../lib/aiCoach'
import { formatINR, useCountUp } from '../../hooks/useCountUp'
import { demoExpenses, demoDebts } from '../../lib/demoData'

const CATEGORY_CONTENTS: Record<string, string> = {
  essentials: 'Rent, utilities, EMIs and other fixed costs that happen every month regardless of your choices.',
  savings: 'Money set aside toward your goals — emergency fund, travel, and your other active targets.',
  investments: 'Your SIPs and recurring contributions across equity, debt and cash instruments.',
  lifestyle: 'Everything discretionary — food, shopping, entertainment and the small daily choices.',
  buffer: "Unallocated cash left over after essentials, savings and investments — your flexibility for the month.",
}

export function MoneyPlan() {
  const plan = getMoneyPlan()
  const income = getMonthlyIncome()
  const incomeCount = useCountUp(income, { start: true, duration: 1.2 })
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const active = plan.find((c) => c.key === activeKey)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Monthly money plan"
        title="Where your income is going"
        subtitle="Tap any category to see what's included, how it compares to plan, and what Sparly recommends."
      />

      <div className="rounded-3xl border border-hairline bg-card p-6 sm:p-8">
        <div className="mb-8 flex flex-col items-center gap-1 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Monthly income</p>
          <p className="text-4xl font-semibold tabular-nums text-cream sm:text-5xl">₹{formatINR(incomeCount)}</p>
        </div>

        <div className="flex flex-col gap-7">
          {plan.map((c, i) => (
            <AllocationBar
              key={c.key}
              label={c.label}
              amount={c.amount}
              percent={c.percent}
              color={c.color}
              delay={0.1 + i * 0.12}
              onClick={() => setActiveKey(c.key)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-card p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-muted">Fixed expenses</p>
          <ul className="flex flex-col gap-3">
            {demoExpenses.filter((e) => e.fixed).map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <span className="text-cream/90">{e.label}</span>
                <span className="font-medium tabular-nums text-cream">₹{formatINR(e.amount)}</span>
              </li>
            ))}
            {demoDebts.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-cream/90">{d.label} EMI</span>
                <span className="font-medium tabular-nums text-cream">₹{formatINR(d.emi)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-hairline bg-card p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-muted">Variable expenses</p>
          <ul className="flex flex-col gap-3">
            {demoExpenses.filter((e) => !e.fixed).map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <span className="text-cream/90">{e.label}</span>
                <span className="font-medium tabular-nums text-cream">₹{formatINR(e.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActiveKey(null)} title={active?.label}>
        {active && (
          <div className="flex flex-col gap-5">
            <p className="text-sm leading-relaxed text-muted">{CATEGORY_CONTENTS[active.key]}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-hairline bg-elevated/50 p-4">
                <p className="text-xs text-muted">Recommended</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-cream">₹{formatINR(active.amount)}</p>
              </div>
              <div className="rounded-xl border border-hairline bg-elevated/50 p-4">
                <p className="text-xs text-muted">Current spending</p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-cream">₹{formatINR(active.spent)}</p>
              </div>
            </div>

            <div className="rounded-xl border border-orange/20 bg-orange/[0.06] p-4">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-orange-soft">
                Sparly says
              </p>
              <p className="text-sm leading-relaxed text-cream/90">{getCategoryExplanation(active.key)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
