import type { ReactNode } from 'react'
import { RevealOnScroll } from './RevealOnScroll'
import { Badge } from './Badge'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className = '' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'

  return (
    <div className={`flex flex-col gap-5 ${alignClass} ${className}`}>
      {eyebrow && (
        <RevealOnScroll>
          <Badge>{eyebrow}</Badge>
        </RevealOnScroll>
      )}
      <RevealOnScroll delay={0.08}>
        <h2 className="text-balance text-[2rem] leading-[1.12] font-semibold tracking-tight text-cream sm:text-[2.6rem] md:text-[3.1rem]">
          {title}
        </h2>
      </RevealOnScroll>
      {subtitle && (
        <RevealOnScroll delay={0.16}>
          <p className={`text-balance max-w-xl text-base leading-relaxed text-muted sm:text-lg ${align === 'center' ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        </RevealOnScroll>
      )}
    </div>
  )
}

export function Emphasis({ children }: { children: ReactNode }) {
  return <span className="font-serif-italic text-orange-soft">{children}</span>
}
