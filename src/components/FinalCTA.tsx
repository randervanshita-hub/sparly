import { ArrowRight } from 'lucide-react'
import { RevealOnScroll } from './ui/RevealOnScroll'
import { Button } from './ui/Button'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-70 blur-[130px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.3), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: 'linear-gradient(180deg, #0b0b0a 0%, #120d09 50%, #0b0b0a 100%)' }}
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 px-5 text-center sm:px-8">
        <RevealOnScroll>
          <h2 className="text-balance text-[2.2rem] font-semibold leading-[1.1] tracking-tight text-cream sm:text-[3rem] md:text-[3.4rem]">
            Know where your <span className="font-serif-italic text-orange-soft">money</span> should go.
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-balance max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Sparly turns your salary into a simple plan you can actually follow — every month, without the
            spreadsheets.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <Button variant="primary" size="lg" to="/app">
            Build My Money Plan
            <ArrowRight size={16} />
          </Button>
        </RevealOnScroll>
      </div>
    </section>
  )
}
