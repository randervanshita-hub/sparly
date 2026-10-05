import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { TrustStrip } from '../components/TrustStrip'
import { FeatureCards } from '../components/FeatureCards'
import { MoneyPlanSplit } from '../components/MoneyPlanSplit'
import { SalaryAllocation } from '../components/SalaryAllocation'
import { ValueSection } from '../components/ValueSection'
import { Plans } from '../components/Plans'
import { Testimonials } from '../components/Testimonials'
import { FAQ } from '../components/FAQ'
import { FinalCTA } from '../components/FinalCTA'
import { Footer } from '../components/Footer'

export function Landing() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <FeatureCards />
        <MoneyPlanSplit />
        <SalaryAllocation />
        <ValueSection />
        <Plans />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
