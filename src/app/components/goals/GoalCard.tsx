import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Plane, Laptop, Home, Car, Target, Pencil, Check } from 'lucide-react'
import type { Goal } from '../../../lib/types'
import { getGoalExplanation } from '../../../lib/aiCoach'
import { formatINR } from '../../../hooks/useCountUp'
import { useProfile } from '../../context/ProfileContext'

const ICONS = { shield: Shield, plane: Plane, laptop: Laptop, home: Home, car: Car, target: Target }

export function GoalCard({ goal, delay = 0 }: { goal: Goal; delay?: number }) {
  const { model, updateGoal } = useProfile()
  const [contribution, setContribution] = useState(goal.monthlyContribution)
  const [editing, setEditing] = useState(false)
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount)
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount)
  const [saving, setSaving] = useState(false)
  const [savedPulse, setSavedPulse] = useState(false)

  const Icon = ICONS[goal.icon]
  const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
  const contributionChanged = contribution !== goal.monthlyContribution
  const detailsChanged = targetAmount !== goal.targetAmount || currentAmount !== goal.currentAmount
  const changed = contributionChanged || detailsChanged

  const save = async () => {
    setSaving(true)
    await updateGoal(goal.id, { targetAmount, currentAmount, monthlyContribution: contribution })
    setSaving(false)
    setEditing(false)
    setSavedPulse(true)
    window.setTimeout(() => setSavedPulse(false), 2000)
  }

  const cancelEdit = () => {
    setTargetAmount(goal.targetAmount)
    setCurrentAmount(goal.currentAmount)
    setEditing(false)
  }

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
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted">{percent}% there</span>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            aria-label={editing ? 'Cancel editing goal' : 'Edit goal'}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-hairline text-muted transition-colors hover:text-cream"
          >
            <Pencil size={12} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-cream">{goal.name}</h3>
        {editing ? (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-muted">Current amount</span>
              <input
                type="number"
                min={0}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="rounded-lg border border-hairline bg-white/[0.02] px-2.5 py-1.5 text-sm text-cream focus:outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[11px] text-muted">Target amount</span>
              <input
                type="number"
                min={1}
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="rounded-lg border border-hairline bg-white/[0.02] px-2.5 py-1.5 text-sm text-cream focus:outline-none focus:border-white/25"
              />
            </label>
          </div>
        ) : (
          <p className="mt-1 text-sm text-muted">
            ₹{formatINR(goal.currentAmount)} <span className="text-muted/70">of ₹{formatINR(goal.targetAmount)}</span>
          </p>
        )}
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
          min={500}
          max={Math.max(goal.monthlyContribution * 3, 5000)}
          step={500}
          value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-[#FF7A24]"
        />
      </div>

      <div className="rounded-xl border border-hairline bg-elevated/50 p-3.5">
        <p className="text-xs leading-relaxed text-muted">
          {getGoalExplanation(goal, model.today, contributionChanged ? contribution : undefined)}
        </p>
      </div>

      {changed && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex-1 rounded-full bg-orange px-4 py-2 text-xs font-semibold text-[#140a04] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-full border border-hairline px-4 py-2 text-xs font-medium text-muted hover:text-cream"
            >
              Cancel
            </button>
          )}
        </div>
      )}
      {savedPulse && (
        <p className="flex items-center gap-1.5 text-xs text-orange-soft">
          <Check size={12} /> Saved
        </p>
      )}
    </motion.div>
  )
}
