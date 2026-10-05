import { useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import type { ExpenseCategory, RecurrenceCadence, Transaction } from '../../../lib/types'
import type { NewTransactionInput } from '../../hooks/useTransactions'

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Travel',
  'Healthcare',
  'Subscriptions',
  'Rent',
  'Other',
]

const CADENCES: RecurrenceCadence[] = ['weekly', 'monthly', 'yearly']

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

interface TransactionFormModalProps {
  open: boolean
  onClose: () => void
  onSave: (input: NewTransactionInput) => Promise<void>
  editing?: Transaction | null
}

export function TransactionFormModal({ open, onClose, onSave, editing }: TransactionFormModalProps) {
  const [date, setDate] = useState(todayISO())
  const [merchant, setMerchant] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food')
  const [amount, setAmount] = useState(0)
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrence, setRecurrence] = useState<RecurrenceCadence>('monthly')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    if (editing) {
      setDate(editing.date)
      setMerchant(editing.merchant)
      setCategory(editing.category)
      setAmount(editing.amount)
      setIsRecurring(editing.isRecurring)
      setRecurrence(editing.recurrence ?? 'monthly')
    } else {
      setDate(todayISO())
      setMerchant('')
      setCategory('Food')
      setAmount(0)
      setIsRecurring(false)
      setRecurrence('monthly')
    }
  }, [open, editing])

  const valid = merchant.trim().length > 0 && amount > 0

  const handleSave = async () => {
    if (!valid) return
    setSaving(true)
    await onSave({ date, merchant: merchant.trim(), category, amount, isRecurring, recurrence: isRecurring ? recurrence : null })
    setSaving(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit transaction' : 'Add a transaction'}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Date</span>
            <input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-2.5 text-sm text-cream focus:outline-none focus:border-white/25"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-muted">Amount</span>
            <div className="flex items-center gap-1.5 rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-2.5 focus-within:border-white/25">
              <span className="text-cream/60">₹</span>
              <input
                type="number"
                min={1}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-transparent text-sm text-cream focus:outline-none"
              />
            </div>
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Merchant / label</span>
          <input
            type="text"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="e.g. Landlord, Local grocery store"
            className="rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-white/25"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-muted">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="rounded-xl border border-hairline bg-white/[0.02] px-3.5 py-2.5 text-sm text-cream focus:outline-none focus:border-white/25"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-hairline bg-white/[0.02] p-3.5">
          <label className="flex items-center justify-between">
            <span className="text-sm text-cream/90">This repeats (e.g. rent, subscription)</span>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 accent-[#FF7A24]"
            />
          </label>
          {isRecurring && (
            <div className="mt-3 flex gap-2">
              {CADENCES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setRecurrence(c)}
                  className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    recurrence === c ? 'border-orange/40 bg-orange/10 text-orange-soft' : 'border-hairline text-muted'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={!valid || saving}
          className="mt-1 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add transaction'}
        </button>
      </div>
    </Modal>
  )
}
