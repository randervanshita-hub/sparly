export type IncomeFrequency = 'monthly' | 'biweekly' | 'weekly'

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

export interface Goal {
  id: string
  name: string
  icon: 'shield' | 'plane' | 'laptop' | 'home' | 'car' | 'target'
  targetAmount: number
  currentAmount: number
  targetDate: string
  monthlyContribution: number
}

export type TransactionSource = 'manual' | 'bank_sandbox'
export type RecurrenceCadence = 'weekly' | 'monthly' | 'yearly'

export interface Transaction {
  id: string
  date: string
  merchant: string
  category: ExpenseCategory
  amount: number
  isRecurring: boolean
  recurrence: RecurrenceCadence | null
  source: TransactionSource
}

export interface LinkedAccount {
  id: string
  provider: 'setu_sandbox'
  bankName: string
  accountMask: string
  status: 'active' | 'revoked'
  linkedAt: string
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

// A user's manual edits to an auto-generated goal (see userModel.ts's
// GOAL_TEMPLATES) — only the fields they've actually changed are stored;
// anything absent keeps using the generated default.
export interface GoalOverride {
  targetAmount?: number
  currentAmount?: number
  monthlyContribution?: number
}

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
  goalOverrides: Record<string, GoalOverride>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  quickReplies?: string[]
}
