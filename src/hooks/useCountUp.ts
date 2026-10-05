import { useEffect, useState } from 'react'

interface UseCountUpOptions {
  start?: boolean
  duration?: number
  decimals?: number
  delay?: number
}

export function useCountUp(
  target: number,
  { start = false, duration = 1.4, decimals = 0, delay = 0 }: UseCountUpOptions = {},
) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    // No "has it already run" guard here: React StrictMode's dev-only
    // mount→cleanup→mount replay would cancel the first scheduled timeout
    // and then skip rescheduling it, leaving the animation stuck at 0
    // whenever `start` is already true on first render. Letting the effect
    // re-run freely (cleanup cancels, then a fresh run reschedules) is what
    // makes it survive that replay — it's a no-op in production.
    if (!start) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setValue(target)
      return
    }

    let frame: number
    let timeout: ReturnType<typeof setTimeout>
    const durationMs = duration * 1000

    const run = () => {
      const startTime = performance.now()
      const tick = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(target * eased)
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          setValue(target)
        }
      }
      frame = requestAnimationFrame(tick)
    }

    timeout = setTimeout(run, delay * 1000)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [start, target, duration, delay])

  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function formatINR(value: number): string {
  return Math.round(value).toLocaleString('en-IN')
}
