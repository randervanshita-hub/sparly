import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
  amount?: number
  as?: 'div' | 'li'
}

const makeVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0 },
})

export function RevealOnScroll({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 0.25,
  as = 'div',
}: RevealOnScrollProps) {
  const MotionTag = as === 'li' ? motion.li : motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={makeVariants(y)}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
