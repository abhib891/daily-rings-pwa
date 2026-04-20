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
| Backend (optional) | **Supabase** — Postgres tables `habits` + `day_entries`, **Row Level Security**, **Auth** (Google / email OTP), RPCs `ensure_default_habits()` and `dedupe_habits()` |
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
| (this file, [Cleanup and teardown](#cleanup-and-teardown)) | Delete Vercel / Supabase / OAuth / PWA when you are done |

---

## Quick start (local)

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. For cloud sync locally, copy `.env.example` → `.env` and fill Supabase URL + key.

---

## Cleanup and teardown

Use this when you want to **shut the project down**, **stop paying** (if you ever upgrade tiers), or **remove your data** from hosted services. Order is flexible; the important part is **export first** if you care about history.

1. **Export data (optional)**  
   In **Supabase → Table Editor** (or **SQL Editor**), export or copy rows from `habits` and `day_entries` if you want a record. There is no built-in “download my data” button in the app.

2. **Vercel**  
   **Project → Settings → General → Delete Project** (or disconnect the Git repo if you only want to stop auto-deploys). That removes the live URL and build env vars (`VITE_SUPABASE_*`). Custom domains: remove them under **Domains** first if they point here.

3. **Supabase**  
   **Project Settings → General → Pause project** (temporary) or **Delete project** (permanent: Postgres, Auth users, Storage, and keys are destroyed). Deleting the project invalidates the old URL and anon key, so any leftover env references become harmless.

4. **Google Cloud (if you use Google sign-in)**  
   In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**, delete or disable the **OAuth 2.0 Client ID** you created for this app so that client id/secret are no longer valid. You can leave or delete the consent screen project depending on whether anything else uses it.

5. **Supabase Auth / URLs**  
   After teardown you usually do not need to edit Supabase **Redirect URLs**—the project is gone. If you **keep** Supabase but remove only Vercel, update **Authentication → URL configuration** so production redirect URLs do not still list a dead domain.

6. **Phone / PWA**  
   Remove the **Add to Home Screen** icon like any other website; optionally clear **Safari / Chrome → Website data** for the old hostname so cached service workers go away.

7. **This README**  
   If you fork or reuse the repo, update **Production URL**, **Source repo**, and links in [SUPABASE-SYNC.md](./SUPABASE-SYNC.md) that still mention old Vercel hostnames.

---

## License

Private / your choice when you publish the repo.
