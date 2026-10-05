import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  href?: string
  to?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-orange text-[#140a04] shadow-[0_0_0_1px_rgba(255,122,36,0.4),0_8px_24px_-8px_rgba(255,122,36,0.55)] hover:shadow-[0_0_0_1px_rgba(255,154,85,0.6),0_10px_32px_-6px_rgba(255,122,36,0.7)]',
  secondary:
    'bg-transparent text-cream border border-hairline hover:border-white/25 hover:bg-white/[0.04]',
  ghost: 'bg-white/[0.06] text-cream border border-white/10 hover:bg-white/[0.1]',
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-300 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  const content = (
    <motion.span
      className={classes}
      whileHover={{ scale: 1.035, y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {children}
    </motion.span>
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-block">
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className="inline-block">
        {content}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className="inline-block">
      {content}
    </button>
  )
}
