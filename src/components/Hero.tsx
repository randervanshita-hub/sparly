import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { MoneyDashboard } from './dashboard/MoneyDashboard'

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div
        className="pointer-events-none absolute left-1/2 top-[-280px] -z-10 h-[620px] w-[920px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,122,36,0.35), transparent 70%)' }}
      />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 text-center sm:px-8">
        <motion.div initial="hidden" animate="visible" variants={heroVariants} transition={{ duration: 0.6 }}>
          <Badge>
            <Compass size={12} className="text-orange-soft" />
            A monthly money plan, built for you
          </Badge>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-cream sm:text-[3.4rem] md:text-[4rem]"
        >
          Your salary just landed.
          <br />
          Here's what to do <span className="font-serif-italic text-orange-soft">next.</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-balance max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Sparly turns your income into a clear monthly plan — what to spend, what to save, what to invest, and what
          to keep as a buffer. No spreadsheets. No guesswork.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col items-center gap-3 pt-2 sm:flex-row"
        >
          <Button variant="primary" size="lg" to="/app">
            Build My Money Plan
            <ArrowRight size={16} />
          </Button>
          <Button variant="secondary" size="lg" href="#how-it-works">
            See how it works
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-16 max-w-6xl px-5 sm:mt-20 sm:px-8"
      >
        <MoneyDashboard />
      </motion.div>
    </section>
  )
}
