# daily-rings-pwa

Personal **PWA** for daily “rings”–style habits (exercise, read, learn/build, …).

- **Without Supabase env vars:** data stays in **`localStorage`** (per browser / device).
- **With Supabase (recommended):** sign in with **Google** or **email magic link** — habits and rings **sync everywhere** (see [SUPABASE-SYNC.md](./SUPABASE-SYNC.md)).

**Prerequisites:** see [PREREQUISITES.md](./PREREQUISITES.md).  
**Deploy to HTTPS (Vercel — recommended):** [DEPLOY-HOSTS.md](./DEPLOY-HOSTS.md).  
**iPhone + laptop (install + data notes):** [DEPLOY-IPHONE.md](./DEPLOY-IPHONE.md).

## Quick start (local)

```bash
npm install
npm run dev
```

Supabase is **optional** until you set **`VITE_SUPABASE_*`** on the host (or in `.env` locally). Then the UI switches to **sign-in + cloud sync**.

## Supabase schema (optional / future)

Run `supabase/migrations/001_initial.sql` in the Supabase SQL editor for v1 tables and RLS.

## Put this on GitHub (abhib891)

If this folder is not yet a remote repo:

1. Create an empty repository on GitHub: [github.com/new](https://github.com/new) (e.g. `daily-rings-pwa`).
2. From this directory:

```bash
git init
git add .
git commit -m "Initial scaffold: Vite React TS, Supabase SQL, prereqs"
git branch -M main
git remote add origin https://github.com/abhib891/daily-rings-pwa.git
git push -u origin main
```

Replace the remote URL if your repo name differs.

## Stack

- **Vite** + **React** + **TypeScript** + **`vite-plugin-pwa`**
- **Supabase** (`@supabase/supabase-js`): optional sync + auth when `VITE_SUPABASE_*` is set

## License

Private / your choice when you publish the repo.
