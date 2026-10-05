import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import type { LinkedAccount } from '../../lib/types'

interface LinkedAccountRow {
  id: string
  provider: string
  bank_name: string
  account_mask: string
  status: string
  linked_at: string
}

function rowToAccount(row: LinkedAccountRow): LinkedAccount {
  return {
    id: row.id,
    provider: row.provider as LinkedAccount['provider'],
    bankName: row.bank_name,
    accountMask: row.account_mask,
    status: row.status as LinkedAccount['status'],
    linkedAt: row.linked_at,
  }
}

export function useLinkedAccounts(userId: string | undefined) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) {
      setAccounts([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('linked_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('linked_at', { ascending: false })
    setAccounts(((data as LinkedAccountRow[] | null) ?? []).map(rowToAccount))
    setLoading(false)
  }, [userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const linkAccount = async (bankName: string, accountMask: string) => {
    if (!userId) return
    await supabase.from('linked_accounts').insert({
      user_id: userId,
      provider: 'setu_sandbox',
      bank_name: bankName,
      account_mask: accountMask,
      status: 'active',
    })
    await refresh()
  }

  const unlinkAccount = async (id: string) => {
    await supabase.from('linked_accounts').update({ status: 'revoked' }).eq('id', id)
    await refresh()
  }

  return { accounts, loading, linkAccount, unlinkAccount, refresh }
}
