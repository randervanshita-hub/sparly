import { motion } from 'framer-motion'
import { formatINR } from '../../../hooks/useCountUp'

interface AllocationBarProps {
  label: string
  amount: number
  percent: number
  color: string
  onClick?: () => void
  delay?: number
  started?: boolean
}

export function AllocationBar({ label, amount, percent, color, onClick, delay = 0, started = true }: AllocationBarProps) {
  const Comp = onClick ? 'button' : 'div'

  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex w-full flex-col gap-2.5 text-left ${onClick ? 'cursor-pointer rounded-xl px-2 py-1.5 -mx-2 transition-colors hover:bg-white/[0.03]' : ''}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="flex items-center gap-2.5 text-sm font-medium text-cream">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </span>
        <span className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold tabular-nums text-cream">₹{formatINR(amount)}</span>
          <span className="text-xs text-muted">{percent}%</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '0%' }}
          animate={started ? { width: `${percent}%` } : {}}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </Comp>
  )
}
