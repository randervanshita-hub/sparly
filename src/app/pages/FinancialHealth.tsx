import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/PageHeader'
import { Modal } from '../components/ui/Modal'
import { getHealthComponentExplanation } from '../../lib/aiCoach'
import { useProfile } from '../context/ProfileContext'

export function FinancialHealth() {
  const { model } = useProfile()
  const health = model.health
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const active = health.components.find((c) => c.key === activeKey)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Financial health"
        title="Your Sparly Financial Health"
        subtitle="A planning metric built from five components — not a credit score, and not an objective truth. Tap any component to see what moves it."
      />

      <div className="flex flex-col items-center gap-2 rounded-3xl border border-hairline bg-gradient-to-br from-card to-elevated p-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Sparly financial health</p>
        <p className="text-6xl font-semibold tabular-nums text-cream">
          {health.score}
          <span className="text-2xl text-muted">/100</span>
        </p>
        <p className="text-base font-medium text-orange-soft">{health.label}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {health.components.map((c, i) => (
          <motion.button
            key={c.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onClick={() => setActiveKey(c.key)}
            className="flex flex-col gap-3 rounded-2xl border border-hairline bg-card p-5 text-left transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-cream">{c.label}</p>
              <p className="text-lg font-semibold tabular-nums text-orange-soft">{c.score}</p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-orange"
                initial={{ width: 0 }}
                whileInView={{ width: `${c.score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + i * 0.08 }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActiveKey(null)} title={active?.label}>
        {active && <p className="text-sm leading-relaxed text-cream/90">{getHealthComponentExplanation(model, active.key)}</p>}
      </Modal>
    </div>
  )
}
