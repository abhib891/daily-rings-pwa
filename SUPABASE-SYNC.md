# Cross-device sync (Supabase)

When **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** are set (e.g. on [Vercel](https://vercel.com) → Project → **Settings** → **Environment Variables**), the app shows **sign-in** and stores habits + completions in **Supabase** instead of only `localStorage`. The same account sees the same data in **Chrome, Safari, phone, and laptop**.

The **Remember your goal** one-liner (under the daily quote) is saved to **Auth user metadata** as `goal_oneliner` via `auth.updateUser` — no extra Postgres table. It syncs with the same signed-in account across devices.

## 1. Create a Supabase project

1. [supabase.com](https://supabase.com) → **New project** → wait until it is ready.
2. **Project Settings** → **API** → copy **Project URL** and **`anon` `public`** key.

## 2. Create tables + default-habit RPC (once)

In the Supabase **SQL Editor**, run in order:

1. **[`supabase/migrations/001_initial.sql`](./supabase/migrations/001_initial.sql)** — `habits` + `day_entries` and RLS.  
2. **[`supabase/migrations/002_ensure_default_habits_rpc.sql`](./supabase/migrations/002_ensure_default_habits_rpc.sql)** — `ensure_default_habits()` so default habits are created **atomically** (avoids duplicate “Exercise / Read / Learn” rows when the app loads twice in parallel).
3. **[`supabase/migrations/003_dedupe_habits_rpc.sql`](./supabase/migrations/003_dedupe_habits_rpc.sql)** — `dedupe_habits()` merges duplicate same-name habits and **OR-merges** `day_entries`; the app calls this after every sign-in load so old duplicate rows self-heal.

If you already have duplicate habits and have **not** applied migration 003 yet, you can still run **once** in SQL Editor (keeps the row with the **smallest `id`** per user + name; **deletes** `day_entries` tied only to duplicate habit ids — prefer migration 003 + app reload instead):

```sql
delete from public.habits h
where exists (
  select 1
  from public.habits h2
  where h2.user_id = h.user_id
    and h2.name = h.name
    and h2.archived = false
    and h.archived = false
    and h2.id < h.id
);
```

Then refresh the app.

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

Project → **Settings** → **Environment Variables**:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your **publishable** (`sb_publishable_…`) or **anon** (`eyJ…`) public client key |

**Critical checks**

1. Names must be **exactly** as above (including the **`VITE_`** prefix). Names like `SUPABASE_URL` without `VITE_` are **ignored** by Vite and will **not** appear in the browser bundle.
2. Enable these variables for **Production** (not only Preview / Development), unless you only deploy preview builds.
3. **Redeploy** after saving (**Deployments** → **⋯** → **Redeploy**). If the site still behaves like “local only”, redeploy once with **“Use existing Build Cache” turned off** (clear cache), so Vite rebuilds with the new env.

**Verify the build:** open the latest deployment → **Building** log. You should see either  
`[daily-rings] Supabase client env at build: OK (URL + key)` or  
`MISSING — add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY…`.  
That line confirms whether the variables were visible during `npm run build`.

## 5. Local dev (optional)

```bash
cp .env.example .env
# Fill real URL + anon key, then:
npm run dev
```

## 6. First sign-in

After you sign in with **Google** or **email link**, the app creates three default habits if you have none. Toggling rings writes to **`day_entries`**; renames update **`habits`**.

---

**Security:** only the **anon** key goes in the frontend. Never commit **service_role** or database passwords to Git.
