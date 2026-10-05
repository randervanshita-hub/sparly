import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { useProfile } from '../context/ProfileContext'

export function Auth() {
  const { signUp, signIn, authError } = useProfile()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setNotice(null)

    const ok = mode === 'signup' ? await signUp(email, password) : await signIn(email, password)

    setSubmitting(false)
    if (ok) {
      if (mode === 'signup') {
        navigate('/app/onboarding')
      } else {
        navigate('/app')
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-5 py-16">
      <div
        className="pointer-events-none fixed left-1/2 top-1/4 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.3), transparent 70%)' }}
      />

      <div className="mb-8">
        <Logo />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-3xl border border-hairline bg-card p-7 sm:p-8"
      >
        <h1 className="text-xl font-semibold text-cream">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {mode === 'signup' ? 'Start your first Sparly money plan.' : 'Sign in to pick up where you left off.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Email</span>
            <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 focus-within:border-white/25">
              <Mail size={15} className="shrink-0 text-muted" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-cream placeholder:text-muted focus:outline-none"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Password</span>
            <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3 focus-within:border-white/25">
              <Lock size={15} className="shrink-0 text-muted" />
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-transparent text-sm text-cream placeholder:text-muted focus:outline-none"
              />
            </div>
          </label>

          {authError && <p className="text-xs text-orange-soft">{authError}</p>}
          {notice && <p className="text-xs text-muted">{notice}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            {!submitting && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signup' ? 'signin' : 'signup')
              setNotice(null)
            }}
            className="font-medium text-cream underline-offset-2 hover:underline"
          >
            {mode === 'signup' ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
