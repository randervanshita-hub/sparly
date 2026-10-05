import { Quote } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { RevealOnScroll } from './ui/RevealOnScroll'

const TESTIMONIALS = [
  {
    quote: 'I finally know how much I can spend without feeling guilty about it.',
    name: 'Early user',
    role: 'Software engineer, 26',
  },
  {
    quote: 'I used to save whatever was left at the end of the month. Now I save first.',
    name: 'Early user',
    role: 'Marketing associate, 24',
  },
  {
    quote: 'My salary used to feel like just a number. Now it feels like an actual plan.',
    name: 'Early user',
    role: 'Product designer, 28',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="What people say"
          title={
            <>
              How it <span className="font-serif-italic text-orange-soft">feels</span> to finally have a plan.
            </>
          }
          className="mb-10"
        />
        <p className="mx-auto -mt-6 mb-10 max-w-xl text-center text-xs text-muted">
          Sparly is in early development — these are illustrative, demo testimonials representing the outcomes we're
          building toward.
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={t.quote} delay={i * 0.12}>
              <div className="flex h-full flex-col gap-5 rounded-3xl border border-hairline bg-card p-7">
                <Quote size={22} className="text-orange-soft/70" />
                <p className="flex-1 text-balance text-base leading-relaxed text-cream/90">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-cream">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
