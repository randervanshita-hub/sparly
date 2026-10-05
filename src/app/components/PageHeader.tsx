import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        {eyebrow && <p className="mb-2 text-xs font-medium uppercase tracking-[0.1em] text-muted">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight text-cream sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  )
}
