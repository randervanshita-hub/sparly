import { PageHeader } from '../components/PageHeader'
import { formatINR } from '../../hooks/useCountUp'
import { AnimatedDonut } from '../../components/dashboard/AnimatedDonut'
import { useProfile } from '../context/ProfileContext'

const COLORS: Record<string, string> = { Equity: '#FF7A24', Debt: '#FF9A55', Cash: '#8E8B85' }

export function Investments() {
  const { model } = useProfile()
  const totalValue = model.profile.currentInvestments
  const monthlyContribution = model.moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0
  const allocation = model.investmentAllocation

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Investments"
        title="Your investments, simply"
        subtitle="Sparly is a planning tool, not a licensed investment advisor. This is a modeled overview, not a recommendation to buy or sell."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {[
          { label: 'Current value', value: totalValue },
          { label: 'Recommended monthly contribution', value: monthlyContribution },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-hairline bg-card p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">{stat.label}</p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums text-cream sm:text-xl">₹{formatINR(stat.value)}</p>
          </div>
        ))}
      </div>

      {totalValue > 0 ? (
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-hairline bg-card p-6 sm:p-7 md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex justify-center">
            <AnimatedDonut
              segments={allocation.map((t) => ({ label: t.label, value: t.value, color: COLORS[t.label] }))}
              started
              centerLabel="Allocation"
              centerValue="100%"
            />
          </div>
          <ul className="flex flex-col gap-3">
            {allocation.map((t) => {
              const percent = totalValue > 0 ? Math.round((t.value / totalValue) * 100) : 0
              return (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[t.label] }} />
                  <span className="flex-1 text-sm text-cream/90">{t.label}</span>
                  <span className="text-sm font-semibold text-cream">{percent}%</span>
                  <span className="w-24 shrink-0 text-right text-xs text-muted">₹{formatINR(t.value)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-hairline bg-card p-8 text-center">
          <p className="text-sm text-muted">You told Sparly you don't have any investments yet — once you add a starting amount in Settings, you'll see a modeled allocation here.</p>
        </div>
      )}

      <div className="rounded-2xl border border-hairline bg-white/[0.02] p-5">
        <p className="text-xs leading-relaxed text-muted">
          This allocation (65% equity / 25% debt / 10% cash) is a standard balanced-aggressive model, not your actual
          holdings — Sparly doesn't have access to your real fund or brokerage data yet. This is educational context,
          not personalized investment advice — consider speaking with a licensed advisor for decisions specific to
          your situation.
        </p>
      </div>
    </div>
  )
}
