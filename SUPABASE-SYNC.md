# Cross-device sync (Supabase)

When **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** are set (e.g. on [Vercel](https://vercel.com) → Project → **Settings** → **Environment Variables**), the app shows **sign-in** and stores habits + completions in **Supabase** instead of only `localStorage`. The same account sees the same data in **Chrome, Safari, phone, and laptop**.

## 1. Create a Supabase project

1. [supabase.com](https://supabase.com) → **New project** → wait until it is ready.
2. **Project Settings** → **API** → copy **Project URL** and **`anon` `public`** key.

## 2. Create tables (once)

In the Supabase **SQL Editor**, run the full script in:

**[`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql)**

That creates `habits` and `day_entries` with **Row Level Security** so each user only sees their own rows.

## 3. Auth settings (required)

**Authentication** → **URL configuration**:

| Field | Example |
|--------|---------|
| **Site URL** | `https://daily-rings-pwa-ab891.vercel.app` (your real Vercel URL) |
| **Redirect URLs** | Same URL, plus `http://localhost:5173/**` for local dev |

Add each **origin** you use (production + localhost). Magic links and OAuth return to these URLs.

**Authentication** → **Providers**:

- Enable **Email** (magic links).
- Optional: **Google** — turn on **Google** and paste **Client ID** / **Client secret** from [Google Cloud Console](https://console.cloud.google.com/) (OAuth consent + OAuth 2.0 Web client with authorized redirect URI from Supabase docs).

## 4. Add env vars on Vercel

Project → **Settings** → **Environment Variables** (Production):

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ…` (anon public key) |

Redeploy (**Deployments** → **⋯** → **Redeploy**) so the new build picks up the variables.

## 5. Local dev (optional)

```bash
cp .env.example .env
# Fill real URL + anon key, then:
npm run dev
```

## 6. First sign-in

After you sign in with **Google** or **email link**, the app creates three default habits if you have none. Toggling rings writes to **`day_entries`**; new habits go to **`habits`**.

---

**Security:** only the **anon** key goes in the frontend. Never commit **service_role** or database passwords to Git.
