// Deterministic financial calculations, all derived from a real user's
// FinancialProfile (set during onboarding, persisted in Supabase) — never
// from fixed demo fixtures. The "AI" layer (aiCoach.ts) only ever receives
// numbers computed here; it never invents a balance or a rupee figure.
//
// Sparly doesn't yet import real transactions, holdings or bank balances, so
// anything that would require that (actual spend-vs-plan, dining averages,
// real fund names) is intentionally NOT fabricated here — those surfaces
// show honest "not enough data yet" states in the UI instead.
import type { CalendarEvent, FinancialHealth, FinancialProfile, Goal } from './types'

export function getMonthlyIncome(profile: FinancialProfile): number {
  return profile.takeHomeIncome
}

export function getSavingsRate(profile: FinancialProfile, moneyPlan: MoneyPlanCategory[]): number {
  const income = profile.takeHomeIncome
  if (income <= 0) return 0
  const savings = moneyPlan.find((c) => c.key === 'savings')?.amount ?? 0
  const investments = moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0
  return Math.round(((savings + investments) / income) * 100)
}

export interface MoneyPlanCategory {
  key: 'essentials' | 'savings' | 'investments' | 'lifestyle' | 'buffer'
  label: string
  amount: number
  percent: number
  color: string
}

// Essentials is a real pass-through (fixed expenses + debt), so it varies
// person to person. What's left is split using the same relative proportions
// as Sparly's signature "next ₹1,00,000" breakdown on the landing page
// (20 : 15 : 12 : 8 — savings : investments : lifestyle : buffer),
// normalized to whatever actually remains after essentials.
const REMAINDER_WEIGHTS = { savings: 20, investments: 15, lifestyle: 12, buffer: 8 }
const REMAINDER_TOTAL = REMAINDER_WEIGHTS.savings + REMAINDER_WEIGHTS.investments + REMAINDER_WEIGHTS.lifestyle + REMAINDER_WEIGHTS.buffer

export function buildMoneyPlan(profile: FinancialProfile): MoneyPlanCategory[] {
  const income = profile.takeHomeIncome
  const essentials = profile.fixedExpenses + profile.monthlyDebt
  const remaining = Math.max(income - essentials, 0)

  const savings = Math.round((remaining * REMAINDER_WEIGHTS.savings) / REMAINDER_TOTAL)
  const investments = Math.round((remaining * REMAINDER_WEIGHTS.investments) / REMAINDER_TOTAL)
  const lifestyle = Math.round((remaining * REMAINDER_WEIGHTS.lifestyle) / REMAINDER_TOTAL)
  const buffer = Math.max(remaining - savings - investments - lifestyle, 0)

  const categories: Omit<MoneyPlanCategory, 'percent'>[] = [
    { key: 'essentials', label: 'Essentials', amount: essentials, color: '#8E8B85' },
    { key: 'savings', label: 'Savings', amount: savings, color: '#F3EEE7' },
    { key: 'investments', label: 'Investments', amount: investments, color: '#FF9A55' },
    { key: 'lifestyle', label: 'Lifestyle', amount: lifestyle, color: '#FF7A24' },
    { key: 'buffer', label: 'Buffer', amount: buffer, color: 'rgba(255,122,36,0.45)' },
  ]

  return categories.map((c) => ({ ...c, percent: income > 0 ? Math.round((c.amount / income) * 100) : 0 }))
}

export interface SafeToSpend {
  amount: number
  daysToSalary: number
  upcomingCommitments: number
  goalContribution: number
  recommendedBuffer: number
}

function daysUntilNextCycle(profile: FinancialProfile, today: Date): number {
  if (profile.incomeFrequency === 'weekly') return 7
  if (profile.incomeFrequency === 'biweekly') return 14
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  return Math.max(Math.ceil((nextMonth.getTime() - today.getTime()) / 86400000), 1)
}

export function buildSafeToSpend(profile: FinancialProfile, moneyPlan: MoneyPlanCategory[], today: Date): SafeToSpend {
  const lifestyle = moneyPlan.find((c) => c.key === 'lifestyle')?.amount ?? 0
  const savings = moneyPlan.find((c) => c.key === 'savings')?.amount ?? 0
  const investments = moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0
  const buffer = moneyPlan.find((c) => c.key === 'buffer')?.amount ?? 0

  return {
    // Sparly doesn't track transactions yet, so this is the full cycle's
    // discretionary allowance, not "allowance minus what you've already spent".
    amount: lifestyle,
    daysToSalary: daysUntilNextCycle(profile, today),
    upcomingCommitments: profile.fixedExpenses + profile.monthlyDebt,
    goalContribution: savings + investments,
    recommendedBuffer: buffer,
  }
}

