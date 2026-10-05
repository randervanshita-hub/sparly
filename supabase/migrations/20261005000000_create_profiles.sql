-- Sparly: financial profile per authenticated user, replacing the
-- localStorage-based demo "profile" with real per-user persistence.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  onboarded boolean not null default false,
  take_home_income numeric not null default 80000,
  income_frequency text not null default 'monthly',
  current_savings numeric not null default 0,
  current_investments numeric not null default 0,
  fixed_expenses numeric not null default 0,
  variable_expenses numeric not null default 0,
  monthly_debt numeric not null default 0,
  emergency_fund numeric not null default 0,
  motivations text[] not null default '{}',
  help_preferences text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Keep updated_at current on every write.
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Auto-create a (not yet onboarded) profile row the moment someone signs up,
-- so the app never has to handle a "no profile exists yet" edge case.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
