# Deploy Daily Rings to HTTPS

Your app is a static **Vite** build: **`npm run build`** → output folder **`dist`**. No server, no secrets for the current version.

**This project is set up to use [Vercel](https://vercel.com)** as the default host. Netlify and Cloudflare Pages remain documented below if you switch later.

**Prerequisite:** push the repo to **GitHub** (or GitLab/Bitbucket) and connect that account to Vercel.

The repo has **`.npmrc`** with `legacy-peer-deps=true` so **`vite-plugin-pwa`** installs on **Vite 8**. **`package.json`** includes **`engines.node`** so builds use a modern Node.

---

## Vercel (recommended)

1. Open [vercel.com](https://vercel.com) and sign in (e.g. **Continue with GitHub**).
2. **Add New…** → **Project**.
3. **Import** your **`daily-rings-pwa`** Git repository (install the Vercel GitHub app if prompted).
4. **Configure Project** — Vercel should detect **Vite**. Confirm:
   - **Framework Preset:** **Vite**
   - **Root Directory:** `./` (leave default unless the app is in a monorepo subfolder).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Environment Variables:** leave empty for the first deploy if you want **local-only** mode. To enable **sign-in and sync across devices**, add **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** (see [SUPABASE-SYNC.md](./SUPABASE-SYNC.md)), then redeploy.
6. Click **Deploy**. Wait for the build to finish.
7. Open the **Production** URL shown on the success screen — it looks like **`https://<project-name>.vercel.app`**. That is your HTTPS URL for **laptop and iPhone**.

**Later changes:** every `git push` to the connected **production branch** (usually `main`) triggers a new deployment automatically.

**Rename the URL:** Project → **Settings** → **Domains** — you can add a **custom domain** or adjust the default `*.vercel.app` name where Vercel allows it.

---

## After Vercel deploy

1. On your **laptop**, open the **`https://….vercel.app`** link and confirm the app loads.
2. On **iPhone**, use **Safari** → same URL → **Share** → **Add to Home Screen** (details in [DEPLOY-IPHONE.md](./DEPLOY-IPHONE.md)).

---

## Alternatives (optional)

### Netlify

This repo includes **`netlify.toml`** (`npm run build`, publish **`dist`**, Node **22**).

1. [netlify.com](https://www.netlify.com) → **Add new site** → **Import** the repo.  
2. Deploy and use **`https://….netlify.app`**.

### Cloudflare Pages

1. [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.  
2. Build command **`npm run build`**, output directory **`dist`**, set **`NODE_VERSION`** = `22` under environment variables if builds fail.  
3. Use **`https://….pages.dev`**.

---

## Troubleshooting

- **Build fails on `npm install`:** ensure **`.npmrc`** is committed (`legacy-peer-deps=true`).
- **Blank page:** wrong output directory — must be **`dist`**, not project root.
- **Old PWA on phone:** refresh or remove and re-add the home screen icon after a deploy.

---

## Deploy without Git (optional)

From the project folder, with [Vercel CLI](https://vercel.com/docs/cli): `npx vercel` then `npx vercel --prod`. Linking the project to Git afterward gives you automatic deploys on push.
