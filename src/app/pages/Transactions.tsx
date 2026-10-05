import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Receipt, Repeat, Landmark, Trash2, Pencil, Sparkles } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ConnectBankModal } from '../components/transactions/ConnectBankModal'
import { TransactionFormModal } from '../components/transactions/TransactionFormModal'
import { useProfile } from '../context/ProfileContext'
import { useTransactions } from '../hooks/useTransactions'
import { useLinkedAccounts } from '../hooks/useLinkedAccounts'
import { generateSandboxTransactions } from '../../lib/bankSandbox'
import { formatINR } from '../../hooks/useCountUp'
import type { ExpenseCategory, Transaction } from '../../lib/types'

const CATEGORIES: (ExpenseCategory | 'All')[] = [
  'All',
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

export function Transactions() {
  const { session } = useProfile()
  const userId = session?.user.id
  const { transactions, loading, addTransaction, addManyTransactions, updateTransaction, deleteTransaction } = useTransactions(userId)
  const { accounts, linkAccount, unlinkAccount } = useLinkedAccounts(userId)

  const [filter, setFilter] = useState<ExpenseCategory | 'All'>('All')
  const [connectOpen, setConnectOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const filtered = useMemo(
    () => (filter === 'All' ? transactions : transactions.filter((t) => t.category === filter)),
    [filter, transactions],
  )
  const recurring = useMemo(() => transactions.filter((t) => t.isRecurring), [transactions])
  const totalThisMonth = useMemo(() => {
    const now = new Date()
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return transactions.filter((t) => t.date.startsWith(monthKey)).reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (t: Transaction) => {
    setEditing(t)
    setFormOpen(true)
  }

  const handleSaveTransaction = async (input: Parameters<typeof addTransaction>[0]) => {
    if (editing) {
      await updateTransaction(editing.id, input)
    } else {
      await addTransaction(input)
    }
  }

  const handleConnected = async (bankName: string, accountMask: string) => {
    await linkAccount(bankName, accountMask)
    const sandboxTransactions = generateSandboxTransactions()
    await addManyTransactions(sandboxTransactions, 'bank_sandbox')
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Transactions"
        title="Everything you've spent"
        subtitle="Add transactions manually, or connect a bank account in sandbox mode to see what it looks like with data flowing in."
        action={
          <div className="flex gap-2.5">
            <button
              onClick={() => setConnectOpen(true)}
              className="flex items-center gap-2 rounded-full border border-hairline px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:border-white/25"
            >
              <Landmark size={15} />
              Connect bank
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-[#140a04] transition-transform hover:scale-[1.02]"
            >
              <Plus size={15} />
              Add transaction
            </button>
          </div>
        }
      />

      {accounts.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-hairline bg-card p-5">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-muted">
            <Landmark size={13} /> Linked accounts <span className="text-orange-soft">(sandbox)</span>
          </p>
          {accounts.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-hairline bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-cream">{a.bankName}</p>
                <p className="text-xs text-muted">{a.accountMask} · demo data only</p>
              </div>
              <button
                onClick={() => unlinkAccount(a.id)}
                className="rounded-full border border-hairline px-3.5 py-1.5 text-xs font-medium text-muted hover:text-cream"
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="rounded-2xl border border-hairline bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted">Logged this month</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-cream">₹{formatINR(totalThisMonth)}</p>
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-hairline bg-card px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-muted">
            <Receipt size={20} />
          </span>
          <div>
            <p className="text-sm font-medium text-cream">No transactions yet</p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
              Add one manually, or connect a bank account in sandbox mode to see demo data flow in.
            </p>
          </div>
        </div>
      )}

      {transactions.length > 0 && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filter === c ? 'border-orange/40 bg-orange/10 text-orange-soft' : 'border-hairline text-muted hover:text-cream'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-hairline">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline bg-white/[0.02] text-left text-xs uppercase tracking-[0.06em] text-muted">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Merchant</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Category</th>
                  <th className="px-5 py-3 text-right font-medium">Amount</th>
                  <th className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-hairline/60 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-3.5 text-muted">
                      {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-cream">{t.merchant}</span>
                        {t.isRecurring && (
                          <span className="flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 text-[10px] text-muted">
                            <Repeat size={9} /> {t.recurrence}
                          </span>
                        )}
                        {t.source === 'bank_sandbox' && (
                          <span className="flex items-center gap-1 rounded-full border border-orange/25 bg-orange/[0.06] px-2 py-0.5 text-[10px] text-orange-soft">
                            <Sparkles size={9} /> Sandbox
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 text-muted sm:table-cell">{t.category}</td>
                    <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-cream">₹{formatINR(t.amount)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(t)}
                          aria-label={`Edit ${t.merchant}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-cream"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          aria-label={`Delete ${t.merchant}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-orange-soft"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="rounded-2xl border border-hairline bg-card p-6">
        <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-cream">
          <Repeat size={15} className="text-orange-soft" />
          Recurring
        </p>
        <p className="mb-5 text-xs text-muted">Rent, subscriptions and other charges you've marked as repeating.</p>

        {recurring.length === 0 ? (
          <p className="text-sm text-muted">Nothing marked as recurring yet — toggle it on when adding a transaction.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recurring.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex items-center justify-between gap-4 rounded-xl border border-hairline bg-white/[0.02] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-cream">{t.merchant}</p>
                  <p className="text-xs text-muted capitalize">{t.recurrence} · {t.category}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-cream">₹{formatINR(t.amount)}</p>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <ConnectBankModal open={connectOpen} onClose={() => setConnectOpen(false)} onConnected={handleConnected} />
      <TransactionFormModal open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSaveTransaction} editing={editing} />
    </div>
  )
}
