import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { FinancialProfile } from '../../lib/types'

const STORAGE_KEY = 'sparly_profile_v1'

const DEFAULT_PROFILE: FinancialProfile = {
  takeHomeIncome: 80000,
  incomeFrequency: 'monthly',
  currentSavings: 120000,
  currentInvestments: 240000,
  fixedExpenses: 24000,
  variableExpenses: 19000,
  monthlyDebt: 9800,
  emergencyFund: 90000,
  motivations: ['Build an emergency fund', 'Travel'],
  helpPreferences: ['Tell me how much I can safely spend', 'Give me an overall financial plan'],
}

interface ProfileContextValue {
  profile: FinancialProfile
  onboarded: boolean
  setProfile: (p: FinancialProfile) => void
  completeOnboarding: (p: FinancialProfile) => void
  resetOnboarding: () => void
  logout: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<FinancialProfile>(DEFAULT_PROFILE)
  const [onboarded, setOnboarded] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setProfileState(parsed.profile ?? DEFAULT_PROFILE)
        setOnboarded(Boolean(parsed.onboarded))
      } else {
        // Demo mode: ship pre-onboarded so every screen is explorable immediately.
        setOnboarded(true)
      }
    } catch {
      setOnboarded(true)
    }
  }, [])

  const persist = (p: FinancialProfile, done: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: p, onboarded: done }))
    } catch {
      // ignore storage failures (private browsing, etc.)
    }
  }

  const setProfile = (p: FinancialProfile) => {
    setProfileState(p)
    persist(p, onboarded)
  }

  const completeOnboarding = (p: FinancialProfile) => {
    setProfileState(p)
    setOnboarded(true)
    persist(p, true)
  }

  const resetOnboarding = () => {
    setOnboarded(false)
    persist(profile, false)
  }

  const logout = () => {
    // Explicitly persist onboarded:false (rather than just clearing the key)
    // so this survives a hard reload or a fresh tab — without it, the "no
    // stored data" branch above re-defaults to the pre-onboarded demo state
    // and silently logs the same user back in.
    setProfileState(DEFAULT_PROFILE)
    setOnboarded(false)
    persist(DEFAULT_PROFILE, false)
  }

  return (
    <ProfileContext.Provider value={{ profile, onboarded, setProfile, completeOnboarding, resetOnboarding, logout }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
