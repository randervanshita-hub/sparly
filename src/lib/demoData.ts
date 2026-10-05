import type {
  Account,
  CalendarEvent,
  Debt,
  Expense,
  Goal,
  Income,
  Investment,
  Subscription,
  Transaction,
  User,
} from './types'

export const demoUser: User = {
  id: 'u_demo',
  name: 'Vanshita',
  email: 'vanshita@example.com',
  onboarded: true,
}

export const demoIncome: Income[] = [{ id: 'inc_1', source: 'Salary', amount: 80000, frequency: 'monthly' }]

export const demoExpenses: Expense[] = [
  { id: 'exp_rent', label: 'Rent', category: 'Rent', amount: 18000, fixed: true },
  { id: 'exp_groceries', label: 'Groceries', category: 'Food', amount: 6500, fixed: false },
  { id: 'exp_transport', label: 'Transport', category: 'Transport', amount: 3200, fixed: false },
  { id: 'exp_bills', label: 'Utilities & bills', category: 'Bills', amount: 4100, fixed: true },
  { id: 'exp_subs', label: 'Subscriptions', category: 'Subscriptions', amount: 1868, fixed: true },
  { id: 'exp_dining', label: 'Dining out', category: 'Food', amount: 7840, fixed: false },
  { id: 'exp_shopping', label: 'Shopping', category: 'Shopping', amount: 5200, fixed: false },
  { id: 'exp_entertainment', label: 'Entertainment', category: 'Entertainment', amount: 2100, fixed: false },
]

export const demoDebts: Debt[] = [
  { id: 'debt_car', label: 'Car loan', principal: 450000, remaining: 350000, emi: 9800, interestRate: 9.2 },
]

export const demoAccounts: Account[] = [
  { id: 'acc_bank', label: 'HDFC Bank — Savings', type: 'bank', balance: 64200 },
  { id: 'acc_wallet', label: 'UPI wallet', type: 'wallet', balance: 3140 },
]

export const demoInvestments: Investment[] = [
  { id: 'inv_index', label: 'Index Fund SIP', type: 'Equity', invested: 156000, currentValue: 182400, monthlyContribution: 6000, goalId: 'goal_wealth' },
  { id: 'inv_elss', label: 'ELSS Tax Saver', type: 'Equity', invested: 48000, currentValue: 52600, monthlyContribution: 2000 },
  { id: 'inv_debt', label: 'Debt Fund', type: 'Debt', invested: 36000, currentValue: 37900, monthlyContribution: 3000 },
  { id: 'inv_cash', label: 'Liquid Fund', type: 'Cash', invested: 24000, currentValue: 24300, monthlyContribution: 1000 },
]

export const demoGoals: Goal[] = [
  {
    id: 'goal_emergency',
    name: 'Emergency Fund',
    icon: 'shield',
    targetAmount: 150000,
    currentAmount: 90000,
    targetDate: '2027-03-01',
    monthlyContribution: 5000,
  },
  {
    id: 'goal_travel',
    name: 'Travel',
    icon: 'plane',
    targetAmount: 80000,
    currentAmount: 32000,
    targetDate: '2026-09-01',
    monthlyContribution: 4000,
  },
  {
    id: 'goal_laptop',
    name: 'New Laptop',
    icon: 'laptop',
    targetAmount: 120000,
    currentAmount: 72000,
    targetDate: '2026-12-01',
    monthlyContribution: 6000,
  },
]

export const demoSubscriptions: Subscription[] = [
  { id: 'sub_netflix', label: 'Netflix', amount: 649, cadence: 'monthly', confirmed: true, lastUsed: '2 days ago' },
  { id: 'sub_spotify', label: 'Spotify', amount: 119, cadence: 'monthly', confirmed: true, lastUsed: 'Today' },
  { id: 'sub_gym', label: 'Gym membership', amount: 2000, cadence: 'monthly', confirmed: false, lastUsed: '41 days ago' },
  { id: 'sub_cloud', label: 'Cloud storage', amount: 199, cadence: 'monthly', confirmed: false, lastUsed: '63 days ago' },
]

export const demoTransactions: Transaction[] = [
  { id: 'tx_1', date: '2026-10-04', merchant: 'Blue Tokai Coffee', category: 'Food', amount: 420 },
  { id: 'tx_2', date: '2026-10-04', merchant: 'Ola', category: 'Transport', amount: 240 },
  { id: 'tx_3', date: '2026-10-03', merchant: 'Zomato', category: 'Food', amount: 680 },
  { id: 'tx_4', date: '2026-10-03', merchant: 'Amazon', category: 'Shopping', amount: 2199 },
  { id: 'tx_5', date: '2026-10-02', merchant: 'BESCOM', category: 'Bills', amount: 1840 },
  { id: 'tx_6', date: '2026-10-01', merchant: 'Netflix', category: 'Subscriptions', amount: 649 },
  { id: 'tx_7', date: '2026-09-30', merchant: 'Social, Koramangala', category: 'Food', amount: 1860 },
  { id: 'tx_8', date: '2026-09-29', merchant: 'Decathlon', category: 'Shopping', amount: 3400 },
  { id: 'tx_9', date: '2026-09-28', merchant: 'PVR Cinemas', category: 'Entertainment', amount: 940 },
  { id: 'tx_10', date: '2026-09-27', merchant: 'Uber', category: 'Transport', amount: 310 },
  { id: 'tx_11', date: '2026-09-26', merchant: 'Big Basket', category: 'Food', amount: 2640 },
  { id: 'tx_12', date: '2026-09-24', merchant: 'Apollo Pharmacy', category: 'Healthcare', amount: 560 },
]

export const demoCalendar: CalendarEvent[] = [
  { id: 'cal_salary', date: '2026-10-07', label: 'Salary', amount: 80000, kind: 'income' },
  { id: 'cal_rent', date: '2026-10-10', label: 'Rent', amount: 18000, kind: 'expense' },
  { id: 'cal_sip', date: '2026-10-12', label: 'SIP — Index Fund', amount: 6000, kind: 'expense' },
  { id: 'cal_cc', date: '2026-10-15', label: 'Credit card bill', amount: 8400, kind: 'expense' },
  { id: 'cal_emi', date: '2026-10-18', label: 'Car loan EMI', amount: 9800, kind: 'expense' },
]
