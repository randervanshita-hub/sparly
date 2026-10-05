import { motion } from 'framer-motion'
import {
  Home,
  ShoppingCart,
  Repeat,
  Plane,
  ShoppingBag,
  PiggyBank,
  LineChart,
  ShieldCheck,
} from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { RevealOnScroll } from './ui/RevealOnScroll'
import { formatINR } from '../hooks/useCountUp'

const CATEGORIES = [
  { label: 'Rent', icon: Home },
  { label: 'Groceries', icon: ShoppingCart },
  { label: 'Subscriptions', icon: Repeat },
  { label: 'Travel', icon: Plane },
  { label: 'Shopping', icon: ShoppingBag },
  { label: 'Savings', icon: PiggyBank },
  { label: 'Investments', icon: LineChart },
  { label: 'Emergency buffer', icon: ShieldCheck },
]

const PLAN_ITEMS = [
  { label: 'Rent', amount: 18000, icon: Home },
  { label: 'Groceries & essentials', amount: 6500, icon: ShoppingCart },
  { label: 'Subscriptions', amount: 1200, icon: Repeat },
  { label: 'Index Fund SIP', amount: 6000, icon: LineChart },
  { label: 'Emergency buffer', amount: 20000, icon: ShieldCheck },
]

export function MoneyPlanSplit() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="Money, meets real life"
            title={
              <>
                Your salary isn't a number.
                <br />
                It's rent, groceries, and{' '}
                <span className="font-serif-italic text-orange-soft">everything in between.</span>
              </>
            }
            subtitle="Sparly maps every rupee to the parts of life it actually touches — so your plan reflects how you really live, not a generic budget template."
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <RevealOnScroll key={cat.label} delay={i * 0.05} y={14}>
                <div className="flex items-center gap-2.5 rounded-full border border-hairline bg-white/[0.03] px-4 py-2.5">
                  <cat.icon size={14} className="shrink-0 text-orange-soft" />
                  <span className="truncate text-sm text-muted">{cat.label}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div
            className="pointer-events-none absolute -z-10 h-72 w-72 rounded-full opacity-50 blur-[100px]"
            style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.3), transparent 70%)' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm rounded-[26px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          >
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Monthly Money Plan</p>
            <p className="mt-1 text-2xl font-semibold text-cream">₹80,000 planned</p>

            <ul className="mt-6 flex flex-col gap-3">
              {PLAN_ITEMS.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-orange-soft">
                    <item.icon size={14} />
                  </span>
                  <span className="flex-1 truncate text-sm text-cream/90">{item.label}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-cream">
                    ₹{formatINR(item.amount)}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="animate-float absolute -right-6 -top-8 hidden rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl sm:block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-[11px] text-muted">On track</p>
            <p className="text-sm font-semibold text-cream">Savings +20%</p>
          </motion.div>

          <motion.div
            className="animate-float-slow absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl sm:block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.85 }}
          >
            <p className="text-[11px] text-muted">This week</p>
            <p className="text-sm font-semibold text-cream">₹7,420 left to spend</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
