-- Real per-user transactions: manually entered now, with `source` left in
-- place so a future bank-sandbox import can write into the same table
-- without a schema change.

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  merchant text not null,
  category text not null,
  amount numeric not null check (amount > 0),
  is_recurring boolean not null default false,
  recurrence text check (recurrence in ('weekly', 'monthly', 'yearly') or recurrence is null),
  source text not null default 'manual' check (source in ('manual', 'bank_sandbox')),
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

create index if not exists transactions_user_date_idx on public.transactions (user_id, date desc);

-- A user's linked bank accounts (currently only ever sandbox/demo data —
-- see src/lib/bankSandbox.ts for the explicit disclosure shown in the UI).
create table if not exists public.linked_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'setu_sandbox',
  bank_name text not null,
  account_mask text not null,
  status text not null default 'active' check (status in ('active', 'revoked')),
  linked_at timestamptz not null default now()
);

alter table public.linked_accounts enable row level security;

create policy "Users can view their own linked accounts"
  on public.linked_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own linked accounts"
  on public.linked_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own linked accounts"
  on public.linked_accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own linked accounts"
  on public.linked_accounts for delete
  using (auth.uid() = user_id);
