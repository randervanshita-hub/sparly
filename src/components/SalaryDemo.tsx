import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from './ui/SectionHeading'
import { Button } from './ui/Button'
import { SliderField } from '../app/components/ui/SliderField'
import { formatINR } from '../hooks/useCountUp'

const VISITOR_ID_KEY = 'sparly_demo_visitor_id'

function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return 'anonymous'
  }
}

interface PlanResult {
  plan: string
  plansGenerated: number
  avgSaving: number
  remainingRequests: number
}

export function SalaryDemo() {
  const [takeHome, setTakeHome] = useState(60000)
  const [rent, setRent] = useState(18000)
  const [food, setFood] = useState(8000)
  const [transport, setTransport] = useState(4000)
  const [shopping, setShopping] = useState(6000)
  const [other, setOther] = useState(3000)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/salary-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: getVisitorId(),
          takeHome,
          rent,
          food,
          transport,
          shopping,
          other,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Something went wrong generating your plan. Please try again in a moment.')
        return
      }
      setResult(data)
    } catch {
      setError('Could not reach the planning assistant. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.2), transparent 70%)' }}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Try it yourself"
          title={<>Where does your salary go?</>}
          subtitle="No sign-up needed. Tell us your take-home pay and rough monthly spend, and Sparly's planning assistant will sketch a plan on the spot."
          className="mb-12"
        />

        <div className="rounded-[28px] border border-hairline bg-card p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Monthly take-home pay</span>
                <span className="font-semibold tabular-nums text-cream">₹{formatINR(takeHome)}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={300000}
                step={1000}
                value={takeHome}
                onChange={(e) => setTakeHome(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-[#FF7A24]"
                aria-label="Monthly take-home pay"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <SliderField label="Rent / housing" value={rent} min={0} max={100000} step={500} onChange={setRent} />
              <SliderField label="Food & groceries" value={food} min={0} max={50000} step={500} onChange={setFood} />
              <SliderField label="Transport" value={transport} min={0} max={30000} step={500} onChange={setTransport} />
              <SliderField label="Shopping & lifestyle" value={shopping} min={0} max={50000} step={500} onChange={setShopping} />
              <SliderField label="Other" value={other} min={0} max={30000} step={500} onChange={setOther} />
            </div>

            <Button onClick={handleGenerate} size="lg" className="mt-2 w-full justify-center">
              {loading ? 'Thinking…' : 'Generate my plan'}
            </Button>

            <p className="text-center text-xs text-muted">
              Free demo, up to 5 plans per visitor. General planning guidance only — not investment, tax, or legal advice.
            </p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-orange/25 bg-orange/[0.06] p-4 text-sm text-cream"
                >
                  {error}
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-5 rounded-2xl border border-hairline bg-white/[0.03] p-5 sm:p-6"
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed text-cream sm:text-base">{result.plan}</p>
                  <div className="flex flex-wrap gap-6 border-t border-hairline pt-4 text-sm">
                    <div>
                      <p className="text-muted">Plans generated so far</p>
                      <p className="font-semibold tabular-nums text-cream">{formatINR(result.plansGenerated)}</p>
                    </div>
                    <div>
                      <p className="text-muted">Average saving identified</p>
                      <p className="font-semibold tabular-nums text-cream">₹{formatINR(result.avgSaving)}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted">Free plans left for you</p>
                      <p className="font-semibold tabular-nums text-cream">{result.remainingRequests}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
