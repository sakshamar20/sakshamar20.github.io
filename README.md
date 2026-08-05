# Personal website — maintenance and deployment guide

This is a self-contained, static-export version of the website for GitHub
Pages. Make all future website changes in this repository; do not edit the
generated `out/` directory.

## How publishing works

Every push to `main` triggers `.github/workflows/deploy.yml`:

1. GitHub installs the locked dependencies with `npm ci`.
2. It runs `npm run build`.
3. Next.js generates static HTML, CSS, JavaScript, images, and fonts in `out/`.
4. GitHub Pages publishes `out/`.

The workflow is successful only when both **build** and **deploy** are green
in the repository's **Actions** tab.

### Site URL and repository name

GitHub uses two URL patterns:

| Repository name | Published URL | Required Next.js configuration |
| --- | --- | --- |
| `<github-username>.github.io` | `https://<github-username>.github.io/` | No `basePath` |
| Any other repository name | `https://<github-username>.github.io/<repository-name>/` | `basePath` and `assetPrefix` must equal `/<repository-name>` |

Your GitHub username is `sakshamar20`. Therefore:

- Name the repository `sakshamar20.github.io` to publish cleanly at
  `https://sakshamar20.github.io/`. The current `next.config.mjs` is configured
  for this preferred setup.
- If you keep the repository name `sakshamarora.github.io`, the published URL
  is `https://sakshamar20.github.io/sakshamarora.github.io/`. Before deploying,
  update `next.config.mjs`:

```js
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/sakshamarora.github.io",
  assetPrefix: "/sakshamarora.github.io/",
  images: { unoptimized: true },
};
```

Do not use a `basePath` when the repository is named
`sakshamar20.github.io`; it makes styles, scripts, and images fail to load.

## First-time GitHub Pages setup

1. Push this folder's contents to the root of the GitHub repository.
2. Open **Settings → Pages** in GitHub.
3. Set **Source** to **GitHub Actions**.
4. Push a commit to `main`, or run **Actions → Deploy to GitHub Pages → Run
   workflow**.
5. Wait for the workflow to complete, then visit the URL determined above.

## Local development and checks

Use Node.js 20 or newer.

```bash
npm install       # first time only, or after package.json changes
npm run dev       # preview at http://localhost:3000
npm run build     # production static-export check; writes to out/
```

Always run `npm run build` before pushing a non-trivial change. Do not commit
`node_modules/`, `.next/`, or `out/`; `.gitignore` already excludes them.

## File map

| What it controls | File or directory |
| --- | --- |
| Home page composition | `app/page.tsx` |
| Hero / introduction / profile image behavior | `components/Hero.tsx` |
| Work page timeline, awards, skills | `components/Work.tsx` |
| Work project cards and modal details | `lib/projects.ts` |
| Photography gallery behavior | `components/Photography.tsx`, `components/PhotoCarousel.tsx`, `lib/photographyConfig.ts` |
| Blog index | `app/blog/page.tsx`, `components/BlogList.tsx` |
| Individual blog post pages | `app/blog/[slug]/page.tsx`, `content/posts/*.md` |
| Contact page | `components/Contact.tsx` |
| Navigation and social links | `components/NavBar.tsx` |
| Global visual styles | `app/globals.css`, `tailwind.config.ts` |
| Site title, description, fonts | `app/layout.tsx` |
| Static assets: photos, logos, CV, icons | `public/` |
| Deployment workflow | `.github/workflows/deploy.yml` |

## Updating each section

### Home / hero

Edit `components/Hero.tsx`.

- `NAMES` changes the rotating translations of the name.
- `highlights` changes the small achievement statements.
- The main biography and calls to action are in the JSX near the `h1`.
- `NAME_EFFECT` switches between `"fade"` and `"typewriter"`.

Profile photos live in `public/pfp/`. Add `.jpg`, `.jpeg`, `.png`, or `.webp`
files there. `Profile Photo.png` is used first when present; other images rotate
when the profile image is clicked.

### Work page

Edit `components/Work.tsx`.

- `timeline` adds, removes, or updates education and experience entries.
- `recognition` controls awards and achievements.
- `skillsCols` controls the grouped skill lists.
- Timeline logos must be placed in `public/logo/`, then referenced as, for
  example, `src: "/logo/purdue.png"`. Use `darkSrc` where a light logo variant
  is needed in dark mode.

### Projects

Edit the `projects` array in `lib/projects.ts`. Each object creates one project
card and its detail dialog.

```ts
{
  slug: "unique-url-safe-id",
  name: "Project name",
  period: "Jan 2026 – Mar 2026",
  affiliation: "Organisation",
  oneLiner: "Short card description.",
  tags: ["Python", "ML"],
  summary: ["Longer paragraph one.", "Optional paragraph two."],
  contributions: ["Outcome or responsibility one.", "Another contribution."],
  outcomes: ["Optional measurable outcome."],
  externalLinks: [{ label: "GitHub Repository", href: "https://github.com/..." }],
}
```

