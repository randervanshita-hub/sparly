import { Receipt, Repeat } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'

export function Transactions() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader eyebrow="Transactions" title="Everything you've spent" subtitle="Grouped and explained, not just listed." />

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-card px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-muted">
          <Receipt size={20} />
        </span>
        <div>
          <p className="text-sm font-medium text-cream">No transactions yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
            Sparly doesn't have a way to see your spending automatically yet — bank and card connections are coming
            soon. Once transactions start flowing in, you'll see them grouped and explained here.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-card px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-muted">
          <Repeat size={20} />
        </span>
        <div>
          <p className="text-sm font-medium text-cream">No recurring charges detected</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
            Once Sparly can see your transactions, it'll automatically flag subscriptions here — including ones you
            might have forgotten about.
          </p>
        </div>
      </div>
    </div>
  )
}
