# Saksham Arora — GitHub Pages build

Static-export copy of the main site, isolated for deployment from the root of
the `Saksham-Arora` GitHub repository.

## What's different from the main site

- `next.config.mjs` has `output: "export"`, the `/Saksham-Arora` Pages base
  path, and `images: { unoptimized: true }`
  (GitHub Pages has no server, so there's no Next.js image optimizer or API
  routes — everything is pre-rendered to static HTML/CSS/JS at build time).
- The blog's tag filter (`/blog?tag=...`) now filters client-side
  (`components/BlogList.tsx`) instead of reading `searchParams` on the server,
  since server-side `searchParams` isn't compatible with static export.
- `app/api/photos/route.ts` was dropped — the UI reads photos via server
  component props at build time, not that endpoint.
- `scripts/sync-drive-photos.mjs` was dropped (Google Drive sync isn't needed
  to build a static site).

## One-time setup

1. Push this folder as the root of the `Saksham-Arora` repo.
2. In the repo's Settings → Pages, set **Source** to **GitHub Actions**.
3. Push to `main` — `.github/workflows/deploy.yml` builds the site
   (`npm ci && npm run build`, which produces `out/`) and deploys it
   automatically. Re-runs on every push, so new photos/blog posts go live
   without any manual rebuild.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produces out/ (static export)
```

## Adding content

Same as the main site: drop photos into `public/photos/` (with optional
`public/photos/_meta.json`), and blog posts into `content/posts/*.md`.
