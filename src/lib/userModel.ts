// Composes a complete per-user financial model from their onboarding
// profile. Sparly only collects summary-level answers during onboarding
// (not individual goal targets, holdings or transactions), so anything
// below that needs more structure than that — goals, investment mix —
// is generated using clearly-documented, reasonable planning heuristics,
// never copied from a shared demo fixture.
import {
  buildCalendar,
  buildFinancialHealth,
  buildMoneyPlan,
  buildSafeToSpend,
  getSavingsRate,
  type MoneyPlanCategory,
  type SafeToSpend,
} from './financeEngine'
import type { CalendarEvent, FinancialHealth, FinancialProfile, Goal } from './types'

interface GoalTemplate {
  icon: Goal['icon']
  target: (p: FinancialProfile) => number
  current: (p: FinancialProfile) => number
}

const GOAL_TEMPLATES: Record<string, GoalTemplate> = {
  'Build an emergency fund': { icon: 'shield', target: (p) => Math.max(p.fixedExpenses * 6, 30000), current: (p) => p.emergencyFund },
  'Buy a car': { icon: 'car', target: () => 800000, current: () => 0 },
  Travel: { icon: 'plane', target: () => 80000, current: () => 0 },
  'Buy a house': { icon: 'home', target: () => 2000000, current: () => 0 },
  'Pay off debt': { icon: 'target', target: (p) => Math.max(p.monthlyDebt * 24, 50000), current: () => 0 },
  'Build wealth': { icon: 'target', target: (p) => Math.max(p.currentInvestments * 3, 500000), current: (p) => p.currentInvestments },
  'Invest more': { icon: 'target', target: (p) => Math.max(p.currentInvestments * 2, 300000), current: (p) => p.currentInvestments },
  'Save for a major purchase': { icon: 'laptop', target: () => 150000, current: () => 0 },
  'Retire early': { icon: 'target', target: (p) => p.takeHomeIncome * 100, current: (p) => p.currentInvestments },
}

const FALLBACK_TEMPLATE: GoalTemplate = { icon: 'target', target: () => 100000, current: () => 0 }

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function buildGoals(profile: FinancialProfile, moneyPlan: MoneyPlanCategory[]): Goal[] {
  const names = profile.motivations.length ? profile.motivations : ['Build an emergency fund']
  const savings = moneyPlan.find((c) => c.key === 'savings')?.amount ?? 0
  const investments = moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0
  const perGoalContribution = Math.max(Math.round((savings + investments) / names.length), 500)

  return names.map((name) => {
    const template = GOAL_TEMPLATES[name] ?? FALLBACK_TEMPLATE
    const id = `goal_${slugify(name)}`
    const override = profile.goalOverrides[id]

    const targetAmount = Math.round(override?.targetAmount ?? template.target(profile))
    const currentAmount = Math.min(Math.round(override?.currentAmount ?? template.current(profile)), targetAmount)
    const monthlyContribution = Math.round(override?.monthlyContribution ?? perGoalContribution)

    return {
      id,
      name,
      icon: template.icon,
      targetAmount,
      currentAmount,
      targetDate: '',
      monthlyContribution,
    } satisfies Goal
  })
}

export interface InvestmentAllocationSlice {
  label: 'Equity' | 'Debt' | 'Cash'
  value: number
}

// No real holdings data exists yet, so this models a standard
// balanced-aggressive split rather than claiming specific fund names.
export function buildInvestmentAllocation(profile: FinancialProfile): InvestmentAllocationSlice[] {
  const total = profile.currentInvestments
  return [
    { label: 'Equity', value: Math.round(total * 0.65) },
    { label: 'Debt', value: Math.round(total * 0.25) },
    { label: 'Cash', value: total - Math.round(total * 0.65) - Math.round(total * 0.25) },
  ]
}

export interface FinancialModel {
  profile: FinancialProfile
  today: Date
  moneyPlan: MoneyPlanCategory[]
  safeToSpend: SafeToSpend
  goals: Goal[]
  investmentAllocation: InvestmentAllocationSlice[]
  health: FinancialHealth
  calendar: CalendarEvent[]
  savingsRate: number
}

export function buildFinancialModel(profile: FinancialProfile, today: Date = new Date()): FinancialModel {
  const moneyPlan = buildMoneyPlan(profile)
  const goals = buildGoals(profile, moneyPlan)
  const safeToSpend = buildSafeToSpend(profile, moneyPlan, today)
  const health = buildFinancialHealth(profile, moneyPlan, goals)
  const calendar = buildCalendar(profile, moneyPlan, today)
  const investmentAllocation = buildInvestmentAllocation(profile)
  const savingsRate = getSavingsRate(profile, moneyPlan)

  return { profile, today, moneyPlan, safeToSpend, goals, investmentAllocation, health, calendar, savingsRate }
}
