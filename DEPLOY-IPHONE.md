# Use Daily Rings on iPhone and laptop

Safari on iPhone only treats your app as a real **installable PWA** on a proper **`https://` URL** (not `http://` on your LAN IP, and not someone else’s hostname). Your laptop can use the **same URL** in the browser.

## 1. Deploy once (get HTTPS)

Pick one static host (all give free HTTPS):

| Host | Idea |
|------|------|
| [Vercel](https://vercel.com) | Import Git repo → Framework: **Vite** → Build: `npm run build` → Output: **`dist`** → Deploy. |
| [Netlify](https://www.netlify.com) | Same build settings. |
| [Cloudflare Pages](https://pages.cloudflare.com) | Build `npm run build`, output **`dist`**. |

After deploy, you get a URL like `https://daily-rings-xxx.vercel.app`.

**Build command:** `npm run build`  
**Publish directory:** `dist`

This project uses **`vite-plugin-pwa`**; the production build includes `manifest.webmanifest`, icons, and a service worker for offline shell caching.

## 2. iPhone — open and add to Home Screen

1. On the iPhone, open **Safari** (recommended for PWA install).
2. Go to your **`https://…`** deploy URL.
3. Tap **Share** → **Add to Home Screen** → confirm.

You get a home screen icon that opens like a standalone app.

## 3. Laptop

Open the **same `https://…` URL** in Chrome or Safari. Bookmark it if you like.

## 4. Data today (important)

Habit data is stored in **each browser’s `localStorage`**.

- **iPhone (installed PWA)** and **laptop browser** are **different storage** → they **do not sync** automatically.
- Using the **same URL** only means the **same app version**; not the same data.

To **sync rings between devices** later, you would add a backend (e.g. **Supabase**) and sign-in—same repo already has a starter SQL migration for that.

## 5. Local-only testing on the phone (optional)

To hit your Mac from the phone without deploying, you need an **HTTPS tunnel** (e.g. ngrok, Cloudflare Tunnel). Many employers restrict that on a **work laptop**—check policy before using.

## 6. Employer / compliance

Deploying a personal static site to Vercel/Netlify and opening it on a **personal phone** is usually separate from corporate systems; still follow your **acceptable use** rules for the laptop and accounts you use to deploy.
