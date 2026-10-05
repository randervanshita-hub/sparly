import { useNavigate } from 'react-router-dom'
import { ShieldCheck, LogOut } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useProfile } from '../context/ProfileContext'
import { formatINR } from '../../hooks/useCountUp'

export function Settings() {
  const { profile, resetOnboarding, logout, session } = useProfile()
  const navigate = useNavigate()

  const fields = [
    { label: 'Email', value: session?.user.email ?? '—' },
    { label: 'Monthly take-home income', value: `₹${formatINR(profile.takeHomeIncome)}` },
    { label: 'Income frequency', value: profile.incomeFrequency },
    { label: 'Current savings', value: `₹${formatINR(profile.currentSavings)}` },
    { label: 'Current investments', value: `₹${formatINR(profile.currentInvestments)}` },
    { label: 'Fixed expenses', value: `₹${formatINR(profile.fixedExpenses)}` },
    { label: 'Variable expenses', value: `₹${formatINR(profile.variableExpenses)}` },
    { label: 'Monthly EMI / debt', value: `₹${formatINR(profile.monthlyDebt)}` },
    { label: 'Emergency fund', value: `₹${formatINR(profile.emergencyFund)}` },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Settings" title="Your financial profile" subtitle="This is what Sparly uses to build your plan and recommendations." />

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="flex items-center justify-between border-b border-hairline/60 pb-3 text-sm">
              <span className="text-muted">{f.label}</span>
              <span className="font-medium capitalize text-cream">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-1 text-sm font-medium text-cream">Goals &amp; priorities</p>
        <p className="mb-4 text-xs text-muted">What you told us during onboarding.</p>
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
