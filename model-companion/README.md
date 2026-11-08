# Model Companion — Drawing Club Prague

A mobile-first visual reference and preparation tool for people modeling at live
figure drawing sessions: pose library, short model guide, saved poses and
session preparation.

Target URL: **https://models.drawingclubprague.com** (separate from the Wix site,
which stays untouched).

Stack: React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router 7 · lucide-react.
No backend, no login, no paid APIs. Saved poses live in the visitor's browser (localStorage).

---

## 1. Local development

Requirements: [Node.js](https://nodejs.org) 20 or newer (LTS recommended).

```bash
cd model-companion
npm install          # first time only — downloads dependencies
npm run dev          # starts http://localhost:5173 with live reload
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run typecheck` | Checks TypeScript types (run before pushing) |
| `npm run build` | Production build into `dist/` |
| `npm run check` | Typecheck + build in one go |
| `npm run preview` | Serves the built `dist/` locally to test it |
| `npm run placeholders` | Regenerates the SVG placeholder diagrams |

## 2. GitHub repository

1. Create an empty repository on GitHub, e.g. `drawingclubprague/model-companion`
   (no README, no .gitignore — the project already has them).
2. In the project folder:

```bash
git init
git add .
git commit -m "Model Companion MVP 1.0"
git branch -M main
git remote add origin https://github.com/<your-account>/model-companion.git
git push -u origin main
```

## 3. Vercel deployment

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account (Hobby plan is free).
2. **Add New → Project** → import the `model-companion` repository.
3. Vercel detects Vite automatically. Defaults are correct:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You get a URL like `model-companion.vercel.app`.

Every push to `main` deploys automatically. Other branches get preview URLs.

`vercel.json` already contains the rewrite that makes deep links
(e.g. `/poses/staff-lean`) work on refresh, plus cache headers for images.

## 4. Custom subdomain — models.drawingclubprague.com

Nothing here changes DNS automatically. Do it by hand:

1. In Vercel: **Project → Settings → Domains → Add** `models.drawingclubprague.com`.
   Vercel then shows the exact DNS record it expects (normally a **CNAME** pointing
   to a `vercel-dns` target — copy the value Vercel shows you).
2. Add that record where the domain's DNS is managed. If the domain is managed in **Wix**:
   Wix → Domains → `drawingclubprague.com` → **Manage DNS Records** → CNAME → Add record:
   - Host: `models`
   - Value: the target from Vercel
3. Wait for propagation (minutes, sometimes a few hours). Vercel issues HTTPS automatically.

Only the `models` subdomain is added — the existing `www` / root records for the Wix site
must stay as they are.

Optional: link to the app from the Wix "Models" page with a normal button.

## 5. Adding or changing poses

All pose data lives in **`src/data/poses.json`**. Images live in **`public/poses/`**.

1. Put the image into `public/poses/`, e.g. `public/poses/seated-cross-legged.jpg`.
   - Portrait **4:5** ratio works best (e.g. 1600 × 2000 px).
   - Export as JPG or WebP, ideally under ~300 KB.
2. Add an entry to `poses.json` (every text in Czech and English):

```json
{
  "id": "seated-cross-legged",
  "title": { "cs": "Turecký sed", "en": "Seated Cross-Legged" },
  "image": "/poses/seated-cross-legged.jpg",
  "imageAlt": { "cs": "Figura v tureckém sedu na polštáři.", "en": "Figure sitting cross-legged on a cushion." },
  "category": "floor",
  "duration": "15-20",
  "tip": { "cs": "Jedna krátká praktická rada.", "en": "One short practical tip." },
  "credit": {
    "author": "Model Companion",
    "license": "AI-generated illustration, reviewed by DCP",
    "aiGenerated": true
  }
}
```

Allowed values:

- `category`: `standing`, `seated`, `floor`, `action`
- `duration`: `1-2`, `3-5`, `10`, `15-20`
- `id` must be unique, lowercase, with dashes — it becomes the URL.

**Licensing rule:** only use images you have the right to use and describe them honestly in
`credit` (`aiGenerated: true` for AI images). Remove `"placeholder": true` when you replace
a placeholder diagram.

### Texts and languages

- Interface texts: `src/i18n/strings.ts` (Czech + English)
- Guide principles and session notes: `src/data/guide.ts`
- The app picks Czech for Czech/Slovak phones, English otherwise; the CS/EN switch remembers the choice. `?lang=en` in a link forces English.

Poses appear in the order of `poses.json`.

## 6. Project structure

```
public/
  poses/        pose images (placeholders: original SVG diagrams)
  guide/        guide lesson illustrations
scripts/        placeholder diagram generator (figure.mjs + pose-defs.mjs)
src/
  assets/       bundled brand assets (official logo goes here when supplied)
  components/   Header, BottomNavigation, PoseCard, PoseGallery, FilterBar,
                PoseDetail, GuideCard, CompareFigure, BookmarkButton, ...
  data/         poses.json, guide.ts, prep.ts, taxonomy.ts, site.ts
  hooks/        useSavedPoses, usePoseFilters, useStoredSet, useDocumentTitle
  pages/        one file per screen
  styles/       index.css — Tailwind import + design tokens (@theme)
  types/        shared TypeScript types
```

Design tokens (colours, fonts) are in `src/styles/index.css` under `@theme`.

## 7. Prepared for later (not in MVP 1.0)

- **Cloud images / admin upload:** `image` is just a URL — it can point to a CDN
  (Cloudinary, Vercel Blob, Supabase Storage) without code changes. An admin
  upload would write to that storage and to a database replacing `poses.json`.
- **Curated collections / session boards / shareable lists:** `useStoredSet` already
  stores ID lists; a shareable collection can be encoded as `?ids=a,b,c` in a URL.
- **Multilingual:** all copy is in `src/data/*` — split per language (`en`, `cs`).
- **Session timer:** a new page + route in `App.tsx`; pose durations are already typed.

## 8. Inspiration board and /admin

The **Inspiration** section is a caption-free image board edited at `/admin`
(upload, reorder, optional source/author, delete). Changes are committed to this
repository by the Vercel Function `api/inspiration.js`; Vercel redeploys in about a minute.

Data: `public/inspiration/index.json` + images in `public/inspiration/`.
Uploaded images are resized in the browser to max 1600 px (JPEG).

One-time setup:

1. **GitHub token** — github.com → avatar → Settings → Developer settings →
   Personal access tokens → **Fine-grained tokens** → Generate new token.
   Repository access: *Only select repositories* → `model-companion`.
   Permissions → Repository permissions → **Contents: Read and write**. Copy the token.
2. **Vercel** — Project → Settings → **Environment Variables**, add:
   - `GITHUB_TOKEN` = the token
   - `ADMIN_PASSWORD` = a password you choose for /admin
3. Vercel → Deployments → latest → **Redeploy** (env variables apply to new deployments).

Optional variables: `GITHUB_REPO` (default `chawes/model-companion`), `GITHUB_BRANCH` (`main`),
`GITHUB_ROOT` (`model-companion` — the app's folder inside the repo).

The token expires according to the date you choose; when it does, /admin shows a GitHub 401 error —
generate a new one and replace `GITHUB_TOKEN`.