export function projectGoalCompletion(goal: Goal, today: Date, monthlyContribution = goal.monthlyContribution): string {
  const remaining = goal.targetAmount - goal.currentAmount
  if (remaining <= 0) return 'Reached'
  if (monthlyContribution <= 0) return 'Not yet funded'
  const months = Math.ceil(remaining / monthlyContribution)
  const date = new Date(today)
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export function buildFinancialHealth(profile: FinancialProfile, moneyPlan: MoneyPlanCategory[], goals: Goal[]): FinancialHealth {
  const income = profile.takeHomeIncome
  const essentials = profile.fixedExpenses + profile.monthlyDebt
  const savingsRate = getSavingsRate(profile, moneyPlan)

  const emergencyTarget = Math.max(profile.fixedExpenses * 6, 1)
  const emergencyScore = Math.min(Math.round((profile.emergencyFund / emergencyTarget) * 100), 100)
  const savingsScore = Math.min(Math.round((savingsRate / 25) * 100), 100)
  const debtRatio = income > 0 ? profile.monthlyDebt / income : 0
  const debtScore = Math.max(Math.round(100 - debtRatio * 250), 0)
  const goalScore = goals.length
    ? Math.round((goals.reduce((sum, g) => sum + Math.min(g.currentAmount / g.targetAmount, 1), 0) / goals.length) * 100)
    : 50
  const coverageScore = income > 0 ? Math.min(Math.round(((income - essentials) / income) * 100), 100) : 0

  const components = [
    {
      key: 'emergency',
      label: 'Emergency Fund',
      score: emergencyScore,
      explanation: `Your emergency fund is ${emergencyScore}% of a 6-month essentials target. Reaching 100% is the single biggest lever for this score.`,
    },
    {
      key: 'savings',
      label: 'Savings Rate',
      score: savingsScore,
      explanation: `You're saving and investing ${savingsRate}% of your income. Most planners recommend 20–25%.`,
    },
    {
      key: 'debt',
      label: 'Debt Management',
      score: debtScore,
      explanation: `Your debt payments are ${Math.round(debtRatio * 100)}% of your income. Keeping this under 30% protects your flexibility.`,
    },
    {
      key: 'goals',
      label: 'Goal Progress',
      score: goalScore,
      explanation: 'How far along your active goals are, averaged together.',
    },
    {
      key: 'coverage',
      label: 'Expense Coverage',
      score: coverageScore,
      explanation: 'How much of your income is left after essentials and debt — more room means more flexibility.',
    },
  ]

  const score = Math.round(components.reduce((sum, c) => sum + c.score, 0) / components.length)
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Strong' : score >= 45 ? 'Fair' : 'Needs attention'

  return { score, label, components }
}

export function buildCalendar(profile: FinancialProfile, moneyPlan: MoneyPlanCategory[], today: Date): CalendarEvent[] {
  const nextCycle = new Date(today)
  nextCycle.setDate(nextCycle.getDate() + daysUntilNextCycle(profile, today))
  const essentialsDate = new Date(today)
  essentialsDate.setDate(essentialsDate.getDate() + Math.min(5, daysUntilNextCycle(profile, today)))
  const investDate = new Date(today)
  investDate.setDate(investDate.getDate() + Math.min(10, daysUntilNextCycle(profile, today)))

  const investments = moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0

  const events: CalendarEvent[] = [
    { id: 'cal_income', date: nextCycle.toISOString().slice(0, 10), label: 'Next income', amount: profile.takeHomeIncome, kind: 'income' },
    { id: 'cal_essentials', date: essentialsDate.toISOString().slice(0, 10), label: 'Essentials & debt', amount: profile.fixedExpenses + profile.monthlyDebt, kind: 'expense' },
  ]

  if (investments > 0) {
    events.push({ id: 'cal_invest', date: investDate.toISOString().slice(0, 10), label: 'Planned investment', amount: investments, kind: 'expense' })
  }

  return events.sort((a, b) => a.date.localeCompare(b.date))
}

export interface ScenarioInput {
  salary: number
  essentials: number
  investment: number
  vacation: number
  loanRepayment: number
}

export interface ScenarioResult {
  emergencyFund12mo: number
  savings12mo: number
  goalCompletionMonths: number
}

export function runScenario(input: ScenarioInput, profile: FinancialProfile, primaryGoal: Goal | undefined, today: Date): ScenarioResult {
  const monthlyFree = input.salary - input.essentials - input.investment - input.loanRepayment
  const monthlySavingsPortion = Math.max(monthlyFree * 0.4, 0)
  const emergencyFund12mo = Math.max(profile.emergencyFund + monthlySavingsPortion * 12 - input.vacation, 0)
  const savings12mo = Math.max(profile.currentSavings + monthlyFree * 12 * 0.55 - input.vacation, 0)

  let goalCompletionMonths = 0
  if (primaryGoal) {
    const remaining = Math.max(primaryGoal.targetAmount - primaryGoal.currentAmount, 0)
    const baselineContribution = primaryGoal.monthlyContribution
    const investmentDelta = input.investment - (profile.fixedExpenses > 0 ? 0 : 0)
    const effectiveContribution = Math.max(baselineContribution + investmentDelta * 0.3, 500)
    goalCompletionMonths = remaining > 0 ? Math.max(Math.ceil(remaining / effectiveContribution), 1) : 0
  }
  void today

  return { emergencyFund12mo, savings12mo, goalCompletionMonths }
}

export function defaultScenario(profile: FinancialProfile, moneyPlan: MoneyPlanCategory[]): ScenarioInput {
  return {
    salary: profile.takeHomeIncome,
    essentials: profile.fixedExpenses,
    investment: moneyPlan.find((c) => c.key === 'investments')?.amount ?? 0,
    vacation: 0,
    loanRepayment: profile.monthlyDebt,
  }
}
