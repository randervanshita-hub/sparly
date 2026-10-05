-- Lets users edit individual auto-generated goals (target/current amount,
-- monthly contribution) without redoing the whole onboarding flow. Keyed by
-- goal id (see userModel.ts), only the fields a user has actually changed
-- are stored.
alter table public.profiles
  add column if not exists goal_overrides jsonb not null default '{}'::jsonb;
