-- Task 4 (assignment): anonymous landing-page visitors can try "Where does
-- my salary go?" without an account. The serverless function (service role
-- key, server-side only) reads/writes this table directly, so RLS stays
-- fully locked down — no public policies are needed or granted.
create table if not exists public.salary_plan_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  visitor_id text not null,
  input jsonb not null,
  output text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  identified_saving numeric
);

alter table public.salary_plan_requests enable row level security;
-- Intentionally no policies: only the service role (server-side function)
-- may read or write this table; it is not exposed to the browser client.

create index if not exists salary_plan_requests_visitor_idx on public.salary_plan_requests (visitor_id, created_at desc);
