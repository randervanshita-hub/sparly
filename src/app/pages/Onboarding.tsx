import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { useProfile } from '../context/ProfileContext'
import type { FinancialProfile, GoalMotivation, HelpPreference } from '../../lib/types'
import { formatINR } from '../../hooks/useCountUp'

const MOTIVATIONS: GoalMotivation[] = [
  'Build an emergency fund',
  'Buy a car',
  'Travel',
  'Buy a house',
  'Pay off debt',
  'Build wealth',
  'Invest more',
  'Save for a major purchase',
  'Retire early',
]

const HELP_PREFS: HelpPreference[] = [
  'Keep my spending under control',
  'Tell me how much I can safely spend',
  'Help me save more',
  'Help me invest consistently',
  'Help me reach my goals',
  'Give me an overall financial plan',
]

const STEPS = ["Let's understand your money", 'What are you working toward?', 'How should Sparly help?', 'Your plan']

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 focus-within:border-white/25">
        <span className="text-cream/60">₹</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-cream focus:outline-none"
          min={0}
        />
      </div>
    </label>
  )
}

export function Onboarding() {
  const { completeOnboarding } = useProfile()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [custom, setCustom] = useState('')

  const [form, setForm] = useState<FinancialProfile>({
    takeHomeIncome: 80000,
    incomeFrequency: 'monthly',
    currentSavings: 120000,
    currentInvestments: 240000,
    fixedExpenses: 24000,
    variableExpenses: 19000,
    monthlyDebt: 9800,
    emergencyFund: 90000,
    motivations: [],
    helpPreferences: [],
  })

  const toggleMotivation = (m: GoalMotivation) => {
    setForm((f) => ({
      ...f,
      motivations: f.motivations.includes(m) ? f.motivations.filter((x) => x !== m) : [...f.motivations, m],
    }))
  }

  const toggleHelp = (h: HelpPreference) => {
    setForm((f) => ({
      ...f,
      helpPreferences: f.helpPreferences.includes(h) ? f.helpPreferences.filter((x) => x !== h) : [...f.helpPreferences, h],
    }))
  }

  const addCustomGoal = () => {
    if (!custom.trim()) return
    setForm((f) => ({ ...f, motivations: [...f.motivations, custom.trim() as GoalMotivation] }))
    setCustom('')
  }

  const finish = () => {
    completeOnboarding(form)
    navigate('/app/overview')
  }

  const essentials = Math.round(form.takeHomeIncome * 0.45)
  const savings = Math.round(form.takeHomeIncome * 0.2)
  const investments = Math.round(form.takeHomeIncome * 0.15)
  const lifestyle = Math.round(form.takeHomeIncome * 0.12)
  const buffer = form.takeHomeIncome - essentials - savings - investments - lifestyle

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo />
        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i <= step ? 'bg-orange' : 'bg-white/[0.08]'}`} />
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-10 sm:px-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4 }}>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-orange-soft">Step 1 of 4</p>
              <h1 className="mb-8 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">Let's understand your money.</h1>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <NumberField label="Monthly take-home income" value={form.takeHomeIncome} onChange={(v) => setForm((f) => ({ ...f, takeHomeIncome: v }))} />
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-muted">Income frequency</span>
                  <select
                    value={form.incomeFrequency}
                    onChange={(e) => setForm((f) => ({ ...f, incomeFrequency: e.target.value as FinancialProfile['incomeFrequency'] }))}
                    className="rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 text-cream focus:outline-none focus:border-white/25"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </label>
                <NumberField label="Current savings" value={form.currentSavings} onChange={(v) => setForm((f) => ({ ...f, currentSavings: v }))} />
                <NumberField label="Current investments" value={form.currentInvestments} onChange={(v) => setForm((f) => ({ ...f, currentInvestments: v }))} />
                <NumberField label="Monthly fixed expenses" value={form.fixedExpenses} onChange={(v) => setForm((f) => ({ ...f, fixedExpenses: v }))} />
                <NumberField label="Monthly variable expenses" value={form.variableExpenses} onChange={(v) => setForm((f) => ({ ...f, variableExpenses: v }))} />
                <NumberField label="EMIs / monthly debt" value={form.monthlyDebt} onChange={(v) => setForm((f) => ({ ...f, monthlyDebt: v }))} />
                <NumberField label="Emergency fund" value={form.emergencyFund} onChange={(v) => setForm((f) => ({ ...f, emergencyFund: v }))} />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4 }}>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-orange-soft">Step 2 of 4</p>
              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">What are you working toward?</h1>
              <p className="mb-8 text-sm text-muted">Pick as many as apply.</p>

              <div className="flex flex-wrap gap-2.5">
                {MOTIVATIONS.map((m) => (
                  <button
                    key={m}
                    onClick={() => toggleMotivation(m)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                      form.motivations.includes(m) ? 'border-orange/40 bg-orange/10 text-orange-soft' : 'border-hairline text-muted hover:text-cream'
                    }`}
                  >
                    {form.motivations.includes(m) && <Check size={13} className="mr-1.5 inline" />}
                    {m}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2">
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomGoal())}
                  placeholder="Add a custom goal..."
                  className="flex-1 rounded-xl border border-hairline bg-white/[0.02] px-4 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-white/25"
                />
                <button onClick={addCustomGoal} className="rounded-xl border border-hairline px-4 py-2.5 text-sm font-medium text-cream hover:border-white/25">
                  Add
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4 }}>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-orange-soft">Step 3 of 4</p>
              <h1 className="mb-8 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">How do you want Sparly to help you?</h1>

              <div className="flex flex-col gap-2.5">
                {HELP_PREFS.map((h) => (
                  <button
                    key={h}
                    onClick={() => toggleHelp(h)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                      form.helpPreferences.includes(h) ? 'border-orange/40 bg-orange/10 text-orange-soft' : 'border-hairline text-cream/90 hover:bg-white/[0.02]'
                    }`}
                  >
                    {h}
                    {form.helpPreferences.includes(h) && <Check size={15} />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-orange-soft">
                <Sparkles size={12} />
                Your Sparly Money Plan
              </p>
              <h1 className="mb-8 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                Here's where your ₹{formatINR(form.takeHomeIncome)} should go.
              </h1>

              <div className="flex flex-col gap-4 rounded-3xl border border-hairline bg-card p-6">
                {[
                  { label: 'Essentials', value: essentials, color: '#8E8B85' },
                  { label: 'Savings', value: savings, color: '#F3EEE7' },
                  { label: 'Investments', value: investments, color: '#FF9A55' },
                  { label: 'Lifestyle', value: lifestyle, color: '#FF7A24' },
                  { label: 'Buffer', value: buffer, color: 'rgba(255,122,36,0.45)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2.5 text-cream/90">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </span>
                    <span className="font-semibold tabular-nums text-cream">₹{formatINR(item.value)}</span>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted">
                This is a starting point based on what you told us — every number adjusts as Sparly learns more about
                your spending.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-6 py-6 sm:px-8">
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2.5 text-sm font-medium text-muted transition-opacity disabled:opacity-0"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.03]"
          >
            Continue <ArrowRight size={15} />
          </button>
        ) : (
          <button
            onClick={finish}
            className="flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.03]"
          >
            Go to my dashboard <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
