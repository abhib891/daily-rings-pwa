# daily-rings-pwa

## What this is

A small **personal habit tracker** inspired by Apple Watch–style **rings**: mark each day whether you did things like **exercise**, **read**, and **learn / build** (you can add more habits). There is a **past week** grid and a **“don’t miss twice”** style hint when a habit is at risk after you already have history.

- **Local-only mode:** if Supabase env vars are missing, data lives in the browser’s **`localStorage`** (per device / per browser).
- **Synced mode (recommended):** sign in with **Google** or **email magic link**; habits and completions are stored in **Supabase** so the same account sees the same data on **phone, laptop, and any browser** (see [SUPABASE-SYNC.md](./SUPABASE-SYNC.md)).

**Source repo:** [github.com/abhib891/daily-rings-pwa](https://github.com/abhib891/daily-rings-pwa)

**Production URL (Vercel):** [https://daily-rings-pwa-9g3x.vercel.app](https://daily-rings-pwa-9g3x.vercel.app)

> If your Vercel project name or domain changes, update this line. The canonical URL is always under **Vercel → your project → Domains** (or the latest **Production** deployment).

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | **React 19** + **TypeScript** |
| Build / dev | **Vite 8** |
| Styling | **CSS** (no UI framework) |
| PWA | **`vite-plugin-pwa`** (manifest + service worker in production builds) |
| Backend (optional) | **Supabase** — Postgres tables `habits` + `day_entries`, **Row Level Security**, **Auth** (Google / email OTP), RPC `ensure_default_habits()` for safe default seeding |
| Client SDK | **`@supabase/supabase-js`** |
| Hosting | **Vercel** (static `dist/`); env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`) |

**SQL migrations:** `supabase/migrations/` (`001_initial.sql`, `002_ensure_default_habits_rpc.sql`, `003_dedupe_habits_rpc.sql`).

---

## Docs in this repo

| Doc | Purpose |
|-----|--------|
| [PREREQUISITES.md](./PREREQUISITES.md) | Machine + Supabase + Git prerequisites |
| [DEPLOY-HOSTS.md](./DEPLOY-HOSTS.md) | Deploy to HTTPS on **Vercel** |
| [DEPLOY-IPHONE.md](./DEPLOY-IPHONE.md) | Add to Home Screen, storage notes |
| [SUPABASE-SYNC.md](./SUPABASE-SYNC.md) | Auth URLs, env vars, SQL order, dedupe |
| [LOCAL.md](./LOCAL.md) | Run without cloud |

---

## Quick start (local)

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. For cloud sync locally, copy `.env.example` → `.env` and fill Supabase URL + key.

---

## License

Private / your choice when you publish the repo.
