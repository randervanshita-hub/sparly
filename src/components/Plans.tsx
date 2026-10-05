import { Check } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { RevealOnScroll } from './ui/RevealOnScroll'
import { Button } from './ui/Button'

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Everything you need to get a monthly plan and stick to it.',
    features: ['Monthly money plan', 'Daily spending guidance', 'Savings allocation', 'Upcoming bill reminders'],
    cta: 'Start My Plan',
    variant: 'secondary' as const,
    highlight: false,
  },
  {
    name: 'Sparly Plus',
    price: '₹149',
    period: 'per month',
    description: 'For when your money decisions get a little more layered.',
    features: [
      'Everything in Free',
      'Advanced goals & scenarios',
      'Deeper spending insights',
      'Personalized recommendations',
      'Priority support',
    ],
    cta: 'Try Sparly Plus',
    variant: 'primary' as const,
    highlight: true,
  },
]

export function Plans() {
  return (
    <section id="plans" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Plans"
          title={
            <>
              Start free. Go <span className="font-serif-italic text-orange-soft">deeper</span> when you're ready.
            </>
          }
          subtitle="No long-term lock-in. Change or cancel whenever your situation changes."
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PLANS.map((plan, i) => (
            <RevealOnScroll key={plan.name} delay={i * 0.12}>
              <div
                className={`relative flex h-full flex-col gap-6 rounded-3xl border p-7 sm:p-8 ${
                  plan.highlight ? 'border-orange/40 bg-elevated shadow-[0_30px_80px_-40px_rgba(255,122,36,0.5)]' : 'border-hairline bg-card'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-7 rounded-full bg-orange px-3 py-1 text-xs font-semibold text-[#140a04]">
                    Most popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-cream">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold text-cream">{plan.price}</span>
                    <span className="text-sm text-muted">/ {plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{plan.description}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-cream/90">
                      <Check size={16} className="mt-0.5 shrink-0 text-orange-soft" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button variant={plan.variant} size="md" to="/app" className="w-full">
                  {plan.cta}
                </Button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
