// Simulated bank-connect flow: no real Account Aggregator (AA) integration
// is wired up. Going live with real bank data requires becoming a client of
// an AA provider (e.g. Setu, Finvu) — a business KYB + legal-agreement
// process, not something that can be done from inside this app. Every
// transaction generated here is clearly fake and tagged source:'bank_sandbox'
// so it's never confused with manually-entered real data.
import type { ExpenseCategory, RecurrenceCadence } from './types'
import type { NewTransactionInput } from '../app/hooks/useTransactions'

export interface SandboxBank {
  id: string
  name: string
  color: string
}

export const SANDBOX_BANKS: SandboxBank[] = [
  { id: 'hdfc', name: 'HDFC Bank', color: '#004c8f' },
  { id: 'icici', name: 'ICICI Bank', color: '#aa202e' },
  { id: 'sbi', name: 'State Bank of India', color: '#22559c' },
  { id: 'axis', name: 'Axis Bank', color: '#97144d' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', color: '#ed1c24' },
  { id: 'yes', name: 'Yes Bank', color: '#004b8d' },
]

function maskedAccountNumber(): string {
  const last4 = Math.floor(1000 + Math.random() * 9000)
  return `•••• ${last4}`
}

export function connectSandboxBank(bankId: string): { bankName: string; accountMask: string } {
  const bank = SANDBOX_BANKS.find((b) => b.id === bankId) ?? SANDBOX_BANKS[0]
  return { bankName: bank.name, accountMask: maskedAccountNumber() }
}

interface MockMerchant {
  merchant: string
  category: ExpenseCategory
  min: number
  max: number
}

const ONE_OFF_MERCHANTS: MockMerchant[] = [
  { merchant: 'Zomato', category: 'Food', min: 250, max: 850 },
  { merchant: 'Swiggy', category: 'Food', min: 200, max: 700 },
  { merchant: 'Big Basket', category: 'Food', min: 800, max: 2800 },
  { merchant: 'Uber', category: 'Transport', min: 120, max: 450 },
  { merchant: 'Ola', category: 'Transport', min: 100, max: 400 },
  { merchant: 'Amazon', category: 'Shopping', min: 400, max: 4500 },
  { merchant: 'Myntra', category: 'Shopping', min: 600, max: 3200 },
  { merchant: 'PVR Cinemas', category: 'Entertainment', min: 300, max: 900 },
  { merchant: 'Apollo Pharmacy', category: 'Healthcare', min: 150, max: 1200 },
  { merchant: 'IRCTC', category: 'Travel', min: 500, max: 3500 },
  { merchant: 'BESCOM', category: 'Bills', min: 1200, max: 2600 },
]

const RECURRING_MERCHANTS: { merchant: string; category: ExpenseCategory; amount: number }[] = [
  { merchant: 'Netflix', category: 'Subscriptions', amount: 649 },
  { merchant: 'Spotify', category: 'Subscriptions', amount: 119 },
  { merchant: 'Jio Fiber', category: 'Bills', amount: 999 },
]

function randomInt(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// Produces ~45 days of plausible-looking mock history for a freshly
// "connected" sandbox account — never real activity.
export function generateSandboxTransactions(today: Date = new Date()): NewTransactionInput[] {
  const transactions: NewTransactionInput[] = []

  for (let i = 0; i < 18; i++) {
    const daysAgo = randomInt(0, 45)
    const date = new Date(today)
    date.setDate(date.getDate() - daysAgo)
    const m = ONE_OFF_MERCHANTS[randomInt(0, ONE_OFF_MERCHANTS.length - 1)]
    transactions.push({
      date: isoDate(date),
      merchant: m.merchant,
      category: m.category,
      amount: randomInt(m.min, m.max),
      isRecurring: false,
      recurrence: null,
    })
  }

  for (const r of RECURRING_MERCHANTS) {
    const date = new Date(today)
    date.setDate(date.getDate() - randomInt(0, 28))
    transactions.push({
      date: isoDate(date),
      merchant: r.merchant,
      category: r.category,
      amount: r.amount,
      isRecurring: true,
      recurrence: 'monthly' as RecurrenceCadence,
    })
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date))
}
