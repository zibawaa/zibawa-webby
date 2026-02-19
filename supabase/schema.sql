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

-- ============================================================
-- 3. PROJECTS TABLE (admin-managed project cards)
-- ============================================================
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text not null,
  tags        text[] not null default '{}',
  status      text not null check (status in ('completed','in-progress','planned')),
  github_url  text,
  live_url   text,
  image       text,
  featured    boolean not null default false
);

alter table public.projects enable row level security;

create policy "Anyone can read projects"
  on public.projects for select using (true);

create policy "Anyone can insert projects"
  on public.projects for insert with check (true);

create policy "Anyone can update projects"
  on public.projects for update using (true);

create policy "Anyone can delete projects"
  on public.projects for delete using (true);

-- ============================================================
-- 4. STORAGE BUCKET (project images)
-- ============================================================
-- Create via Supabase Dashboard: Storage > New bucket
--   Name: project-images
--   Public bucket: ON (so images are publicly accessible)
-- Add policy: Storage > project-images > Policies > New policy
--   Policy name: Public read
--   Allowed operation: SELECT (read)
--   Target: All users
--   USING expression: true
