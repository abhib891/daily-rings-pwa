# daily-rings-pwa

Personal **PWA** for daily “rings”–style habits (exercise, read, learn/build, …). Data is in **`localStorage`** for now (per browser / per device). Optional later: **Supabase** for sync (see `supabase/migrations/`).

**Prerequisites:** see [PREREQUISITES.md](./PREREQUISITES.md).  
**Deploy to HTTPS (Vercel — recommended):** [DEPLOY-HOSTS.md](./DEPLOY-HOSTS.md).  
**iPhone + laptop (install + data notes):** [DEPLOY-IPHONE.md](./DEPLOY-IPHONE.md).

## Quick start (local)

```bash
npm install
npm run dev
```

Supabase is **not** required for the current UI. When you add cloud sync, copy `.env.example` to `.env` and configure Supabase.

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

- **Vite** + **React** + **TypeScript** + **`vite-plugin-pwa`** (manifest + service worker in production builds)
- **Supabase** (optional): schema in repo; not wired in the app yet

## License

Private / your choice when you publish the repo.
