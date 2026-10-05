// Deterministic financial calculations. The "AI" layer (aiCoach.ts) only ever
// receives numbers computed here — it never invents a balance or a rupee figure.
import {
  demoCalendar,
  demoDebts,
  demoExpenses,
  demoGoals,
  demoIncome,
  demoInvestments,
  demoSubscriptions,
  demoTransactions,
} from './demoData'
import type { FinancialHealth, Goal } from './types'

export function getMonthlyIncome(): number {
  return demoIncome.reduce((sum, i) => sum + i.amount, 0)
}

export function getFixedExpenses(): number {
  return demoExpenses.filter((e) => e.fixed).reduce((sum, e) => sum + e.amount, 0)
}

export function getVariableExpenses(): number {
  return demoExpenses.filter((e) => !e.fixed).reduce((sum, e) => sum + e.amount, 0)
}

export function getTotalExpenses(): number {
  return getFixedExpenses() + getVariableExpenses()
}

export function getTotalEMI(): number {
  return demoDebts.reduce((sum, d) => sum + d.emi, 0)
}

export function getTotalGoalContributions(): number {
  return demoGoals.reduce((sum, g) => sum + g.monthlyContribution, 0)
}

export function getTotalInvestmentContributions(): number {
  return demoInvestments.reduce((sum, i) => sum + i.monthlyContribution, 0)
}

export function getCashFlow(): number {
  return getMonthlyIncome() - getTotalExpenses() - getTotalEMI() - getTotalGoalContributions() - getTotalInvestmentContributions()
}

export function getSavingsRate(): number {
  const income = getMonthlyIncome()
  const savedPortion = getTotalGoalContributions() + getTotalInvestmentContributions()
  return Math.round((savedPortion / income) * 100)
}

export interface MoneyPlanCategory {
  key: string
  label: string
  amount: number
  percent: number
  color: string
  spent: number
}

export function getMoneyPlan(): MoneyPlanCategory[] {
  const income = getMonthlyIncome()
  // Essentials, savings and investments are committed amounts (rent/EMI/bills,
  // actual goal contributions, actual SIPs) — they come first. Lifestyle is a
  // planned *allowance* carved from whatever's left, not the raw variable-spend
  // total (that's tracked separately as `spent`, for the plan-vs-actual compare).
  // Buffer absorbs the remainder, so the five percentages always sum to 100.
  const essentials = getFixedExpenses() + getTotalEMI()
  const savings = getTotalGoalContributions()
  const investments = getTotalInvestmentContributions()
  const remaining = Math.max(income - essentials - savings - investments, 0)
  const lifestyle = Math.round(remaining * 0.75)
  const buffer = remaining - lifestyle

  const categories: MoneyPlanCategory[] = [
    { key: 'essentials', label: 'Essentials', amount: essentials, percent: 0, color: '#8E8B85', spent: essentials },
    { key: 'savings', label: 'Savings', amount: savings, percent: 0, color: '#F3EEE7', spent: savings },
    { key: 'investments', label: 'Investments', amount: investments, percent: 0, color: '#FF9A55', spent: investments },
    { key: 'lifestyle', label: 'Lifestyle', amount: lifestyle, percent: 0, color: '#FF7A24', spent: getVariableExpenses() },
    { key: 'buffer', label: 'Buffer', amount: buffer, percent: 0, color: 'rgba(255,122,36,0.45)', spent: 0 },
  ]

  return categories.map((c) => ({ ...c, percent: Math.round((c.amount / income) * 100) }))
}

export interface SafeToSpend {
  amount: number
  daysToSalary: number
  upcomingCommitments: number
  goalContribution: number
  recommendedBuffer: number
}

export function getSafeToSpend(): SafeToSpend {
  const today = new Date('2026-10-05')
  const nextSalary = demoCalendar.find((c) => c.kind === 'income')
  const salaryDate = nextSalary ? new Date(nextSalary.date) : today
  const daysToSalary = Math.max(Math.ceil((salaryDate.getTime() - today.getTime()) / 86400000), 0)

  const upcomingCommitments = demoCalendar
    .filter((c) => c.kind === 'expense' && new Date(c.date) >= today && new Date(c.date) <= new Date('2026-10-18'))
    .reduce((sum, c) => sum + c.amount, 0)

  const goalContribution = 5000
  const recommendedBuffer = 3000
  const liquid = 64200 + 3140
  const amount = Math.max(liquid - upcomingCommitments - goalContribution - recommendedBuffer, 0)

  return { amount, daysToSalary, upcomingCommitments, goalContribution, recommendedBuffer }
}

