-- Obsolete: run migrations/20261117_secure_admin.sql instead.
-- Never grant anonymous DELETE on messages.
drop policy if exists "Anyone can delete messages" on public.messages;
