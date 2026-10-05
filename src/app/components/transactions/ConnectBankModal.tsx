import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Landmark, ShieldCheck, Check, AlertTriangle } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { SANDBOX_BANKS, connectSandboxBank } from '../../../lib/bankSandbox'

interface ConnectBankModalProps {
  open: boolean
  onClose: () => void
  onConnected: (bankName: string, accountMask: string) => Promise<void>
}

type Step = 'select' | 'consent' | 'connecting' | 'done'

export function ConnectBankModal({ open, onClose, onConnected }: ConnectBankModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [bankId, setBankId] = useState<string | null>(null)
  const [result, setResult] = useState<{ bankName: string; accountMask: string } | null>(null)

  const reset = () => {
    setStep('select')
    setBankId(null)
    setResult(null)
  }

  const handleClose = () => {
    onClose()
    window.setTimeout(reset, 300)
  }

  const approve = async () => {
    if (!bankId) return
    setStep('connecting')
    const connection = connectSandboxBank(bankId)
    // Brief pause so the flow reads as "fetching" rather than instant —
    // this is simulated latency, not a real network call.
    await new Promise((resolve) => setTimeout(resolve, 1100))
    await onConnected(connection.bankName, connection.accountMask)
    setResult(connection)
    setStep('done')
  }

  return (
    <Modal open={open} onClose={handleClose} title={step === 'select' ? 'Connect a bank account' : undefined}>
      <div className="flex items-start gap-2.5 rounded-xl border border-orange/20 bg-orange/[0.06] p-3.5 mb-5">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-orange-soft" />
        <p className="text-xs leading-relaxed text-cream/80">
          <strong className="font-semibold">Sandbox mode.</strong> This simulates the Account Aggregator consent
          flow with generated demo data — it is not connected to any real bank. Real bank sync requires Sparly to
          complete a regulated provider onboarding process.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-4 text-sm text-muted">Select a bank to simulate connecting.</p>
            <div className="grid grid-cols-2 gap-2.5">
              {SANDBOX_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => {
                    setBankId(bank.id)
                    setStep('consent')
                  }}
                  className="flex items-center gap-2.5 rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-3 text-left transition-colors hover:border-white/20"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: bank.color }}
                  >
                    {bank.name[0]}
                  </span>
                  <span className="truncate text-sm text-cream/90">{bank.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'consent' && bankId && (
          <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="mb-1 text-sm font-medium text-cream">Review what you're sharing</p>
            <p className="mb-4 text-xs text-muted">
              {SANDBOX_BANKS.find((b) => b.id === bankId)?.name} will share the following with Sparly, read-only:
            </p>
            <ul className="mb-5 flex flex-col gap-2">
              {['Account balance', 'Transaction history (last 45 days)', 'Account holder name'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-cream/90">
                  <ShieldCheck size={14} className="shrink-0 text-orange-soft" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep('select')}
                className="flex-1 rounded-full border border-hairline px-4 py-2.5 text-sm font-medium text-muted hover:text-cream"
              >
                Back
              </button>
              <button
                onClick={approve}
                className="flex-1 rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.02]"
              >
                Approve
              </button>
            </div>
          </motion.div>
        )}

        {step === 'connecting' && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-orange/30 border-t-orange"
            />
            <p className="text-sm text-muted">Fetching account data…</p>
          </motion.div>
        )}

        {step === 'done' && result && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-4 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/15 text-orange-soft">
              <Check size={22} />
            </span>
            <p className="text-sm font-medium text-cream">
              {result.bankName} {result.accountMask} connected
            </p>
            <p className="max-w-xs text-xs text-muted">
              Demo transaction history has been added to your account, tagged as sandbox data.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-[#140a04]"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step === 'select' && (
        <p className="mt-5 flex items-center gap-1.5 text-[11px] text-muted">
          <Landmark size={12} /> Demo only — modeled on the RBI Account Aggregator consent flow.
        </p>
      )}
    </Modal>
  )
}
