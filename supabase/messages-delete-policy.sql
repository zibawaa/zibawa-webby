-- Run this in Supabase SQL Editor to enable clearing chat messages.
create policy "Anyone can delete messages"
  on public.messages for delete using (true);
