import { useEffect, useState } from 'react'

export interface DonutSegment {
  label: string
  value: number
  color: string
}

interface AnimatedDonutProps {
  segments: DonutSegment[]
  started: boolean
  size?: number
  strokeWidth?: number
  duration?: number
  centerLabel?: string
  centerValue?: string
}

export function AnimatedDonut({
  segments,
  started,
  size = 184,
  strokeWidth = 18,
  duration = 1.6,
  centerLabel,
  centerValue,
}: AnimatedDonutProps) {
  const [drawn, setDrawn] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const total = segments.reduce((sum, s) => sum + s.value, 0)

  useEffect(() => {
    // See useCountUp.ts for why there's no "already started" ref guard here.
    if (!started) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setDrawn(circumference)
      return
    }

    let frame: number
    const startTime = performance.now()
    const durationMs = duration * 1000

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDrawn(circumference * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [started, circumference, duration])

  let cumulative = 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg) => {
          const segLen = (seg.value / total) * circumference
          const offset = cumulative
          cumulative += segLen
          const visible = Math.min(Math.max(drawn - offset, 0), segLen)
          return (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={`${visible} ${circumference - visible}`}
              strokeDashoffset={-offset}
              style={{ transition: 'stroke 0.3s ease' }}
            />
          )
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
          {centerLabel && <span className="text-[11px] uppercase tracking-[0.1em] text-muted">{centerLabel}</span>}
          {centerValue && <span className="text-xl font-semibold text-cream">{centerValue}</span>}
        </div>
      )}
    </div>
  )
}
