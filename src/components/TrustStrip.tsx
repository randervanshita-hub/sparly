import { Landmark, QrCode, CreditCard, TrendingUp, CalendarClock, Wallet } from 'lucide-react'
import { RevealOnScroll } from './ui/RevealOnScroll'

const ITEMS = [
  { label: 'Bank accounts', icon: Landmark },
  { label: 'UPI', icon: QrCode },
  { label: 'Cards', icon: CreditCard },
  { label: 'Mutual funds', icon: TrendingUp },
  { label: 'Recurring bills', icon: CalendarClock },
  { label: 'Everyday spends', icon: Wallet },
]

export function TrustStrip() {
  return (
    <section className="border-y border-hairline bg-card/40 py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll>
          <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Works around the money you already use
          </p>
        </RevealOnScroll>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ITEMS.map((item, i) => (
            <RevealOnScroll key={item.label} delay={i * 0.06}>
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-hairline bg-white/[0.02] px-4 py-6 text-center transition-colors duration-300 hover:bg-white/[0.04]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.05] text-orange-soft">
                  <item.icon size={17} />
                </span>
                <span className="text-xs font-medium text-muted">{item.label}</span>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
