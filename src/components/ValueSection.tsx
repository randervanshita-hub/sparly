import { CircleDollarSign, PiggyBank, LineChart, Compass } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { RevealOnScroll } from './ui/RevealOnScroll'

const VALUES = [
  {
    icon: CircleDollarSign,
    title: 'Spend with confidence',
    body: 'A clear daily number that tells you what you can spend, without second-guessing.',
  },
  {
    icon: PiggyBank,
    title: 'Save consistently',
    body: 'Saving happens first, automatically factored into your plan — not whatever is left over.',
  },
  {
    icon: LineChart,
    title: 'Invest intentionally',
    body: 'A steady, realistic investing amount matched to your income and goals, every month.',
  },
  {
    icon: Compass,
    title: 'Prepare for what’s next',
    body: 'A buffer built in for the unexpected, so one bad month doesn’t undo your plan.',
  },
]

export function ValueSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Why it works"
          title={
            <>
              One salary.
              <br />
              One <span className="font-serif-italic text-orange-soft">clear</span> plan.
            </>
          }
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <RevealOnScroll key={v.title} delay={i * 0.1}>
              <div className="flex h-full flex-col gap-4 rounded-2xl border border-hairline bg-white/[0.02] p-6 transition-colors duration-300 hover:bg-white/[0.04]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-elevated text-orange-soft">
                  <v.icon size={18} />
                </span>
                <h3 className="text-base font-semibold text-cream">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{v.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
