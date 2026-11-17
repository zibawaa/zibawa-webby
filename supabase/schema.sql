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

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime'
    and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;

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

-- Writes are granted by the hardening migration only.

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

-- Next run migrations/20261117_secure_admin.sql before exposing the API.
-- Public images remain readable; uploads require an authorised admin.
