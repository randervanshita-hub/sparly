import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { formatINR, useCountUp } from '../../hooks/useCountUp'

interface AllocationCardProps {
  label: string
  value: number
  percent: number
  icon: LucideIcon
  accent: string
  started: boolean
  delay: number
}

export function AllocationCard({ label, value, percent, icon: Icon, accent, started, delay }: AllocationCardProps) {
  const count = useCountUp(value, { start: started, delay, duration: 1.1 })

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 rounded-2xl border border-hairline bg-elevated/70 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <Icon size={15} />
        </span>
        <span className="text-xs font-medium text-muted">{percent}%</span>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-cream sm:text-2xl">₹{formatINR(count)}</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accent }}
          initial={{ width: '0%' }}
          animate={started ? { width: `${percent}%` } : {}}
          transition={{ duration: 1, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  )
}
