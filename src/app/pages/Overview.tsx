import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AIRecommendationCard } from '../components/dashboard/AIRecommendationCard'
import { SafeToSpendCard } from '../components/dashboard/SafeToSpendCard'
import { MiniCalendar } from '../components/dashboard/MiniCalendar'
import { AllocationBar } from '../components/ui/AllocationBar'
import { getFinancialHealth, getMoneyPlan } from '../../lib/financeEngine'
import { getPersonalizedOpportunity } from '../../lib/aiCoach'

export function Overview() {
  const plan = getMoneyPlan()
  const health = getFinancialHealth()
  const opportunity = getPersonalizedOpportunity()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">{greeting}, Vanshita.</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Here's what your money needs from you this month. {opportunity}
        </p>
      </motion.div>

      <AIRecommendationCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SafeToSpendCard />

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-hairline bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">This month's plan</p>
              <Link to="/app/plan" className="flex items-center gap-1 text-xs font-medium text-orange-soft hover:underline">
                View full plan <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex flex-col gap-5">
              {plan.map((c, i) => (
                <AllocationBar key={c.key} label={c.label} amount={c.amount} percent={c.percent} color={c.color} delay={0.2 + i * 0.1} />
              ))}
            </div>
          </div>

          <Link
            to="/app/health"
            className="flex items-center justify-between rounded-3xl border border-hairline bg-card p-6 transition-colors hover:bg-white/[0.02]"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Financial health</p>
              <p className="mt-2 text-2xl font-semibold text-cream">
                {health.score}<span className="text-base text-muted">/100</span>
              </p>
              <p className="text-sm text-orange-soft">{health.label}</p>
            </div>
            <ArrowRight size={18} className="text-muted" />
          </Link>
        </div>
      </div>

      <MiniCalendar />
    </div>
  )
}
