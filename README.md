# daily-rings-pwa

Personal **PWA** for daily “rings”–style habits (exercise, read, learn/build, …) with **Supabase** sync between iPhone and Mac. Friction-light: no Apple Developer account; sign in with **Google** or **email magic link** once Supabase Auth is configured.

**Prerequisites:** see [PREREQUISITES.md](./PREREQUISITES.md).

## Quick start (local)

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL and anon key, then:
npm run dev
```

## Supabase schema

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

## Stack (planned)

- **Vite** + **React** + **TypeScript**
- **Supabase** (Postgres + Auth + RLS)
- **PWA** (service worker / install): add in a follow-up commit

## License

Private / your choice when you publish the repo.
