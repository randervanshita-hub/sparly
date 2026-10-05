import { motion } from 'framer-motion'
import { PageHeader } from '../components/PageHeader'
import { demoInvestments, demoGoals } from '../../lib/demoData'
import { formatINR } from '../../hooks/useCountUp'
import { AnimatedDonut } from '../../components/dashboard/AnimatedDonut'

export function Investments() {
  const totalInvested = demoInvestments.reduce((s, i) => s + i.invested, 0)
  const totalValue = demoInvestments.reduce((s, i) => s + i.currentValue, 0)
  const monthlyContribution = demoInvestments.reduce((s, i) => s + i.monthlyContribution, 0)
  const gain = totalValue - totalInvested
  const gainPercent = Math.round((gain / totalInvested) * 100)

  const byType = ['Equity', 'Debt', 'Cash'].map((type) => ({
    label: type,
    value: demoInvestments.filter((i) => i.type === type).reduce((s, i) => s + i.currentValue, 0),
  }))
  const colors: Record<string, string> = { Equity: '#FF7A24', Debt: '#FF9A55', Cash: '#8E8B85' }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Investments"
        title="Your investments, simply"
        subtitle="Sparly is a planning tool, not a licensed investment advisor. This is an overview, not a recommendation to buy or sell."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total invested', value: totalInvested },
          { label: 'Current value', value: totalValue },
          { label: 'Monthly contribution', value: monthlyContribution },
          { label: 'Gain', value: gain, sub: `${gainPercent}%` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-hairline bg-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">{stat.label}</p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums text-cream sm:text-xl">₹{formatINR(stat.value)}</p>
            {stat.sub && <p className="text-xs text-orange-soft">+{stat.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 rounded-3xl border border-hairline bg-card p-6 sm:p-7 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex justify-center">
          <AnimatedDonut
            segments={byType.map((t) => ({ label: t.label, value: t.value, color: colors[t.label] }))}
            started
            centerLabel="Allocation"
            centerValue="100%"
          />
        </div>
        <ul className="flex flex-col gap-3">
          {byType.map((t) => {
            const percent = Math.round((t.value / totalValue) * 100)
            return (
              <li key={t.label} className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: colors[t.label] }} />
                <span className="flex-1 text-sm text-cream/90">{t.label}</span>
                <span className="text-sm font-semibold text-cream">{percent}%</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-muted">Holdings</p>
        <ul className="flex flex-col gap-3">
          {demoInvestments.map((inv, i) => {
            const linkedGoal = demoGoals.find((g) => g.id === inv.goalId)
            return (
              <motion.li
                key={inv.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{inv.label}</p>
                  <p className="text-xs text-muted">
                    {inv.type} · ₹{formatINR(inv.monthlyContribution)}/mo{linkedGoal ? ` · linked to ${linkedGoal.name}` : ''}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-cream">₹{formatINR(inv.currentValue)}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-hairline bg-white/[0.02] p-5">
        <p className="text-xs leading-relaxed text-muted">
          Your long-term goals currently carry a higher equity allocation than your short-term goals, which is
          generally consistent with their timelines. This is educational context, not personalized investment
          advice — consider speaking with a licensed advisor for decisions specific to your situation.
        </p>
      </div>
    </div>
  )
}
