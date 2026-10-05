import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { ExpenseCategory, RecurrenceCadence, Transaction, TransactionSource } from '../../lib/types'

interface TransactionRow {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  is_recurring: boolean
  recurrence: string | null
  source: string
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    merchant: row.merchant,
    category: row.category as ExpenseCategory,
    amount: Number(row.amount),
    isRecurring: row.is_recurring,
    recurrence: row.recurrence as RecurrenceCadence | null,
    source: row.source as TransactionSource,
  }
}

export interface NewTransactionInput {
  date: string
  merchant: string
  category: ExpenseCategory
  amount: number
  isRecurring: boolean
  recurrence: RecurrenceCadence | null
}

export function useTransactions(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) {
      setTransactions([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false })
    setTransactions(((data as TransactionRow[] | null) ?? []).map(rowToTransaction))
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addTransaction = async (input: NewTransactionInput, source: TransactionSource = 'manual') => {
    if (!userId) return
    await supabase.from('transactions').insert({
      user_id: userId,
      date: input.date,
      merchant: input.merchant,
      category: input.category,
      amount: input.amount,
      is_recurring: input.isRecurring,
      recurrence: input.isRecurring ? input.recurrence : null,
      source,
    })
    await refresh()
  }

  const addManyTransactions = async (inputs: NewTransactionInput[], source: TransactionSource) => {
    if (!userId || inputs.length === 0) return
    await supabase.from('transactions').insert(
      inputs.map((input) => ({
        user_id: userId,
        date: input.date,
        merchant: input.merchant,
        category: input.category,
        amount: input.amount,
        is_recurring: input.isRecurring,
        recurrence: input.isRecurring ? input.recurrence : null,
        source,
      })),
    )
    await refresh()
  }

  const updateTransaction = async (id: string, patch: Partial<NewTransactionInput>) => {
    const row: Record<string, unknown> = {}
    if (patch.date !== undefined) row.date = patch.date
    if (patch.merchant !== undefined) row.merchant = patch.merchant
    if (patch.category !== undefined) row.category = patch.category
    if (patch.amount !== undefined) row.amount = patch.amount
    if (patch.isRecurring !== undefined) row.is_recurring = patch.isRecurring
    if (patch.recurrence !== undefined) row.recurrence = patch.isRecurring === false ? null : patch.recurrence
    await supabase.from('transactions').update(row).eq('id', id)
    await refresh()
  }

  const deleteTransaction = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id)
    await refresh()
  }

  return { transactions, loading, addTransaction, addManyTransactions, updateTransaction, deleteTransaction, refresh }
}
