-- Zibawa Webby: Supabase schema for global chat
-- Run this in the Supabase SQL Editor to set up the messages table.

-- 1. Create the messages table
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  username   text not null,
  message    text not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.messages enable row level security;

-- 3. Allow anyone to read messages (anon + authenticated)
create policy "Anyone can read messages"
  on public.messages
  for select
  using (true);

-- 4. Allow anyone to insert messages (anon + authenticated)
create policy "Anyone can insert messages"
  on public.messages
  for insert
  with check (true);

-- 5. Enable Realtime for the messages table
--    Go to Supabase Dashboard > Database > Replication and make sure the
--    "messages" table is included in the supabase_realtime publication.
--    Alternatively, run:
alter publication supabase_realtime add table public.messages;

-- 6. Optional: index on created_at for faster ordering
create index if not exists messages_created_at_idx on public.messages (created_at desc);
