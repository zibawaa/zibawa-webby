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
4. **Storage bucket for project images**: Go to **Storage → New bucket**. Create a bucket named `project-images` and enable **Public bucket**. Add policies: (a) allow `SELECT` for all users (public read); (b) allow `INSERT` for all users (so admin can upload).
5. Copy your project URL and anon key into `.env`.

## Admin Panel

Log in with the Admin button (password: `zibawa2026`) to:

- **Status**: Edit the "Currently Working On" items (saved globally).
- **Projects**: Add, edit, or delete project cards. Upload images, set title, description, tags, status, GitHub/Live URLs, and featured flag.

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
