import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, LogOut, Check } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useProfile } from '../context/ProfileContext'
import type { FinancialProfile } from '../../lib/types'

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 focus-within:border-white/25">
        <span className="text-cream/60">₹</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent text-cream focus:outline-none"
        />
      </div>
    </label>
  )
}

type EditableField = Pick<
  FinancialProfile,
  'takeHomeIncome' | 'incomeFrequency' | 'currentSavings' | 'currentInvestments' | 'fixedExpenses' | 'variableExpenses' | 'monthlyDebt' | 'emergencyFund'
>

export function Settings() {
  const { profile, setProfile, resetOnboarding, logout, session } = useProfile()
  const navigate = useNavigate()

  const [form, setForm] = useState<EditableField>({
    takeHomeIncome: profile.takeHomeIncome,
    incomeFrequency: profile.incomeFrequency,
    currentSavings: profile.currentSavings,
    currentInvestments: profile.currentInvestments,
    fixedExpenses: profile.fixedExpenses,
    variableExpenses: profile.variableExpenses,
    monthlyDebt: profile.monthlyDebt,
    emergencyFund: profile.emergencyFund,
  })
  const [saving, setSaving] = useState(false)
  const [savedPulse, setSavedPulse] = useState(false)

  const changed = (Object.keys(form) as (keyof EditableField)[]).some((key) => form[key] !== profile[key])

  const save = async () => {
    setSaving(true)
    await setProfile({ ...profile, ...form })
    setSaving(false)
    setSavedPulse(true)
    window.setTimeout(() => setSavedPulse(false), 2500)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Settings" title="Your financial profile" subtitle="This is what Sparly uses to build your plan and recommendations. Update any number and save." />

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-1 text-sm font-medium text-cream">Signed in as</p>
        <p className="mb-5 text-sm text-muted">{session?.user.email ?? '—'}</p>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={!changed || saving}
            className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {savedPulse && (
            <p className="flex items-center gap-1.5 text-sm text-orange-soft">
              <Check size={14} /> Saved — your plan has been updated
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-1 text-sm font-medium text-cream">Goals &amp; priorities</p>
        <p className="mb-4 text-xs text-muted">
          What you told us during onboarding. To change your goal targets or monthly contributions, edit them directly
          on the Goals page.
        </p>
        <div className="flex flex-wrap gap-2">
          {[...profile.motivations, ...profile.helpPreferences].map((m) => (
            <span key={m} className="rounded-full border border-hairline bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={async () => {
            await resetOnboarding()
            navigate('/app/onboarding')
          }}
          className="rounded-full border border-hairline px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:border-white/25"
        >
          Redo onboarding
        </button>
        <button
          onClick={async () => {
            // See Sidebar's handleLogout for why navigate happens before logout.
            navigate('/')
            await logout()
          }}
          className="flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-white/25 hover:text-cream"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-hairline bg-white/[0.02] p-5">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-orange-soft" />
        <p className="text-xs leading-relaxed text-muted">
          Sparly is a planning and educational tool, not a registered investment advisor or a bank. It does not
          execute trades, transfers, investments or loan payments — every number here is for planning purposes
          only. Your data is encrypted and never sold.
        </p>
      </div>
    </div>
  )
}
