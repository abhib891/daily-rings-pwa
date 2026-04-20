# Deploy Daily Rings to HTTPS (Vercel, Netlify, Cloudflare Pages)

Your app is a static **Vite** build: **`npm run build`** → output folder **`dist`**. No server, no secrets required for the current version.

**Repo:** the project should live in **Git** (e.g. GitHub) so the host can pull it on every push. This folder includes **`netlify.toml`** for Netlify; Vercel and Cloudflare usually auto-detect Vite when settings match below.

---

## Shared settings (all hosts)

| Setting | Value |
|--------|--------|
| Install command | `npm install` (default) |
| Build command | `npm run build` |
| Output / publish directory | **`dist`** |
| Node.js | **20** or **22** (this repo pins **22** for Netlify via `netlify.toml`; set the same in other dashboards if builds fail). |

The repo has **`.npmrc`** with `legacy-peer-deps=true` so **`vite-plugin-pwa`** installs correctly on **Vite 8**.

---

## Option A — Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with **GitHub**).
2. **Add New…** → **Project** → **Import** your `daily-rings-pwa` repository.
3. Vercel usually detects **Vite**. Confirm:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`  
   - **Root Directory:** `.` (unless the app lives in a subfolder of the repo).
4. **Environment Variables:** none needed for the current app.
5. Click **Deploy**. When it finishes, open the **`https://….vercel.app`** URL.

**Updates:** every push to the connected branch triggers a new deployment.

**Custom domain (optional):** Project → **Settings** → **Domains** → add yours; HTTPS is automatic.

---

## Option B — Netlify

This repo includes **`netlify.toml`** so Netlify picks **`npm run build`** and **`dist`** automatically.

1. Go to [netlify.com](https://www.netlify.com) and sign in with **GitHub** (or your Git provider).
2. **Add new site** → **Import an existing project** → choose the repo.
3. Netlify should read **`netlify.toml`**. If the UI still asks:
   - **Build command:** `npm run build`  
   - **Publish directory:** `dist`  
4. **Environment variables:** none required.  
   - If the build complains about Node, add **`NODE_VERSION`** = `22` under **Site configuration** → **Environment variables** (the TOML already sets it for builds that respect `[build.environment]`).
5. **Deploy site**. Use the **`https://….netlify.app`** URL.

**Updates:** deploys on push to the linked branch.

---

## Option C — Cloudflare Pages

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub and select the **`daily-rings-pwa`** repository.
3. **Set up builds:**
   - **Project name:** anything you like (becomes part of **`*.pages.dev`**).
   - **Production branch:** e.g. `main`.
   - **Framework preset:** **Vite** (or **None**).
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. **Environment variables (recommended):** add **`NODE_VERSION`** = `22` (or `20`) under **Settings** → **Environment variables** for **Production** (and Preview if you use PR previews). This avoids odd failures on Cloudflare’s default Node.
5. **Save and Deploy**. Open the **`https://….pages.dev`** URL.

**Updates:** new commits on the production branch rebuild automatically.

---

## After deploy

1. Open the **`https://…`** URL on your **laptop** and confirm the app loads.
2. On **iPhone**, use **Safari** → same URL → **Share** → **Add to Home Screen** (see [DEPLOY-IPHONE.md](./DEPLOY-IPHONE.md)).

---

## Troubleshooting

- **Build fails on `npm install`:** ensure the repo includes **`.npmrc`** (`legacy-peer-deps=true`) and was pushed before the deploy.
- **Blank page:** open DevTools → **Console** on the preview URL; confirm `dist/index.html` exists in the build artifact (wrong publish folder is the usual mistake).
- **Old PWA on phone:** after a deploy, Safari may cache the service worker; try a refresh or remove/re-add the home screen icon.

---

## Deploy without Git (not ideal)

- **Netlify:** drag-and-drop the **`dist`** folder in the UI (no auto-deploy on push).
- **Vercel CLI:** `npm i -g vercel` then from the project root `vercel` / `vercel --prod` (can link to Git later).

For ongoing use, **Git + automatic deploys** is simpler.
