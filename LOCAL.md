# Run fully locally

No GitHub, no Supabase, no Docker. Data lives in **this browser’s `localStorage`**.

## Prerequisites

- **Node.js** 20+ (or 22+)
- **npm** (comes with Node)

## Commands

```bash
cd ~/projects/daily-rings-pwa
npm install
npm run dev
```

Open **http://localhost:5173/**.

## Production build (optional)

```bash
npm run build
npm run preview
```

Open the URL Vite prints (often **http://localhost:4173/**).

## Notes

- **iPhone + laptop (HTTPS, install):** see [DEPLOY-IPHONE.md](./DEPLOY-IPHONE.md).
- **iPhone + `localhost`:** not possible from the phone; use a deploy URL or an approved HTTPS tunnel.
- **Clear data:** DevTools → Application → Local Storage → remove `daily-rings-v1`, or run `localStorage.removeItem('daily-rings-v1')` in the console.
