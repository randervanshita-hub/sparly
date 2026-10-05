import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: ReactNode
  sub?: ReactNode
  icon?: LucideIcon
  accent?: string
  className?: string
}

export function StatCard({ label, value, sub, icon: Icon, accent = '#FF9A55', className = '' }: StatCardProps) {
  return (
    <div className={`flex flex-col gap-3 rounded-2xl border border-hairline bg-card p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}1f`, color: accent }}>
            <Icon size={14} />
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold tabular-nums text-cream sm:text-[1.75rem]">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  )
}
