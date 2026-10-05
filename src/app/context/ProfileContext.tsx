import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabaseClient'
import type { FinancialProfile, GoalOverride } from '../../lib/types'
import { buildFinancialModel, type FinancialModel } from '../../lib/userModel'

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
  goalOverrides: {},
}

interface ProfileRow {
  onboarded: boolean
  take_home_income: number
  income_frequency: string
  current_savings: number
  current_investments: number
  fixed_expenses: number
  variable_expenses: number
  monthly_debt: number
  emergency_fund: number
  motivations: string[]
  help_preferences: string[]
  goal_overrides: Record<string, GoalOverride> | null
}

function rowToProfile(row: ProfileRow): FinancialProfile {
  return {
    takeHomeIncome: Number(row.take_home_income),
    incomeFrequency: row.income_frequency as FinancialProfile['incomeFrequency'],
    currentSavings: Number(row.current_savings),
    currentInvestments: Number(row.current_investments),
    fixedExpenses: Number(row.fixed_expenses),
    variableExpenses: Number(row.variable_expenses),
    monthlyDebt: Number(row.monthly_debt),
    emergencyFund: Number(row.emergency_fund),
    motivations: row.motivations ?? [],
    helpPreferences: (row.help_preferences as FinancialProfile['helpPreferences']) ?? [],
    goalOverrides: row.goal_overrides ?? {},
  }
}

function profileToRow(p: FinancialProfile) {
  return {
    take_home_income: p.takeHomeIncome,
    income_frequency: p.incomeFrequency,
    current_savings: p.currentSavings,
    current_investments: p.currentInvestments,
    fixed_expenses: p.fixedExpenses,
    variable_expenses: p.variableExpenses,
    monthly_debt: p.monthlyDebt,
    emergency_fund: p.emergencyFund,
    motivations: p.motivations,
    help_preferences: p.helpPreferences,
    goal_overrides: p.goalOverrides,
  }
}

interface ProfileContextValue {
  profile: FinancialProfile
  model: FinancialModel
  onboarded: boolean
  loading: boolean
  session: Session | null
  displayName: string
  authError: string | null
  signUp: (email: string, password: string) => Promise<boolean>
  signIn: (email: string, password: string) => Promise<boolean>
  setProfile: (p: FinancialProfile) => Promise<void>
  updateGoal: (goalId: string, override: GoalOverride) => Promise<void>
  completeOnboarding: (p: FinancialProfile) => Promise<void>
  resetOnboarding: () => Promise<void>
  logout: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfileState] = useState<FinancialProfile>(DEFAULT_PROFILE)
  const [onboarded, setOnboarded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error || !data) {
      // The row is created automatically by a DB trigger on signup; if it's
      // missing (e.g. trigger lag) fall back to defaults rather than crash.
      setProfileState(DEFAULT_PROFILE)
      setOnboarded(false)
      return
    }
    setProfileState(rowToProfile(data as ProfileRow))
    setOnboarded(Boolean((data as ProfileRow).onboarded))
  }

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session) await loadProfile(data.session.user.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        await loadProfile(newSession.user.id)
      } else {
        setProfileState(DEFAULT_PROFILE)
        setOnboarded(false)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setAuthError(error.message)
      return false
    }
    return true
  }

  const signIn = async (email: string, password: string) => {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError(error.message)
      return false
    }
    return true
  }

  const setProfile = async (p: FinancialProfile) => {
    if (!session) return
    setProfileState(p)
    await supabase.from('profiles').update(profileToRow(p)).eq('id', session.user.id)
  }

  // Merges into one goal's stored overrides (target/current amount, monthly
  // contribution) without touching the rest of the profile or other goals.
  const updateGoal = async (goalId: string, override: GoalOverride) => {
    if (!session) return
    const nextOverrides = { ...profile.goalOverrides, [goalId]: { ...profile.goalOverrides[goalId], ...override } }
    setProfileState((p) => ({ ...p, goalOverrides: nextOverrides }))
    await supabase.from('profiles').update({ goal_overrides: nextOverrides }).eq('id', session.user.id)
  }

  const completeOnboarding = async (p: FinancialProfile) => {
    if (!session) return
    setProfileState(p)
    setOnboarded(true)
    await supabase
      .from('profiles')
      .update({ ...profileToRow(p), onboarded: true })
      .eq('id', session.user.id)
  }

  const resetOnboarding = async () => {
    if (!session) return
    setOnboarded(false)
    await supabase.from('profiles').update({ onboarded: false }).eq('id', session.user.id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setProfileState(DEFAULT_PROFILE)
    setOnboarded(false)
  }

  const emailLocalPart = session?.user.email?.split('@')[0] ?? ''
  const displayName = emailLocalPart ? emailLocalPart[0].toUpperCase() + emailLocalPart.slice(1) : 'there'

  // Recomputed only when the underlying profile actually changes, not on
  // every render — every page reads derived numbers from this one model
  // instead of recomputing (or worse, reaching for shared demo fixtures).
  const model = useMemo(() => buildFinancialModel(profile), [profile])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        model,
        onboarded,
        loading,
        session,
        displayName,
        authError,
        signUp,
        signIn,
        setProfile,
        updateGoal,
        completeOnboarding,
        resetOnboarding,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
