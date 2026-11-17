# Zibawa Webby

A fast, static portfolio website with real-time global chat. Built with React, TypeScript, Tailwind CSS, and Supabase.

Deployed on **GitHub Pages** — chat powered by **Supabase Realtime**.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and fill in your Supabase credentials
cp .env.example .env

# 3. Start development server
npm run dev
```

## Environment Variables

Create a `.env` file (never commit it):

| Variable                  | Description                      |
| ------------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase project URL        |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous API key  |

The site works without these — chat will simply be disabled.

## Editing Content

### Projects

Edit `src/content/projects.json`. Each project object:

```json
{
  "id": "unique-slug",
  "title": "Project Title",
  "description": "Short description of the project.",
  "tags": ["React", "TypeScript"],
  "status": "completed",
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://...",
  "image": "/screenshots/project.png",
  "featured": true
}
```

| Field       | Required | Notes                                      |
| ----------- | -------- | ------------------------------------------ |
| `id`        | Yes      | Unique identifier                          |
| `title`     | Yes      | Display name                               |
| `description` | Yes   | Brief summary                              |
| `tags`      | Yes      | Array of technology tags                   |
| `status`    | Yes      | `"completed"`, `"in-progress"`, or `"planned"` |
| `githubUrl` | No       | Link to source code                        |
| `liveUrl`   | No       | Link to live demo                          |
| `image`     | No       | Path or URL to screenshot                  |
| `featured`  | No       | Show on homepage if `true`                 |

### Updates

Edit `src/content/updates.json`. Each update object:

```json
{
  "id": "update-001",
  "date": "2026-02-17",
  "title": "Update title",
  "body": "Description of what happened.",
  "projectId": "related-project-id"
}
```

| Field       | Required | Notes                          |
| ----------- | -------- | ------------------------------ |
| `id`        | Yes      | Unique identifier              |
| `date`      | Yes      | ISO date string                |
| `title`     | Yes      | Headline                       |
| `body`      | Yes      | Description text               |
| `projectId` | No       | Link to a project by its `id`  |

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run `supabase/schema.sql`.
3. Go to **Database → Replication** and confirm `messages` is in the `supabase_realtime` publication.
4. Run `supabase/migrations/20261117_secure_admin.sql` using the SQL Editor before exposing the database API.
5. Create the `project-images` bucket if needed (public read is fine). Do **not** add public write policies.
6. Copy only the project URL and **anon/publishable** key into `.env`. Never use a service-role key in `VITE_*` variables.

## Admin access and security rollout

The old shared browser password has been removed. Supabase Auth verifies the email/password; database RLS, not the UI, enforces access. A normal signed-in user is **not** an admin.

For an existing deployment:

1. Back up the database and inspect existing data/policies for unexpected changes. This patch does not establish whether an incident occurred.
2. Apply `supabase/migrations/20261117_secure_admin.sql` to the correct Supabase project with the SQL Editor as database owner. It keeps existing rows, blocks public admin writes/deletes and guards image uploads. It can be rerun.
3. Create or identify your own verified Supabase Auth user through the dashboard. Set a new unique password there; never commit it or paste it into source code. If the previously exposed password was used anywhere else, change it there too.
4. In the SQL Editor, explicitly grant only that verified user's UUID:

   ```sql
   insert into private.portfolio_admins (user_id)
   values ('REPLACE_WITH_VERIFIED_AUTH_USER_UUID'::uuid)
   on conflict do nothing;
   ```

   To revoke access, delete that UUID from this private table. The database checks the allowlist on each request, so browser flags and ordinary user metadata cannot grant privileges.
5. Deploy the frontend fix and sign in using the Admin button with that account's email and password.
6. Validate anonymous and non-admin accounts cannot mutate projects/status, clear messages, or upload project images; validate the approved admin can. Use disposable staging data first. Check the currently deployed policies, not merely this repository.

**Merging/deploying frontend code does not apply SQL to the live database.** Until step 2 is complete, existing unsafe policies remain active. Do not claim the live site is secure from a code-only deployment.

Public chat remains anonymous by design and is subject to database-enforced size/timestamp bounds, but this is **not** an anti-spam rate limiter. Add a server/Edge Function with rate limiting and bot protection before exposing chat to untrusted high-volume traffic. Historical Git commits retain the removed password; it must be treated as permanently compromised, not reused.

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. This is a fully static site ready for GitHub Pages.

## GitHub Pages Deployment

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`).

### Setup steps:

1. Go to your repo **Settings → Pages** and set Source to **GitHub Actions**.
2. Go to **Settings → Secrets and variables → Actions** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Push to `main` — the workflow builds and deploys automatically.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (build tool)
- **Tailwind CSS 4** (styling)
- **React Router 7** (client-side routing via HashRouter)
- **Framer Motion** (animations)
- **Supabase** (Postgres + Realtime for chat)
- **Lucide React** (icons)

## License

MIT
