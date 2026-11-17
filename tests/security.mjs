import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db = new PGlite();
const admin = '11111111-1111-1111-1111-111111111111';
const visitor = '22222222-2222-2222-2222-222222222222';
await db.exec(`
create role anon; create role authenticated;
create schema auth; create schema storage;
create table auth.users(id uuid primary key);
insert into auth.users values ('${admin}'), ('${visitor}');
create function auth.uid() returns uuid language sql stable as
$$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema public, auth, storage to anon, authenticated;
create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
grant select, insert, update, delete on storage.objects to anon, authenticated;
create policy legacy_storage_all on storage.objects for all using (true) with check (true);
`);
let schema = await readFile(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
schema = schema.replace(/do \$\$ begin[\s\S]*?end \$\$;/, ''); // No Realtime extension in this isolated harness.
await db.exec(schema);
await db.exec(`
grant all on public.projects, public.status, public.messages to anon, authenticated;
create policy forgotten_broad_access on public.projects for all using (true) with check (true);
create policy forgotten_status_access on public.status for all using (true) with check (true);
create policy forgotten_chat_access on public.messages for all using (true) with check (true);
`);
const migration = await readFile(new URL('../supabase/migrations/20261117_secure_admin.sql', import.meta.url), 'utf8');
await db.exec(migration);
await db.exec(migration); // Idempotent.
await db.exec(`insert into private.portfolio_admins values ('${admin}');`);
let assertions = 0;
assert.equal((await db.query("select prosecdef from pg_proc where oid='public.is_portfolio_admin()'::regprocedure")).rows[0].prosecdef, false); assertions++;
assert.equal((await db.query("select prosecdef from pg_proc where oid='private.is_portfolio_admin()'::regprocedure")).rows[0].prosecdef, true); assertions++;
async function role(name, id = '') {
  await db.exec(`reset role; set request.jwt.claim.sub = '${id}'; set role ${name};`);
}
async function rejects(sql) { await assert.rejects(db.exec(sql)); assertions++; }
async function empty(sql) { assert.equal((await db.query(sql)).rows.length, 0); assertions++; }
async function allowed(sql) { await db.exec(sql); assertions++; }
const insertProject = `insert into public.projects(title,description,status) values ('Test','Test','planned')`;
await role('anon');
assert.equal((await db.query('select public.is_portfolio_admin() as admin')).rows[0].admin, false); assertions++;
await rejects(insertProject);
await rejects("update public.status set items='[]'");
await rejects('delete from public.messages');
await rejects('truncate public.projects');
await rejects("insert into storage.objects(bucket_id,name) values ('project-images','bad.png')");
await allowed("insert into public.messages(username,message) values ('Visitor','Hello')");
await rejects("insert into public.messages(username,message) values ('Visitor',repeat('x',501))");
await rejects("insert into public.messages(username,message) values ('','Hello')");
await rejects("insert into public.messages(username,message,created_at) values ('Visitor','Hello','2099-01-01')");
await allowed("insert into storage.objects(bucket_id,name) values ('unrelated-bucket','allowed-by-legacy-policy.png')");
await role('authenticated', visitor);
await rejects(insertProject);
await empty("update public.status set items='[]' returning *");
await empty('delete from public.messages returning *');
await rejects('insert into private.portfolio_admins values (auth.uid())');
await rejects('select * from private.portfolio_admins');
await rejects("insert into storage.objects(bucket_id,name) values ('project-images','bad.png')");
await role('authenticated', admin);
assert.equal((await db.query('select public.is_portfolio_admin() as admin')).rows[0].admin, true); assertions++;
await allowed(insertProject);
await allowed("update public.status set items='[{\"text\":\"Updated\"}]'");
await allowed("insert into storage.objects(bucket_id,name) values ('project-images','good.png')");
await allowed("update storage.objects set name='changed.png' where bucket_id='project-images'");
await role('authenticated', visitor);
await empty("update public.projects set title='Attack' returning *");
await empty('delete from public.projects returning *');
await empty("update storage.objects set name='Attack' where bucket_id='project-images' returning *");
await empty("delete from storage.objects where bucket_id='project-images' returning *");
await rejects("update storage.objects set bucket_id='project-images' where bucket_id='unrelated-bucket'");
await role('authenticated', admin);
await allowed('delete from public.messages');
await allowed('delete from public.projects');
await allowed("delete from storage.objects where bucket_id='project-images'");
await db.exec(`reset role; delete from private.portfolio_admins where user_id='${admin}';`);
await role('authenticated', admin);
await rejects(insertProject); // Same token/UUID loses access immediately.
await db.close();
console.log(`Passed ${assertions} isolated database security assertions (including legacy broad policies and immediate revocation).`);
