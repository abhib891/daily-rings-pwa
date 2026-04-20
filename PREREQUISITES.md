# Prerequisites

Install or create the following before you run or deploy **daily-rings-pwa**.

## Required (local development)

| Prerequisite | Version / notes |
|--------------|-----------------|
| **Node.js** | **20 LTS** or **22** (you are on 22.x with nvm; 20 LTS is also fine). [nodejs.org](https://nodejs.org/) |
| **npm** | Ships with Node (9+). |
| **Git** | Any recent version (`git --version`). Xcode Command Line Tools on macOS include Git. |

Verify:

```bash
node -v   # e.g. v22.19.0
npm -v
git --version
```

## Required (sync + auth, iteration 1)

| Prerequisite | Notes |
|--------------|--------|
| **Supabase account** | Free tier is enough: [supabase.com](https://supabase.com). Create a **project**; note **Project URL** and **anon public** key from **Project Settings → API**. |
| **GitHub account** | Repositories live under your user (e.g. [github.com/abhib891](https://github.com/abhib891)). |

After creating a Supabase project, run the SQL in `supabase/migrations/001_initial.sql` in the Supabase SQL editor (or use the Supabase CLI if you prefer). That creates tables and row-level security for multi-device sync.

Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

In the Supabase dashboard, enable **Authentication → Providers** you want (e.g. **Google**, **Email** magic link) and set **URL configuration** redirect URLs for your local and production origins (e.g. `http://localhost:5173`, `https://your-app.vercel.app`).

## Required (create the GitHub remote)

This machine does not need the **GitHub CLI** (`gh`), but you need **some** way to create an empty repo and push:

- **Web:** GitHub → **New repository** → name it (e.g. `daily-rings-pwa`) → do **not** add a README if you will push this folder’s history.
- **CLI (optional):** [Install GitHub CLI](https://cli.github.com/) → `gh auth login` → `gh repo create daily-rings-pwa --public --source=. --remote=origin --push` from the project root after `git init` and first commit.

## Recommended (deploy + PWA on phone)

| Prerequisite | Notes |
|--------------|--------|
| **HTTPS hosting** | Vercel, Netlify, or Cloudflare Pages (free tiers). Connect the GitHub repo; set the same `VITE_*` env vars in the host’s dashboard. **PWA install and auth redirects require HTTPS** (localhost is exempt). |
| **Safari / Chrome** | iPhone: **Share → Add to Home Screen** after the site is deployed on HTTPS. |

## Optional

| Tool | Use |
|------|-----|
| **Supabase CLI** | Local migrations and linked projects: [Supabase CLI docs](https://supabase.com/docs/guides/cli). |
| **nvm / fnm** | Switch Node versions per project. |

## After prerequisites are met

```bash
cd daily-rings-pwa
npm install
npm run dev
```

Open `http://localhost:5173`. App wiring to Supabase (auth + sync UI) is the next implementation step after this scaffold.
