import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { formatINR } from '../../../hooks/useCountUp'
import { useProfile } from '../../context/ProfileContext'

export function MiniCalendar() {
  const { model } = useProfile()

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-hairline bg-card p-6">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted">Coming up</p>
      <ul className="flex flex-col gap-3.5">
        {model.calendar.map((event) => {
          const date = new Date(event.date)
          const day = date.toLocaleDateString('en-IN', { day: '2-digit' })
          const month = date.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
          const isIncome = event.kind === 'income'
          return (
            <li key={event.id} className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg border border-hairline bg-white/[0.02] text-center leading-none">
                <span className="text-[10px] font-medium text-muted">{month}</span>
                <span className="text-sm font-semibold text-cream">{day}</span>
              </div>
              <span className="flex-1 truncate text-sm text-cream/90">{event.label}</span>
              <span className={`flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums ${isIncome ? 'text-orange-soft' : 'text-cream'}`}>
                {isIncome ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                ₹{formatINR(event.amount)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
