export interface User {
  id: string
  name: string
  email: string
  onboarded: boolean
}

export type IncomeFrequency = 'monthly' | 'biweekly' | 'weekly'

export interface Income {
  id: string
  source: string
  amount: number
  frequency: IncomeFrequency
}

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Travel'
  | 'Healthcare'
  | 'Subscriptions'
  | 'Rent'
  | 'Other'

export interface Expense {
  id: string
  label: string
  category: ExpenseCategory
  amount: number
  fixed: boolean
}

export interface Debt {
  id: string
  label: string
  principal: number
  remaining: number
  emi: number
  interestRate: number
}

export interface Account {
  id: string
  label: string
  type: 'bank' | 'wallet'
  balance: number
}

export interface Investment {
  id: string
  label: string
  type: 'Equity' | 'Debt' | 'Cash'
  invested: number
  currentValue: number
  monthlyContribution: number
  goalId?: string
}

export interface Goal {
  id: string
  name: string
  icon: 'shield' | 'plane' | 'laptop' | 'home' | 'car' | 'target'
  targetAmount: number
  currentAmount: number
  targetDate: string
  monthlyContribution: number
}

export interface Subscription {
  id: string
  label: string
  amount: number
  cadence: 'monthly' | 'yearly'
  confirmed: boolean
  lastUsed?: string
}

export interface Transaction {
  id: string
  date: string
  merchant: string
  category: ExpenseCategory
  amount: number
}

export interface CalendarEvent {
  id: string
  date: string
  label: string
  amount: number
  kind: 'income' | 'expense'
}

export type InsightSeverity = 'positive' | 'neutral' | 'watch'

export interface Insight {
  id: string
  title: string
  what: string
  why: string
  action: string
  severity: InsightSeverity
}

export interface FinancialHealthComponent {
  key: string
  label: string
  score: number
  explanation: string
}

export interface FinancialHealth {
  score: number
  label: string
  components: FinancialHealthComponent[]
}

export type GoalMotivation =
  | 'Build an emergency fund'
  | 'Buy a car'
  | 'Travel'
  | 'Buy a house'
  | 'Pay off debt'
  | 'Build wealth'
  | 'Invest more'
  | 'Save for a major purchase'
  | 'Retire early'

export type HelpPreference =
  | 'Keep my spending under control'
  | 'Tell me how much I can safely spend'
  | 'Help me save more'
  | 'Help me invest consistently'
  | 'Help me reach my goals'
  | 'Give me an overall financial plan'

export interface FinancialProfile {
  takeHomeIncome: number
  incomeFrequency: IncomeFrequency
  currentSavings: number
  currentInvestments: number
  fixedExpenses: number
  variableExpenses: number
  monthlyDebt: number
  emergencyFund: number
  // string, not GoalMotivation[]: onboarding lets users type a free-text
  // custom goal alongside the preset chips, so this is never a closed union.
  motivations: string[]
  helpPreferences: HelpPreference[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  quickReplies?: string[]
}
