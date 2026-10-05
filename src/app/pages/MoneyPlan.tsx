import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { AllocationBar } from '../components/ui/AllocationBar'
import { Modal } from '../components/ui/Modal'
import { getCategoryExplanation } from '../../lib/aiCoach'
import { formatINR, useCountUp } from '../../hooks/useCountUp'
import { useProfile } from '../context/ProfileContext'

export function MoneyPlan() {
  const { model } = useProfile()
  const plan = model.moneyPlan
  const incomeCount = useCountUp(model.profile.takeHomeIncome, { start: true, duration: 1.2 })
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const active = plan.find((c) => c.key === activeKey)

  const recap = [
    { label: 'Fixed expenses', value: model.profile.fixedExpenses },
    { label: 'Monthly EMI / debt', value: model.profile.monthlyDebt },
    { label: 'Current savings', value: model.profile.currentSavings },
    { label: 'Current investments', value: model.profile.currentInvestments },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Monthly money plan"
        title="Where your income is going"
        subtitle="Tap any category to see what's included and what Sparly recommends."
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

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-muted">Your numbers, from onboarding</p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {recap.map((r) => (
            <div key={r.label} className="flex items-center justify-between border-b border-hairline/60 pb-3 text-sm">
              <span className="text-muted">{r.label}</span>
              <span className="font-medium tabular-nums text-cream">₹{formatINR(r.value)}</span>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!active} onClose={() => setActiveKey(null)} title={active?.label}>
        {active && (
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-hairline bg-elevated/50 p-4">
              <p className="text-xs text-muted">Recommended this cycle</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-cream">₹{formatINR(active.amount)}</p>
            </div>

            <div className="rounded-xl border border-orange/20 bg-orange/[0.06] p-4">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-orange-soft">
                Sparly says
              </p>
              <p className="text-sm leading-relaxed text-cream/90">{getCategoryExplanation(model, active.key)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
