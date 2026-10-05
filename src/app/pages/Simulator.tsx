import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/PageHeader'
import { SliderField } from '../components/ui/SliderField'
import { defaultScenario, runScenario } from '../../lib/financeEngine'
import { formatINR } from '../../hooks/useCountUp'
import type { ScenarioInput } from '../../lib/financeEngine'
import { useProfile } from '../context/ProfileContext'

export function Simulator() {
  const { model } = useProfile()
  const baseline = useMemo(() => defaultScenario(model.profile, model.moneyPlan), [model])
  const primaryGoal = model.goals[0]

  const [scenario, setScenario] = useState<ScenarioInput>(baseline)
  const currentResult = useMemo(() => runScenario(baseline, model.profile, primaryGoal, model.today), [baseline, model, primaryGoal])
  const result = useMemo(() => runScenario(scenario, model.profile, primaryGoal, model.today), [scenario, model, primaryGoal])
  const changed = JSON.stringify(scenario) !== JSON.stringify(baseline)

  const update = (key: keyof ScenarioInput) => (value: number) => setScenario((s) => ({ ...s, [key]: value }))

  const monthsDiff = currentResult.goalCompletionMonths - result.goalCompletionMonths

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Money simulator"
        title="Before you decide, see what it does"
        subtitle="Change a variable and watch your emergency fund, savings and goal timeline move."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6 rounded-3xl border border-hairline bg-card p-6">
          <SliderField label="Income" value={scenario.salary} min={Math.round(baseline.salary * 0.5)} max={Math.round(baseline.salary * 2)} step={1000} onChange={update('salary')} />
          <SliderField label="Essentials" value={scenario.essentials} min={0} max={Math.round(Math.max(baseline.essentials * 2, 20000))} step={1000} onChange={update('essentials')} />
          <SliderField label="Investment / SIP" value={scenario.investment} min={0} max={Math.round(Math.max(baseline.investment * 3, 20000))} step={500} onChange={update('investment')} />
          <SliderField label="One-time vacation spend" value={scenario.vacation} min={0} max={60000} step={1000} onChange={update('vacation')} />
          <SliderField label="Loan repayment" value={scenario.loanRepayment} min={0} max={Math.round(Math.max(baseline.loanRepayment * 2, 10000))} step={500} onChange={update('loanRepayment')} />

          {changed && (
            <button
              onClick={() => setScenario(baseline)}
              className="self-start rounded-full border border-hairline px-4 py-2 text-xs font-medium text-muted hover:text-cream"
            >
              Reset to current plan
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ScenarioColumn
              title="Current plan"
              emergencyFund={currentResult.emergencyFund12mo}
              savings={currentResult.savings12mo}
              completionMonths={currentResult.goalCompletionMonths}
              highlight={false}
            />
            <ScenarioColumn
              title="Your scenario"
              emergencyFund={result.emergencyFund12mo}
              savings={result.savings12mo}
              completionMonths={result.goalCompletionMonths}
              highlight={changed}
            />
          </div>

          <motion.div
            key={JSON.stringify(scenario)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-orange/20 bg-orange/[0.06] p-5"
          >
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.08em] text-orange-soft">Sparly says</p>
            <p className="text-sm leading-relaxed text-cream/90">
              {changed
                ? monthsDiff > 0
                  ? `This change reduces your flexible spending but brings your ${primaryGoal ? primaryGoal.name.toLowerCase() : 'emergency fund'} goal forward by approximately ${monthsDiff} month${monthsDiff === 1 ? '' : 's'}.`
                  : monthsDiff < 0
                    ? `This change pushes your ${primaryGoal ? primaryGoal.name.toLowerCase() : 'emergency fund'} goal back by approximately ${Math.abs(monthsDiff)} month${Math.abs(monthsDiff) === 1 ? '' : 's'}.`
                    : "This change doesn't materially shift your goal timeline."
                : 'Move a slider to see how a decision changes your 12-month outlook.'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ScenarioColumn({
  title,
  emergencyFund,
  savings,
  completionMonths,
  highlight,
}: {
  title: string
  emergencyFund: number
  savings: number
  completionMonths: number
  highlight: boolean
}) {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl border p-5 ${highlight ? 'border-orange/30 bg-orange/[0.04]' : 'border-hairline bg-card'}`}>
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{title}</p>
      <div>
        <p className="text-xs text-muted">Emergency fund (12mo)</p>
        <p className="text-xl font-semibold tabular-nums text-cream">₹{formatINR(emergencyFund)}</p>
      </div>
      <div>
        <p className="text-xs text-muted">12-month savings</p>
        <p className="text-xl font-semibold tabular-nums text-cream">₹{formatINR(savings)}</p>
      </div>
      <div>
        <p className="text-xs text-muted">Goal completion</p>
        <p className="text-sm font-medium text-orange-soft">~{completionMonths} months</p>
      </div>
    </div>
  )
}
