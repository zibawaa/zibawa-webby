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

drop policy if exists "Anyone can read projects" on public.projects;
create policy "Anyone can read projects"
  on public.projects for select using (true);

drop policy if exists "Anyone can insert projects" on public.projects;
create policy "Anyone can insert projects"
  on public.projects for insert with check (true);

drop policy if exists "Anyone can update projects" on public.projects;
create policy "Anyone can update projects"
  on public.projects for update using (true);

drop policy if exists "Anyone can delete projects" on public.projects;
create policy "Anyone can delete projects"
  on public.projects for delete using (true);
