import { Routes, Route } from 'react-router-dom'
import { ProfileProvider } from './app/context/ProfileContext'
import { Landing } from './pages/Landing'
import { AppEntry } from './app/pages/AppEntry'
import { Onboarding } from './app/pages/Onboarding'
import { AppShell } from './app/components/layout/AppShell'
import { Overview } from './app/pages/Overview'
import { MoneyPlan } from './app/pages/MoneyPlan'
import { Transactions } from './app/pages/Transactions'
import { Goals } from './app/pages/Goals'
import { Insights } from './app/pages/Insights'
import { Simulator } from './app/pages/Simulator'
import { Coach } from './app/pages/Coach'
import { Investments } from './app/pages/Investments'
import { FinancialHealth } from './app/pages/FinancialHealth'
import { Settings } from './app/pages/Settings'
import { Help } from './app/pages/Help'

function App() {
  return (
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppEntry />} />
        <Route path="/app/onboarding" element={<Onboarding />} />
        <Route element={<AppShell />}>
          <Route path="/app/overview" element={<Overview />} />
          <Route path="/app/plan" element={<MoneyPlan />} />
          <Route path="/app/transactions" element={<Transactions />} />
          <Route path="/app/goals" element={<Goals />} />
          <Route path="/app/insights" element={<Insights />} />
          <Route path="/app/simulator" element={<Simulator />} />
          <Route path="/app/coach" element={<Coach />} />
          <Route path="/app/investments" element={<Investments />} />
          <Route path="/app/health" element={<FinancialHealth />} />
          <Route path="/app/settings" element={<Settings />} />
          <Route path="/app/help" element={<Help />} />
        </Route>
      </Routes>
    </ProfileProvider>
  )
}

export default App
