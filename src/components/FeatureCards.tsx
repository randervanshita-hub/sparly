import { motion } from 'framer-motion'
import { Eye, Gauge, Compass as CompassIcon } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { RevealOnScroll } from './ui/RevealOnScroll'

const FEATURES = [
  {
    icon: Eye,
    title: 'Understand your money',
    body: 'See where your salary actually goes each month — rent, subscriptions, food, travel — grouped clearly, without digging through statements.',
  },
  {
    icon: Gauge,
    title: 'Know what you can spend',
    body: "Get a daily safe-to-spend number based on what's left this month, so every purchase is a decision, not a guess.",
  },
  {
    icon: CompassIcon,
    title: 'Build your next move',
    body: 'Sparly recommends how much to save and invest based on your goals, income pattern, and what you can realistically commit to.',
  },
]

export function FeatureCards() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How Sparly helps"
          title={
            <>
              Three things your salary <span className="font-serif-italic text-orange-soft">needs</span> every
              month.
            </>
          }
          subtitle="Not another expense tracker. Sparly connects what you earn to what you should actually do with it."
          className="mb-14"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <RevealOnScroll key={feature.title} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-hairline bg-card p-7 sm:p-8"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.25), transparent 70%)' }}
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-hairline bg-elevated text-orange-soft">
                  <feature.icon size={20} />
                </span>
                <div className="relative">
                  <h3 className="text-xl font-semibold text-cream">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{feature.body}</p>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
