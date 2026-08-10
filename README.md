# Website Developer Guide

Complete reference for changing, extending, and deploying this personal website.

> **Where to edit code:** The live site is built from the **repository root** (`../`), not from this `github-pages/` folder. This directory currently holds deployment-related notes and a partial component copy. All paths below are relative to the repo root unless stated otherwise.

For a section-by-section content editing manual, also see [`../WEBSITE_GUIDE.md`](../WEBSITE_GUIDE.md).

---

## Table of Contents

1. [What this site is](#1-what-this-site-is)
2. [Prerequisites](#2-prerequisites)
3. [First-time setup](#3-first-time-setup)
4. [Daily development workflow](#4-daily-development-workflow)
5. [Repository layout](#5-repository-layout)
6. [How the site is built (mental model)](#6-how-the-site-is-built-mental-model)
7. [Pages and routing](#7-pages-and-routing)
8. [Changing existing content](#8-changing-existing-content)
9. [Adding new content](#9-adding-new-content)
10. [Adding a new page](#10-adding-a-new-page)
11. [Adding a new React component](#11-adding-a-new-react-component)
12. [Design system (colors, fonts, spacing)](#12-design-system-colors-fonts-spacing)
13. [Static assets (`public/`)](#13-static-assets-public)
14. [Photography gallery](#14-photography-gallery)
15. [Blog](#15-blog)
16. [Work page (projects, timeline, skills)](#16-work-page-projects-timeline-skills)
17. [Contact page](#17-contact-page)
18. [Navigation and social links](#18-navigation-and-social-links)
19. [Global shell (layout, theme, loader)](#19-global-shell-layout-theme-loader)
20. [Scripts and automation](#20-scripts-and-automation)
21. [SEO and metadata](#21-seo-and-metadata)
22. [Build, test, and deploy](#22-build-test-and-deploy)
23. [Git workflow for changes](#23-git-workflow-for-changes)
24. [Decision tree: “I want to add…”](#24-decision-tree-i-want-to-add)
25. [Troubleshooting](#25-troubleshooting)
26. [Unused / legacy code](#26-unused--legacy-code)
27. [Appendix: file → responsibility map](#27-appendix-file--responsibility-map)

---

## 1. What this site is

| Item | Value |
|------|-------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + CSS variables in `app/globals.css` |
| **Animation** | Framer Motion |
| **Theme** | Light/dark via `next-themes` |
| **CMS / database** | None — content is files on disk |
| **UI libraries** | None (custom components only) |

**Live routes:**

| URL | What visitors see |
|-----|-------------------|
| `/` | Hero + Photography (single scrollable home page) |
| `/work` | Projects, timeline, recognition, skills, CV download |
| `/contact` | Email, LinkedIn, GitHub cards |
| `/blog` | Blog index with tag filtering |
| `/blog/[slug]` | Individual blog post |

There is no admin panel. Every change is a file edit + rebuild/redeploy.

---

## 2. Prerequisites

Install before working on the site:

| Tool | Minimum version | Check with |
|------|-----------------|------------|
| **Node.js** | 18.x (20.x recommended) | `node -v` |
| **npm** | 9.x+ | `npm -v` |
| **Git** | any recent | `git -v` |

Optional:

- **VS Code / Cursor** with ESLint extension
- **Google Cloud project** — only if using Drive photo sync (`npm run sync-photos`)

---

## 3. First-time setup

From the **repo root** (`website/`, one level above this folder):

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Photo sync from Google Drive
cp .env.example .env.local
# Edit .env.local — set GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_FOLDER_ID

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

The `dev` script automatically kills any process already bound to port 3000, then starts Next.js on that port.

---

## 4. Daily development workflow

```bash
# Start local dev server (hot reload)
npm run dev

# Type-check + production build (run before every deploy)
npm run build

# Run the production build locally
npm start

# Lint
npm run lint
```

**Typical change cycle:**

1. Edit the relevant file(s) — see sections below.
2. Verify in the browser at `http://localhost:3000`.
3. Run `npm run build` — fix any TypeScript or build errors.
4. Commit and push (see [§23](#23-git-workflow-for-changes)).
5. Wait for your host to redeploy (Vercel auto-deploys on push if connected).

**When you must restart `npm run dev`:**

- Added/removed files under `public/photos/` or `public/pfp/`
- Added a new blog post (`.md` file)
- Changed `next.config.mjs`

Hot reload handles most React/Tailwind edits without a restart.

---

## 5. Repository layout

```
website/                          ← WORK HERE (repo root)
├── app/                          # Next.js App Router — pages, layout, global CSS
│   ├── layout.tsx                # Root layout: fonts, metadata, theme, global UI
│   ├── globals.css               # Color tokens, prose styles, keyframe animations
│   ├── page.tsx                  # Home: Hero + Photography
│   ├── work/page.tsx
│   ├── contact/page.tsx
│   ├── blog/
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/page.tsx       # Individual post
│   └── api/photos/route.ts       # JSON API (optional; UI does not use it)
│
├── components/                   # React components (most are client components)
│   ├── NavBar.tsx
│   ├── Hero.tsx
│   ├── VoronoiCanvas.tsx         # ← canonical copy (use this one)
│   ├── Photography.tsx
│   ├── PhotoCarousel.tsx
│   ├── Lightbox.tsx
│   ├── Work.tsx
│   ├── ProjectDialog.tsx
│   ├── Contact.tsx
│   ├── BlogPostView.tsx
│   ├── BlogTagFilter.tsx
│   ├── TagPill.tsx
│   ├── ThemeToggle.tsx
│   ├── ThemeProvider.tsx
│   ├── ScrollProgress.tsx
│   ├── PageLoader.tsx
│   ├── SectionDivider.tsx
│   └── About.tsx                 # exists but not used on any page
│
├── lib/                          # Data loaders and shared logic
│   ├── projects.ts               # Project card + dialog data
│   ├── getPhotos.ts              # Reads public/photos/ at build time
│   ├── getProfilePhotos.ts       # Reads public/pfp/
│   ├── photographyConfig.ts      # Gallery defaults
│   ├── posts.ts                  # Blog Markdown → HTML
│   ├── tagSlug.ts
│   └── useCountUp.ts             # unused hook
│
├── content/posts/                # Blog Markdown files (*.md)
├── public/                       # Static files served at site root
│   ├── photos/                   # Gallery images + optional _meta.json
│   ├── pfp/                      # Profile photos for hero
│   ├── logo/                     # Org logos for work timeline
│   ├── blog/                     # Blog cover and inline images
│   └── resume.pdf                # CV (optional)
│
├── scripts/
│   ├── sync-drive-photos.mjs     # Pull photos from Google Drive
│   └── optimize-photos.mjs       # Compress and sanitize filenames
│
├── github-pages/                 # ← YOU ARE HERE
│   └── README.md                 # This file
│
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── package.json
├── README.md                     # Short project overview
└── WEBSITE_GUIDE.md              # Section-by-section content editing manual
```

**Import alias:** `@/` maps to the repo root (configured in `tsconfig.json`). Example: `import Hero from "@/components/Hero"`.

---

## 6. How the site is built (mental model)

```
┌─────────────────────────────────────────────────────────────┐
│  app/layout.tsx          wraps every page                     │
│    ├── ScrollProgress    orange bar at top of viewport        │
│    ├── PageLoader        splash on first visit per session    │
│    └── {children}        page content                         │
├─────────────────────────────────────────────────────────────┤
│  Each page (app/*/page.tsx):                                  │
│    NavBar + <main> + section component(s)                   │
├─────────────────────────────────────────────────────────────┤
│  Data at build time:                                          │
│    lib/getPhotos.ts      → public/photos/                     │
│    lib/getProfilePhotos  → public/pfp/                        │
│    lib/posts.ts          → content/posts/*.md                 │
│    lib/projects.ts       → exported array                     │
│    Inline arrays in components (nav, timeline, skills, etc.)  │
└─────────────────────────────────────────────────────────────┘
```

### Server vs client components

| Type | Where | Can do | Cannot do |
|------|-------|--------|-----------|
| **Server Component** | `app/**/*.tsx` without `"use client"` | Read filesystem, `async` data fetching | Browser APIs, `useState`, event handlers |
| **Client Component** | `components/**/*.tsx` with `"use client"` | Interactivity, animations, hooks | Direct filesystem access |

**Rule of thumb:** Keep pages thin (server). Put interactivity in `components/`.

### When content updates appear in production

| Change type | Requires |
|-------------|----------|
| React/TS/CSS edits | Rebuild + redeploy |
| New photo in `public/photos/` | Rebuild + redeploy |
| New blog post `.md` | Rebuild + redeploy |
| Edit `_meta.json` | Rebuild + redeploy |
| `public/resume.pdf` replacement | Rebuild + redeploy (or just redeploy if file is committed) |

There is no runtime database. Everything is baked in at `npm run build`.

---

## 7. Pages and routing

Next.js App Router: each `app/<path>/page.tsx` becomes a route.

| File | Route | Responsibility |
|------|-------|----------------|
| `app/page.tsx` | `/` | Assembles Hero + SectionDivider + Photography |
| `app/work/page.tsx` | `/work` | Thin wrapper → `<Work />` |
| `app/contact/page.tsx` | `/contact` | Thin wrapper → `<Contact />` |
| `app/blog/page.tsx` | `/blog` | Blog index + tag filter |
| `app/blog/[slug]/page.tsx` | `/blog/hello-world` | Single post (slug = filename without `.md`) |

To reorder home page sections, edit `app/page.tsx`:

```tsx
<Hero profilePhotos={profilePhotos} />
<SectionDivider />
<Photography photos={photos} />
```

Add, remove, or reorder components here.

---

## 8. Changing existing content

Quick reference — each row is “change X → edit Y”.

| I want to change… | Edit this |
|-------------------|-----------|
| Browser tab title / default SEO description | `app/layout.tsx` → `metadata` |
| Bio paragraph on home page | `components/Hero.tsx` — bio `<p>` block |
| Cycling multilingual names | `components/Hero.tsx` → `NAMES` and `NAME_FONTS` arrays |
| Name animation style (fade vs typewriter) | `components/Hero.tsx` → `NAME_EFFECT` |
| Hero CTA links (“projects”, “photography”) | `components/Hero.tsx` — link `href`s |
| Photography section headings / copy | `components/Photography.tsx` |
| Default gallery layout (carousel vs grid) | `lib/photographyConfig.ts` → `mode` |
| Project cards and popup content | `lib/projects.ts` |
| Work timeline entries | `components/Work.tsx` → `timeline` array |
| Awards / recognition | `components/Work.tsx` → `recognition` array |
| Skills columns | `components/Work.tsx` → `skillsCols` array |
| CV download link | `components/Work.tsx` → `CVButton` `href` |
| Contact email | `components/Contact.tsx` → `useMemo` obfuscation block |
| Contact subtitle / footer | `components/Contact.tsx` |
| Nav link labels and URLs | `components/NavBar.tsx` → `items` array |
| GitHub / LinkedIn / Instagram URLs | `NavBar.tsx`, `Contact.tsx`, `Photography.tsx` constants |
| Site color palette | `app/globals.css` → `:root` and `.dark` CSS variables |
| Body font | `app/layout.tsx` Google Fonts link + `tailwind.config.ts` → `fontFamily.sans` |
| Heading font | `app/layout.tsx` font import + `tailwind.config.ts` → `fontFamily.display` |
| Splash screen text / duration | `components/PageLoader.tsx` |
| Blog post typography | `app/globals.css` → `.prose-post` rules |

See [`../WEBSITE_GUIDE.md`](../WEBSITE_GUIDE.md) for line-level detail on every section.

---

## 9. Adding new content

### 9.1 Profile photos (hero)

1. Add images to `public/pfp/` (`.jpg`, `.jpeg`, `.png`, `.webp`).
2. Name your primary photo `Profile Photo.png` — it sorts first.
3. Restart dev server or rebuild.
4. Clicking the hero photo cycles through all images in `pfp/`.

Compress large originals first:

```bash
node scripts/optimize-photos.mjs pfp
```

### 9.2 Gallery photos

**Option A — manual drop:**

1. Put images in `public/photos/`.
2. Filenames must match `/^[A-Za-z0-9._-]+$/` (no spaces). Use the optimize script to sanitize.
3. Optionally add metadata in `public/photos/_meta.json` (see [§14](#14-photography-gallery)).
4. Restart dev server or rebuild.

**Option B — Google Drive sync:**

```bash
# Requires .env.local with GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_FOLDER_ID
npm run sync-photos
```

This **replaces** all images in `public/photos/` (but leaves `_meta.json` alone).

### 9.3 Resume / CV

1. Put your PDF at `public/resume.pdf`, **or** host it elsewhere (Google Drive, etc.).
2. Set the download button URL in `components/Work.tsx` → `CVButton`:

```tsx
href="/resume.pdf"
// or
href="https://drive.google.com/..."
```

Currently the placeholder is `PASTE_DRIVE_LINK_HERE` — replace it.

### 9.4 Org logos (work timeline)

1. Add PNGs to `public/logo/` (transparent background recommended).
2. Reference in `components/Work.tsx` → `timeline` entry:

```ts
logo: { src: "/logo/flipkart.png" }
// For dark-mode visibility:
logo: { src: "/logo/ubc.png", darkSrc: "/logo/ubc-light.png" }
```

### 9.5 Projects

Add an object to the `projects` array in `lib/projects.ts`:

```ts
{
  slug: "my-new-project",           // unique kebab-case ID
  name: "Project Title",
  period: "Jan 2024 – Apr 2024",
  affiliation: "Org Name",
  oneLiner: "Short card description.",
  tags: ["Python", "ML"],           // max 3 shown on card; rest as "+N"
  summary: ["Paragraph for dialog."],
  contributions: ["Bullet 1", "Bullet 2"],
  outcomes: ["Optional outcome"],   // optional
  externalLinks: [{ label: "GitHub", href: "https://..." }],  // optional
}
```

No other files need changing — the card grid and modal are generated automatically.

### 9.6 Timeline entry

Add to the `timeline` array at the top of `components/Work.tsx` (newest first):

```ts
{
  year: "2024 – 2026",
  org: "Company, City",
  role: "Title · Subtitle",
  bullets: ["Achievement 1", "Achievement 2"],
  badge: "Optional badge text",     // optional orange badge
  logo: { src: "/logo/company.png" },
}
```

### 9.7 Recognition / award

Add to `recognition` in `components/Work.tsx`:

```ts
{ year: "2025", label: "Award Name, Organization" }
```

### 9.8 Skills column

Edit `skillsCols` in `components/Work.tsx`:

```ts
{
  title: "Languages",
  items: ["Python", "R", "SQL"],
}
```

To add a fourth column, add an object and change the grid class from `lg:grid-cols-3` to `lg:grid-cols-4`.

### 9.9 Blog post

1. Create `content/posts/your-slug.md`.
2. Add frontmatter:

```markdown
---
title: "Your Post Title"
date: "2026-08-05"
summary: "One-line description for the index."
cover: "/blog/your-cover.jpg"
tags: ["Tag1", "Tag2"]
---

Your Markdown content here.
```

3. Put images in `public/blog/`.
4. Reference inline: `![caption](/blog/image.jpg)`.
5. Rebuild — post appears at `/blog/your-slug`, sorted by date (newest first).

Copy `content/posts/hello-world.md` as a template.

### 9.10 Contact method (e.g. Twitter)

1. In `components/Contact.tsx`, create an icon component (copy pattern from `MailIcon`).
2. Add to the `cards` array:

```ts
{
  label: "Twitter",
  value: "@handle",
  href: "https://twitter.com/handle",
  Icon: TwitterIcon,
  external: true,
}
```

3. Update grid columns: `sm:grid-cols-3` → `sm:grid-cols-4` (or `sm:grid-cols-2` for 2×2).

---

## 10. Adding a new page

Example: add `/about`.

### Step 1 — Create the route

Create `app/about/page.tsx`:

```tsx
import NavBar from "@/components/NavBar";
import About from "@/components/About"; // or inline content

export const metadata = {
  title: "About — Saksham Arora",
  description: "About Saksham Arora.",
};

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <About />
        </div>
      </main>
    </>
  );
}
```

`components/About.tsx` already exists but is unused — you can wire it in here.

### Step 2 — Add to navigation

In `components/NavBar.tsx`:

```ts
const items = [
  // ...existing items
  { label: "About", href: "/about", id: "about" },
];
```

Update the `active` logic in the same file:

```ts
pathname.startsWith("/about") ? "about" :
// ...existing conditions
```

### Step 3 — Verify

```bash
npm run dev
# Visit http://localhost:3000/about
npm run build   # must pass
```

### Step 4 — SEO (optional)

Add page-specific `metadata` export in the new `page.tsx` (shown above).

---

## 11. Adding a new React component

### Where to put it

Always create components under `components/` at the **repo root**, not under `github-pages/`. Tailwind only scans `./app/**` and `./components/**` (see `tailwind.config.ts`).

### Server vs client

| Needs interactivity? | Directive | Example use |
|---------------------|-----------|-------------|
| No (static markup) | none | Could live in `app/` or `components/` |
| Yes (clicks, state, animations) | `"use client"` at top | Buttons, modals, carousels |

### Template — client component

```tsx
"use client";

type Props = {
  title: string;
};

export default function MyWidget({ title }: Props) {
  return (
    <section className="py-24 md:py-32">
      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent">
        Label
      </p>
      <h2 className="font-display text-[28px] md:text-[36px] text-primary">
        {title}
      </h2>
    </section>
  );
}
```

### Use it on a page

In a server page (`app/some-page/page.tsx`):

```tsx
import MyWidget from "@/components/MyWidget";

export default function Page() {
  return (
    <>
      <NavBar />
      <main>
        <MyWidget title="Hello" />
      </main>
    </>
  );
}
```

### Conventions to match

- Section labels: `font-mono text-[11px] tracking-[0.12em] uppercase text-accent`
- Section headings: `font-display text-[28px] md:text-[36px] text-primary`
- Content width: `max-w-6xl` (wide) or `max-w-3xl` (narrow/blog)
- Padding: `px-5 md:px-8`, vertical `py-24 md:py-32`
- Colors: `text-primary`, `text-secondary`, `text-accent`, `bg-surface`, `border-border`

---

## 12. Design system (colors, fonts, spacing)

### 12.1 Colors

Defined as RGB triplets in `app/globals.css`:

| Token | Role |
|-------|------|
| `background` | Page background (warm cream light / dark brown dark) |
| `surface` | Cards, panels |
| `primary` | Main text |
| `secondary` | Subtext, labels |
| `tertiary` | Muted text |
| `accent` | Orange highlights, links, active nav |
| `accent-light` | Tag backgrounds |
| `border` | Dividers, card borders |

**To change the palette:** edit `:root` (light) and `.dark` (dark) in `app/globals.css`. Values are space-separated RGB, e.g. `255 150 68` for orange. Tailwind applies them via `rgb(var(--accent) / <alpha-value>)`.

### 12.2 Fonts

| Role | Font | Config location |
|------|------|-----------------|
| Display (headings) | Playfair Display | `app/layout.tsx` + `tailwind.config.ts` `fontFamily.display` |
| Body | Teachers | `app/layout.tsx` `<head>` link + `fontFamily.sans` |
| Mono (labels) | JetBrains Mono | `app/layout.tsx` + `fontFamily.mono` |
| “Hi, I am” | Instrument Serif italic | `app/layout.tsx` |
| Multilingual names | Poppins, Noto, Krub, etc. | `app/layout.tsx` + `Hero.tsx` `NAME_FONTS` |

### 12.3 Dark mode

- `next-themes` via `components/ThemeProvider.tsx`
- Toggle: `components/ThemeToggle.tsx` (in NavBar)
- `darkMode: "class"` — `<html>` gets a `dark` class
- Default: system preference

### 12.4 Spacing conventions

| Pattern | Classes |
|---------|---------|
| Max content width | `max-w-6xl` or `max-w-3xl` |
| Horizontal padding | `px-5 md:px-8` or `px-6 md:px-12` |
| Section vertical padding | `py-24 md:py-32` |
| Top offset (below fixed nav) | `pt-32 md:pt-40` on `<main>` |

---

## 13. Static assets (`public/`)

Everything in `public/` is served from the site root.

| Path | URL | Purpose |
|------|-----|---------|
| `public/photos/foo.jpg` | `/photos/foo.jpg` | Gallery |
| `public/pfp/photo.jpg` | `/pfp/photo.jpg` | Hero profile |
| `public/logo/org.png` | `/logo/org.png` | Timeline logos |
| `public/blog/cover.jpg` | `/blog/cover.jpg` | Blog images |
| `public/resume.pdf` | `/resume.pdf` | CV download |

### Image requirements

| Type | Formats | Notes |
|------|---------|-------|
| Gallery | JPG, PNG, WebP | Compress with `optimize-photos.mjs` |
| Profile | JPG, PNG, WebP | Square-ish works best (displayed in circle) |
| Logos | PNG with transparency | Provide `darkSrc` if logo is dark-colored |
| Blog | JPG, PNG, WebP | Reference with `/blog/filename` in Markdown |

### Favicon

Not configured yet. To add:

1. Place `app/favicon.ico` (Next.js App Router convention), **or**
2. Add `<link rel="icon" href="/letter-s.png" />` in `app/layout.tsx` `<head>`.

---

## 14. Photography gallery

### Metadata — `public/photos/_meta.json`

```json
{
  "PXL_20230507_081654494.jpg": {
    "location": "Ladakh",
    "series": "Mountains",
    "featured": true,
    "alt": "Snow peaks at dawn"
  }
}
```

| Field | Effect |
|-------|--------|
| `location` | Shown on hover and in lightbox |
| `series` | Enables filter pills in grid mode |
| `featured` | Marks featured photo (used by `getPhotos`) |
| `alt` | Accessibility alt text |

If `_meta.json` is missing, photos still display but without captions, filters, or locations.

### Display tuning — `lib/photographyConfig.ts`

```ts
export const photographyConfig = {
  mode: "carousel",              // "carousel" | "masonry"
  carouselDurationSec: 400,      // higher = slower scroll
  carouselHeightPx: 300,
  carouselGapPx: 10,
  carouselEdgeZonePx: 110,
  carouselFastForwardMultiplier: 10,
  gridTileWidthPx: 200,
  gridGapPx: 8,
};
```

Visitors can toggle carousel/grid in the UI; this only sets the **initial** mode.

### Related components

| Component | Role |
|-----------|------|
| `Photography.tsx` | Section shell, mode toggle, sepia filter |
| `PhotoCarousel.tsx` | Auto-scrolling bento strip |
| `Lightbox.tsx` | Full-screen viewer (Esc, arrows, swipe) |
| `lib/getPhotos.ts` | Reads disk, parses metadata, gets dimensions via `sharp` |

---

## 15. Blog

### Frontmatter fields

| Field | Required | Used for |
|-------|----------|----------|
| `title` | Yes | Page title, index heading |
| `date` | Recommended | Sort order (`YYYY-MM-DD`) |
| `summary` | Recommended | Index excerpt + meta description |
| `cover` | Optional | Hero image + Open Graph |
| `tags` | Optional | Tag pills; filter via `?tag=slug` |

### Tag filtering

- Tags are URL-encoded as slugs: `"Causal Inference"` → `?tag=causal-inference`
- Logic in `lib/posts.ts` → `tagSlug()`, `getPostsByTagSlug()`
- UI: `components/BlogTagFilter.tsx`, `components/TagPill.tsx`

### Post rendering

- `app/blog/[slug]/page.tsx` — server page, calls `generateStaticParams()` for all slugs
- `components/BlogPostView.tsx` — client component with font picker and reading layout
- Body HTML styled by `.prose-post` in `app/globals.css`

### Supported Markdown

Standard Markdown + GFM (tables, strikethrough, task lists) via `remark-gfm`.

---

## 16. Work page (projects, timeline, skills)

| Section | Data location | Component |
|---------|---------------|-----------|
| Projects grid + dialog | `lib/projects.ts` | `Work.tsx` + `ProjectDialog.tsx` |
| Timeline | `timeline` array in `Work.tsx` | `Work.tsx` |
| Recognition | `recognition` array in `Work.tsx` | `Work.tsx` |
| Skills | `skillsCols` array in `Work.tsx` | `Work.tsx` |
| CV button | `CVButton` in `Work.tsx` | `Work.tsx` |

The page wrapper (`app/work/page.tsx`) only sets metadata and renders `<Work />`.

---

## 17. Contact page

| Change | Location |
|--------|----------|
| Email (obfuscated anti-spam) | `components/Contact.tsx` → `useMemo` with `user` / `domain` arrays |
| LinkedIn / GitHub URLs | `LINKEDIN_URL`, `GITHUB_URL` constants |
| Subtitle | `<p className="mt-5 ...">` |
| Footer year/name | `<p className="mt-6 font-mono ...">` |

---

## 18. Navigation and social links

### Nav items — `components/NavBar.tsx`

```ts
const items = [
  { label: "Home", href: "/", id: "home" },
  { label: "Work", href: "/work", id: "work" },
  { label: "Photography", href: "/#photography", id: "photography" },
  { label: "Blog", href: "/blog", id: "blog" },
  { label: "Contact", href: "/contact", id: "contact" },
];
```

On `/`, nav highlights "Home" or "Photography" based on scroll position (IntersectionObserver on `#hero` and `#photography`).

### Social URL constants (update in all places they appear)

| Platform | Files |
|----------|-------|
| GitHub | `NavBar.tsx`, `Contact.tsx` |
| LinkedIn | `NavBar.tsx`, `Contact.tsx` |
| Instagram | `NavBar.tsx`, `Photography.tsx` |

---

## 19. Global shell (layout, theme, loader)

| Feature | File | To disable |
|---------|------|------------|
| Fonts + metadata | `app/layout.tsx` | — |
| Theme (light/dark) | `components/ThemeProvider.tsx` | Remove wrapper from `layout.tsx` |
| Theme toggle | `components/ThemeToggle.tsx` | Remove from `NavBar.tsx` |
| Scroll progress bar | `components/ScrollProgress.tsx` | Remove from `layout.tsx` |
| First-visit splash | `components/PageLoader.tsx` | Remove from `layout.tsx` |
| Voronoi hero background | `components/VoronoiCanvas.tsx` | Remove from `Hero.tsx` |

### PageLoader tuning

- Splash text: the `Saksham Arora` string in `PageLoader.tsx`
- Duration: `setTimeout(..., 800)` — change `800` (ms)
- Uses `sessionStorage` — shows once per browser session

---

## 20. Scripts and automation

### `npm run sync-photos`

Pulls images from a public Google Drive folder into `public/photos/`.

**Setup:**

1. Create a Google Cloud project with Drive API enabled.
2. Create an API key.
3. Share the Drive folder as “Anyone with the link”.
4. Add to `.env.local`:

```
GOOGLE_DRIVE_API_KEY=your_key
GOOGLE_DRIVE_FOLDER_ID=folder_id_from_url
```

5. Run: `npm run sync-photos`

**Warning:** Replaces all images in `public/photos/`. `_meta.json` is preserved.

### `node scripts/optimize-photos.mjs [folder]`

Compresses and sanitizes filenames.

```bash
node scripts/optimize-photos.mjs photos   # default
node scripts/optimize-photos.mjs pfp
node scripts/optimize-photos.mjs blog
```

- Resizes to max 2000px on long edge
- JPEG quality 78
- Renames files to `[A-Za-z0-9._-]+` pattern
- Auto-rotates from EXIF

Run before committing large camera originals.

---

## 21. SEO and metadata

| Scope | Location |
|-------|----------|
| Site-wide default | `app/layout.tsx` → `export const metadata` |
| Work page | `app/work/page.tsx` |
| Contact page | `app/contact/page.tsx` |
| Blog index | `app/blog/page.tsx` |
| Blog post | `app/blog/[slug]/page.tsx` → `generateMetadata()` |

Blog post Open Graph images come from the `cover` frontmatter field.

---

## 22. Build, test, and deploy

### Pre-deploy checklist

```bash
npm run lint          # optional but recommended
npm run build         # must pass with zero errors
```

Fix TypeScript errors, missing imports, and broken image paths before pushing.

### Deploy to Vercel (current default)

1. Connect the GitHub repo to [Vercel](https://vercel.com).
2. Framework preset: **Next.js**.
3. Build command: `npm run build`.
4. Output: default (`.next`).
5. Push to `main` → auto-deploy.

No environment variables needed unless you run Drive sync in CI (unusual).

### Deploy to GitHub Pages (static export)

The site is not pre-configured for GitHub Pages. To use it:

1. Update `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  // If repo is username.github.io/repo-name (not a user site):
  // basePath: "/repo-name",
  // assetPrefix: "/repo-name/",
};

export default nextConfig;
```

2. Build:

```bash
npm run build
# Output lands in out/
```

3. Deploy `out/` to GitHub Pages (branch `gh-pages` or `/docs` folder).

**Caveats for static export:**

- No server-side features at runtime (the site already uses build-time data loading, so this mostly works).
- `next/image` needs `images: { unoptimized: true }` or a custom loader.
- API routes (`app/api/`) will not work on static hosting (the photos API is unused by the UI).

### What gets baked at build time

- All photos from `public/photos/` (with metadata and dimensions)
- All profile photos from `public/pfp/`
- All blog posts from `content/posts/`
- Static params for `/blog/[slug]`

---

## 23. Git workflow for changes

```bash
# 1. Create a branch (recommended for larger changes)
git checkout -b feature/add-blog-post

# 2. Make your edits

# 3. Verify build
npm run build

# 4. Stage and commit
git add .
git commit -m "Add blog post on causal inference"

# 5. Push
git push -u origin feature/add-blog-post

# 6. Open a PR or merge to main (triggers deploy on Vercel)
```

### What to commit

| Commit | Don't commit |
|--------|--------------|
| Source code (`app/`, `components/`, `lib/`) | `node_modules/` |
| Content (`content/posts/`) | `.next/` |
| Optimized images (`public/`) | `.env.local` (secrets) |
| Config files | `out/` (build output) |

`.gitignore` already excludes `node_modules`, `.next`, `out`, `.env*`.

### Large image batches

1. Run `node scripts/optimize-photos.mjs photos` first.
2. Commit optimized files — avoid multi-hundred-MB camera RAWs.

---

## 24. Decision tree: “I want to add…”

```
I want to add…
│
├─ Text/copy on an existing page
│   └─ Find the page component in components/ or app/ → edit JSX
│
├─ A new blog post
│   └─ content/posts/slug.md + images in public/blog/
│
├─ Gallery photos
│   └─ public/photos/ (+ optional _meta.json)
│       └─ Large batch? → optimize-photos.mjs or npm run sync-photos
│
├─ A new project
│   └─ lib/projects.ts → add to projects array
│
├─ Work history / award / skill
│   └─ components/Work.tsx → timeline / recognition / skillsCols
│
├─ A new top-level page (/foo)
│   └─ app/foo/page.tsx + NavBar items array + active logic
│
├─ A new UI widget on an existing page
│   └─ components/MyWidget.tsx ("use client" if interactive)
│       └─ Import in the relevant app/*/page.tsx
│
├─ A new social link
│   └─ URL constants in NavBar.tsx / Contact.tsx / Photography.tsx
│       └─ Contact card? → cards array in Contact.tsx
│
├─ Change colors or fonts
│   └─ globals.css (colors) + layout.tsx + tailwind.config.ts (fonts)
│
├─ Change site title for Google
│   └─ app/layout.tsx → metadata
│
└─ Something entirely new (e.g. /resume page, podcast section)
    └─ New app route + new component + NavBar entry + metadata
        └─ Follow §10 and §11
```

---

## 25. Troubleshooting

### Photos don't appear after adding them

- Filename has spaces or special characters → run `optimize-photos.mjs` or rename to `[A-Za-z0-9._-]+`.
- Dev server cache → restart `npm run dev`.
- Production → push and wait for redeploy.

### `_meta.json` changes don't show

- Validate JSON syntax (jsonlint.com).
- Filename keys must **exactly** match image filenames (case-sensitive).

### Blog post returns 404

- File must be `content/posts/your-slug.md`.
- URL slug = filename without `.md`.
- Rebuild after adding new posts.

### Dark mode logo invisible on timeline

- Add `darkSrc` pointing to a light/white logo variant:

```ts
logo: { src: "/logo/dark-logo.png", darkSrc: "/logo/light-logo.png" }
```

### Build fails

```bash
npm run build
```

Common causes:

- TypeScript error in a file you edited.
- Bad import path — use `@/` prefix for project-root imports.
- Referenced image doesn't exist in `public/`.

### Port 3000 already in use

The dev script tries to kill port 3000 automatically. If it fails:

```bash
lsof -ti tcp:3000 | xargs kill -9
npm run dev
```

### Theme flash on first load

Normal with `next-themes`. Keep `suppressHydrationWarning` on `<html>` in `layout.tsx`.

### Tailwind classes not applying on a new component

- Component must live under `components/` or `app/` at repo root (not `github-pages/`).
- Check `tailwind.config.ts` → `content` paths.

### `npm run sync-photos` fails

- Verify `.env.local` has both `GOOGLE_DRIVE_API_KEY` and `GOOGLE_DRIVE_FOLDER_ID`.
- Drive folder must be shared as “Anyone with the link can view”.
- Drive API must be enabled in Google Cloud Console.

---

## 26. Unused / legacy code

| File | Status |
|------|--------|
| `components/About.tsx` | Full about section — not rendered. Wire into a page or delete. |
| `components/Hero.tsx` → `highlights` array | Defined but not rendered in JSX. |
| `lib/useCountUp.ts` | Hook — not imported anywhere. |
| `app/api/photos/route.ts` | JSON endpoint — UI reads photos via server props instead. |
| `github-pages/components/VoronoiCanvas.tsx` | Stale copy — use `components/VoronoiCanvas.tsx` at repo root. |

---

## 27. Appendix: file → responsibility map

```
/  (Home)
├── app/page.tsx
├── components/Hero.tsx
│   └── components/VoronoiCanvas.tsx
├── components/SectionDivider.tsx
└── components/Photography.tsx
    ├── components/PhotoCarousel.tsx
    ├── components/Lightbox.tsx
    └── lib/getPhotos.ts + lib/photographyConfig.ts

/work
├── app/work/page.tsx
├── components/Work.tsx
│   └── components/ProjectDialog.tsx
└── lib/projects.ts

/contact
├── app/contact/page.tsx
└── components/Contact.tsx

/blog
├── app/blog/page.tsx
├── app/blog/[slug]/page.tsx
├── components/BlogPostView.tsx
├── components/BlogTagFilter.tsx
├── lib/posts.ts
└── content/posts/*.md

Global (every page)
├── app/layout.tsx
├── app/globals.css
├── tailwind.config.ts
├── components/NavBar.tsx
├── components/ThemeToggle.tsx
├── components/ThemeProvider.tsx
├── components/ScrollProgress.tsx
└── components/PageLoader.tsx
```

### Tailwind utility cheat sheet

| Class | Meaning |
|-------|---------|
| `font-display` | Playfair Display (headings) |
| `font-sans` | Teachers (body) |
| `font-mono` | JetBrains Mono (labels) |
| `text-primary` | Main text color |
| `text-secondary` | Muted text |
| `text-accent` | Orange highlight |
| `bg-surface` | Card/panel background |
| `bg-background` | Page background |
| `border-border` | Standard border |
| `bg-accent-light` | Peach tag background |
| `max-w-6xl` | Main content width |
| `py-24 md:py-32` | Standard section padding |

---

## Quick commands reference

```bash
npm install                              # first-time setup
npm run dev                              # local dev server
npm run build                            # production build
npm start                                # serve production build
npm run lint                             # ESLint
npm run sync-photos                      # pull from Google Drive
node scripts/optimize-photos.mjs photos  # compress gallery
node scripts/optimize-photos.mjs pfp     # compress profile photos
```

---

*Last updated: August 2026. Extend this guide when you add new pages, routes, or deployment targets.*