export function projectGoalCompletion(goal: Goal, monthlyContribution = goal.monthlyContribution): string {
  const remaining = goal.targetAmount - goal.currentAmount
  if (remaining <= 0) return 'Reached'
  const months = Math.ceil(remaining / monthlyContribution)
  const date = new Date('2026-10-05')
  date.setMonth(date.getMonth() + months)
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export function getFinancialHealth(): FinancialHealth {
  const emergencyGoal = demoGoals.find((g) => g.id === 'goal_emergency')!
  const emergencyScore = Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100)
  const savingsRate = getSavingsRate()
  const savingsScore = Math.min(Math.round((savingsRate / 25) * 100), 100)
  const debtRatio = getTotalEMI() / getMonthlyIncome()
  const debtScore = Math.max(Math.round(100 - debtRatio * 250), 0)
  const goalsOnTrack = demoGoals.length
  const goalScore = Math.round((goalsOnTrack / demoGoals.length) * 84)
  const spendingStabilityScore = 79

  const components = [
    { key: 'emergency', label: 'Emergency Fund', score: emergencyScore, explanation: `Your emergency fund is ${emergencyScore}% of its target. Reaching 100% is the single biggest lever for this score.` },
    { key: 'savings', label: 'Savings Rate', score: savingsScore, explanation: `You're saving and investing ${savingsRate}% of your income. Most planners recommend 20–25%.` },
    { key: 'debt', label: 'Debt Management', score: debtScore, explanation: `Your EMI is ${Math.round(debtRatio * 100)}% of your income. Keeping this under 30% protects your flexibility.` },
    { key: 'goals', label: 'Goal Progress', score: goalScore, explanation: 'Most of your active goals are tracking close to schedule.' },
    { key: 'stability', label: 'Spending Stability', score: spendingStabilityScore, explanation: 'Your month-to-month discretionary spending varies moderately — a bit more consistency would help.' },
  ]

  const score = Math.round(components.reduce((sum, c) => sum + c.score, 0) / components.length)
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Strong' : score >= 45 ? 'Fair' : 'Needs attention'

  return { score, label, components }
}

export function getDiningAverage(): { thisMonth: number; average: number; percentIncrease: number } {
  const thisMonth = 7840
  const average = 6100
  const percentIncrease = Math.round(((thisMonth - average) / average) * 100)
  return { thisMonth, average, percentIncrease }
}

export function getRecentTransactions() {
  return demoTransactions
}

export function getSubscriptions() {
  return demoSubscriptions
}

export function getUnusedSubscriptions() {
  return demoSubscriptions.filter((s) => !s.confirmed)
}

export interface ScenarioInput {
  salary: number
  rent: number
  investment: number
  vacation: number
  loanRepayment: number
}

export interface ScenarioResult {
  emergencyFund12mo: number
  savings12mo: number
  goalCompletionMonths: number
}

export function runScenario(input: ScenarioInput): ScenarioResult {
  const monthlyFree = input.salary - input.rent - getVariableExpenses() - getFixedExpenses() + 18000 - input.investment - input.loanRepayment
  const monthlySavingsPortion = Math.max(monthlyFree * 0.4, 0)
  const emergencyFund12mo = 90000 + monthlySavingsPortion * 12 - input.vacation
  const savings12mo = 120000 + monthlyFree * 12 * 0.55 - input.vacation
  const emergencyGoal = demoGoals.find((g) => g.id === 'goal_emergency')!
  const remaining = emergencyGoal.targetAmount - emergencyGoal.currentAmount
  const effectiveContribution = Math.max(emergencyGoal.monthlyContribution + (input.investment - 12000) * 0.3, 500)
  const goalCompletionMonths = Math.max(Math.ceil(remaining / effectiveContribution), 1)

  return {
    emergencyFund12mo: Math.max(emergencyFund12mo, 0),
    savings12mo: Math.max(savings12mo, 0),
    goalCompletionMonths,
  }
}

export const DEFAULT_SCENARIO: ScenarioInput = {
  salary: 80000,
  rent: 18000,
  investment: 12000,
  vacation: 0,
  loanRepayment: 9800,
}