`slug` must be unique and use only lower-case letters, numbers, and hyphens.

### Photography

Place gallery images in `public/photos/`. Supported formats are `.jpg`, `.jpeg`,
`.png`, and `.webp`. Use simple filenames containing only letters, numbers,
periods, underscores, and hyphens. Images display alphabetically.

Optionally create or edit `public/photos/_meta.json` to add captions,
series filters, alternative text, and select the featured image:

```json
{
  "ladakh-01.jpg": {
    "location": "Ladakh, India",
    "series": "Mountains",
    "featured": true,
    "alt": "Snowy Himalayan ridge at sunrise"
  },
  "tokyo-night.jpg": {
    "location": "Tokyo, Japan",
    "series": "Streets",
    "alt": "Rainy neon-lit street at night"
  }
}
```

Only one image should have `"featured": true`; if none do, the first
alphabetical image becomes featured. If `_meta.json` is absent, captions and
series filtering are hidden.

Tune default gallery behavior in `lib/photographyConfig.ts`:

- `mode`: `"carousel"` or `"masonry"`.
- `carouselDurationSec`: larger number means slower scrolling.
- `carouselHeightPx` and `carouselGapPx`: carousel layout.
- `gridTileWidthPx` and `gridGapPx`: masonry layout.

### Blog

Create a Markdown file in `content/posts/`, for example
`content/posts/my-new-post.md`:

```md
---
title: My post title
date: "2026-08-05"
summary: A short card description.
cover: /blog/my-cover.jpg
tags:
  - Data Science
  - Photography
---

Write the post body here in standard Markdown.
```

- The filename determines the URL: `my-new-post.md` becomes `/blog/my-new-post`.
- Put cover images in `public/blog/`, and reference them from the root as
  `/blog/file-name.jpg`.
- Tags are created automatically from post front matter.
- The blog list filters tags in the browser so it remains compatible with
  GitHub Pages static export.

### Contact details and social links

Edit `components/Contact.tsx`:

- Change `LINKEDIN_URL` and `GITHUB_URL`.
- The email address is assembled in the `email` value; update the two string
  fragments instead of putting a raw email in the markup.
- Update the text below `let's talk.` and the footer year as needed.

Edit `components/NavBar.tsx` to change navigation labels or GitHub, LinkedIn,
and Instagram links in the header.

### Resume, logos, icons, and other files

- Replace `public/resume.pdf` to update the downloadable CV.
- Put organisation logos in `public/logo/`.
- Put blog images in `public/blog/`.
- Replace `public/icon.png` and `public/apple-icon.png` to update browser and
  Apple icons.
- Keep paths referenced in code root-relative, for example `/resume.pdf` or
  `/logo/company.png`.

### Site title, search preview, and visual design

- Edit `metadata` in `app/layout.tsx` for the browser tab title, description,
  and social-preview text.
- Edit `app/globals.css` for global colors, spacing, and styles.
- Edit `tailwind.config.ts` for Tailwind design tokens and font families.
- Font loading is configured in `app/layout.tsx`.

## Deploying a change

1. Change files locally.
2. Run `npm run dev` and test the relevant page.
3. Run `npm run build`.
4. Commit and push to `main`:

```bash
git add .
git commit -m "Update photography gallery"
git push origin main
```

5. In GitHub, open **Actions** and wait for **Deploy to GitHub Pages** to pass.
6. Visit the site in a private window or hard-refresh (`Cmd + Shift + R`) if
   the browser has cached old files.

## Troubleshooting

### Page is plain text, unstyled, or images are missing

This almost always means the repository name and `basePath` setting do not
match. Read [Site URL and repository name](#site-url-and-repository-name),
correct `next.config.mjs`, push again, and wait for a new successful workflow.

### GitHub Action fails

Open the failed job under **Actions** and read the first red error. Common
causes are invalid TypeScript, malformed JSON in `_meta.json`, a malformed
Markdown front matter block, or an unsupported image filename. Reproduce it
locally with `npm run build` before retrying.

### A new photo does not appear

Confirm that it is inside `public/photos/`, has a supported extension, uses a
safe filename, and has been committed. If using `_meta.json`, validate its JSON
syntax and ensure the filename matches exactly.

### A blog post is missing

Confirm the file ends in `.md`, is under `content/posts/`, has valid front
matter between `---` markers, and that `npm run build` completes successfully.

## GitHub Pages limitations

GitHub Pages serves static files only. Do not add server-only features such as
API routes, server actions, authentication, database queries, on-demand image
optimization, or request-dependent server rendering. Content must be available
when `npm run build` runs.
