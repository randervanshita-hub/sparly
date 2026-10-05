import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Plane, Laptop, Home, Car, Target } from 'lucide-react'
import type { Goal } from '../../../lib/types'
import { getGoalExplanation } from '../../../lib/aiCoach'
import { formatINR } from '../../../hooks/useCountUp'

const ICONS = { shield: Shield, plane: Plane, laptop: Laptop, home: Home, car: Car, target: Target }

export function GoalCard({ goal, delay = 0 }: { goal: Goal; delay?: number }) {
  const [contribution, setContribution] = useState(goal.monthlyContribution)
  const Icon = ICONS[goal.icon]
  const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
  const changed = contribution !== goal.monthlyContribution

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5 rounded-3xl border border-hairline bg-card p-6"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-elevated text-orange-soft">
          <Icon size={19} />
        </span>
        <span className="text-xs font-medium text-muted">{percent}% there</span>
      </div>

      <div>
        <h3 className="text-base font-semibold text-cream">{goal.name}</h3>
        <p className="mt-1 text-sm text-muted">
          ₹{formatINR(goal.currentAmount)} <span className="text-muted/70">of ₹{formatINR(goal.targetAmount)}</span>
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-orange"
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`contrib-${goal.id}`} className="flex items-center justify-between text-xs text-muted">
          <span>Monthly contribution</span>
          <span className="font-medium text-cream">₹{formatINR(contribution)}</span>
        </label>
        <input
          id={`contrib-${goal.id}`}
          type="range"
          min={1000}
          max={goal.monthlyContribution * 3}
          step={500}
          value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-[#FF7A24]"
        />
      </div>

      <div className="rounded-xl border border-hairline bg-elevated/50 p-3.5">
        <p className="text-xs leading-relaxed text-muted">{getGoalExplanation(goal.id, changed ? contribution : undefined)}</p>
      </div>
    </motion.div>
  )
}
