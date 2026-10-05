import type { ReactNode } from 'react'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted ${className}`}
    >
      {children}
    </span>
  )
}
