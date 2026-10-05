import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getMonthlyRecommendation } from '../../../lib/aiCoach'
import { useProfile } from '../../context/ProfileContext'

export function AIRecommendationCard() {
  const { model } = useProfile()
  const rec = getMonthlyRecommendation(model)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-card to-elevated p-6 sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40 blur-[90px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.35), transparent 70%)' }}
      />
      <div className="relative flex flex-col gap-4">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-orange-soft">
          <Sparkles size={13} />
          Your money move this month
        </p>
        <h2 className="text-balance text-xl font-semibold leading-snug text-cream sm:text-2xl">{rec.headline}</h2>
        <p className="max-w-2xl text-balance text-sm leading-relaxed text-cream/80 sm:text-base">{rec.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            to="/app/plan"
            className="inline-flex items-center gap-2 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.03]"
          >
            See my plan
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/app/coach"
            className="inline-flex items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:border-white/25"
          >
            Ask Sparly why
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
