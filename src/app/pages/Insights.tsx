import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, TrendingUp, Circle, AlertTriangle } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { getInsights, getPlanRecap } from '../../lib/aiCoach'
import type { Insight } from '../../lib/types'
import { useProfile } from '../context/ProfileContext'

const SEVERITY_STYLES: Record<Insight['severity'], { icon: typeof TrendingUp; color: string }> = {
  positive: { icon: TrendingUp, color: '#FF9A55' },
  neutral: { icon: Circle, color: '#8E8B85' },
  watch: { icon: AlertTriangle, color: '#FF7A24' },
}

export function Insights() {
  const { model } = useProfile()
  const insights = getInsights(model)
  const recap = getPlanRecap(model)
  const [applied, setApplied] = useState<string[]>([])

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Insights" title="What your money is telling you" subtitle="Patterns Sparly noticed automatically — what happened, why it matters, what to do." />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-hairline bg-gradient-to-br from-card to-elevated p-6 sm:p-7"
      >
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-orange-soft">Your plan at a glance</p>
        <p className="mb-5 text-sm leading-relaxed text-cream/90 sm:text-base">{recap.headline}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Good</p>
            <ul className="flex flex-col gap-1.5">
              {recap.good.map((g) => (
                <li key={g} className="flex items-center gap-1.5 text-sm text-cream/90">
                  <Check size={13} className="shrink-0 text-orange-soft" /> {g}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Watch</p>
            <ul className="flex flex-col gap-1.5">
              {recap.watch.length === 0 && <li className="text-sm text-muted">Nothing to flag right now.</li>}
              {recap.watch.map((w) => (
                <li key={w} className="flex items-center gap-1.5 text-sm text-cream/90">
                  <AlertTriangle size={13} className="shrink-0 text-orange-soft" /> {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Next</p>
            <p className="text-sm text-cream/90">{recap.next}</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {insights.map((insight, i) => {
          const style = SEVERITY_STYLES[insight.severity]
          const isApplied = applied.includes(insight.id)
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex flex-col gap-4 rounded-2xl border border-hairline bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${style.color}1f`, color: style.color }}>
                  <style.icon size={15} />
                </span>
                <h3 className="text-base font-semibold text-cream">{insight.title}</h3>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">What happened</p>
                  <p className="text-sm text-cream/90">{insight.what}</p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">Why it matters</p>
                  <p className="text-sm text-cream/90">{insight.why}</p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.06em] text-muted">What to do</p>
                  <p className="text-sm text-cream/90">{insight.action}</p>
                </div>
              </div>

              <button
                onClick={() => setApplied((prev) => [...prev, insight.id])}
                disabled={isApplied}
                className={`self-start rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  isApplied ? 'border-orange/30 bg-orange/10 text-orange-soft' : 'border-hairline text-muted hover:text-cream'
                }`}
              >
                {isApplied ? 'Applied' : 'Apply suggestion'}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
