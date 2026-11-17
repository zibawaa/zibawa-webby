-- Run using the Supabase SQL editor/database owner, not the browser key.
-- Preserves all rows. Take a backup and review existing policies first.
begin;
create schema if not exists private;
create table if not exists private.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
revoke all on private.portfolio_admins from public, anon, authenticated;
alter table private.portfolio_admins enable row level security;

-- The allowlist is database-owned, not user-editable metadata or browser state.
create or replace function private.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select (select auth.uid()) is not null and exists (
  select 1 from private.portfolio_admins where user_id = (select auth.uid())
); $$;
revoke all on function private.is_portfolio_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_portfolio_admin() to anon, authenticated;

-- Expose only an invoker wrapper for the frontend RPC. Keep private out of the
-- Data API exposed schemas; schema USAGE does not grant access to its tables.
create or replace function public.is_portfolio_admin()
returns boolean language sql stable security invoker set search_path = ''
as $$ select private.is_portfolio_admin(); $$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

-- Restrictive write guards also block any forgotten broad permissive policies.
-- They do not restrict public SELECT or change policies on unrelated tables.
do $$
declare t text; op text; p text;
begin
  foreach t in array array['projects','status','messages'] loop
    execute format('alter table public.%I enable row level security', t);
    for p in select policyname from pg_policies
      where schemaname='public' and tablename=t and policyname like 'Anyone can %'
    loop
      execute format('drop policy %I on public.%I', p, t);
    end loop;
    execute format('drop policy if exists portfolio_public_read on public.%I', t);
    execute format('create policy portfolio_public_read on public.%I for select to anon, authenticated using (true)', t);
    foreach op in array array['insert','update','delete'] loop
      if t = 'messages' and op = 'insert' then continue; end if;
      execute format('drop policy if exists portfolio_admin_%s on public.%I', op, t);
      execute format('drop policy if exists portfolio_guard_%s on public.%I', op, t);
      if op = 'insert' then
        execute format('create policy portfolio_admin_insert on public.%I for insert to authenticated with check ((select private.is_portfolio_admin()))', t);
        execute format('create policy portfolio_guard_insert on public.%I as restrictive for insert to public with check ((select private.is_portfolio_admin()))', t);
      elsif op = 'update' then
        execute format('create policy portfolio_admin_update on public.%I for update to authenticated using ((select private.is_portfolio_admin())) with check ((select private.is_portfolio_admin()))', t);
        execute format('create policy portfolio_guard_update on public.%I as restrictive for update to public using ((select private.is_portfolio_admin())) with check ((select private.is_portfolio_admin()))', t);
      else
        execute format('create policy portfolio_admin_delete on public.%I for delete to authenticated using ((select private.is_portfolio_admin()))', t);
        execute format('create policy portfolio_guard_delete on public.%I as restrictive for delete to public using ((select private.is_portfolio_admin()))', t);
      end if;
    end loop;
  end loop;
end $$;

grant select on public.projects, public.status, public.messages to anon, authenticated;
grant insert on public.messages to anon, authenticated;
grant insert, update, delete on public.projects, public.status, public.messages to authenticated;
-- REVOKE is defense in depth, independent of RLS.
revoke insert, update, delete, truncate on public.projects, public.status from anon;
revoke update, delete, truncate on public.messages from anon;
revoke truncate on public.projects, public.status, public.messages from public, authenticated;

drop policy if exists portfolio_chat_insert on public.messages;
create policy portfolio_chat_insert on public.messages for insert to anon, authenticated
  with check (true);
drop policy if exists portfolio_chat_limits on public.messages;
create policy portfolio_chat_limits on public.messages as restrictive for insert to public
  with check (char_length(btrim(username)) between 1 and 40
    and char_length(btrim(message)) between 1 and 500
    and created_at between now() - interval '1 minute' and now() + interval '1 minute');

-- Keep other buckets untouched. Existing permissive storage policies cannot
-- bypass these restrictive guards for the portfolio bucket.
do $$
declare op text; condition text := '(bucket_id <> ''project-images'' or (select private.is_portfolio_admin()))';
begin
  foreach op in array array['insert','update','delete'] loop
    execute format('drop policy if exists portfolio_image_guard_%s on storage.objects', op);
    execute format('drop policy if exists portfolio_image_admin_%s on storage.objects', op);
    if op = 'insert' then
      execute format('create policy portfolio_image_guard_insert on storage.objects as restrictive for insert to public with check (%s)', condition);
      execute 'create policy portfolio_image_admin_insert on storage.objects for insert to authenticated with check (bucket_id = ''project-images'' and (select private.is_portfolio_admin()))';
    elsif op = 'update' then
      execute format('create policy portfolio_image_guard_update on storage.objects as restrictive for update to public using (%s) with check (%s)', condition, condition);
      execute 'create policy portfolio_image_admin_update on storage.objects for update to authenticated using (bucket_id = ''project-images'' and (select private.is_portfolio_admin())) with check (bucket_id = ''project-images'' and (select private.is_portfolio_admin()))';
    else
      execute format('create policy portfolio_image_guard_delete on storage.objects as restrictive for delete to public using (%s)', condition);
      execute 'create policy portfolio_image_admin_delete on storage.objects for delete to authenticated using (bucket_id = ''project-images'' and (select private.is_portfolio_admin()))';
    end if;
  end loop;
end $$;
drop policy if exists portfolio_image_read on storage.objects;
create policy portfolio_image_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');
commit;
