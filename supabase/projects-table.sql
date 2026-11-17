-- Run this in Supabase SQL Editor if you get 404 errors on projects.
-- Creates the projects table and policies.

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text not null,
  tags        text[] not null default '{}',
  status      text not null check (status in ('completed','in-progress','planned')),
  github_url  text,
  live_url    text,
  image       text,
  featured    boolean not null default false
);

alter table public.projects enable row level security;

-- Next run migrations/20261117_secure_admin.sql. No public write policies.
