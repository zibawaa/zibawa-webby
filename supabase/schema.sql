-- Zibawa Webby: Supabase schema
-- Run this in the Supabase SQL Editor.

-- ============================================================
-- 1. MESSAGES TABLE (global chat)
-- ============================================================
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  username   text not null,
  message    text not null
);

alter table public.messages enable row level security;

create policy "Anyone can read messages"
  on public.messages for select using (true);

create policy "Anyone can insert messages"
  on public.messages for insert with check (true);

alter publication supabase_realtime add table public.messages;

create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- ============================================================
-- 2. STATUS TABLE (currently working on — single row)
-- ============================================================
create table if not exists public.status (
  id         int primary key default 1 check (id = 1),
  items      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.status enable row level security;

-- Anyone can read
create policy "Anyone can read status"
  on public.status for select using (true);

-- Anyone can update (admin password checked client-side)
create policy "Anyone can update status"
  on public.status for update using (true);

-- Anyone can insert (for the initial seed row)
create policy "Anyone can insert status"
  on public.status for insert with check (true);

-- Seed the single row
insert into public.status (id, items)
values (1, '[{"text":"Building out this portfolio site with live chat"},{"text":"Polishing Trackademic for public demo"}]')
on conflict (id) do nothing;
