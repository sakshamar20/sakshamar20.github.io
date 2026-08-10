# SOP: Syncing photos from Google Drive

How to update the Photography section by adding/replacing photos in a Google
Drive folder instead of manually dragging files into `public/photos/`.

## One-time setup

1. **Create a Google Cloud project** (or reuse one) at
   [console.cloud.google.com](https://console.cloud.google.com/).
2. **Enable the Drive API**: APIs & Services → Library → search "Google Drive
   API" → Enable.
3. **Create an API key**: APIs & Services → Credentials → Create Credentials →
   API key. Copy it.
   - Optional but recommended: restrict the key to only the Drive API under
     "API restrictions".
4. **Share the Drive folder publicly**: right-click the folder → Share →
   General access → "Anyone with the link" → Viewer.
5. **Get the folder ID**: from the folder's URL —
   `https://drive.google.com/drive/folders/`**`THIS_PART`**`?usp=sharing`.
6. **Create `.env.local`** in the project root (already gitignored) with:

   ```bash
   GOOGLE_DRIVE_API_KEY=your_api_key_here
   GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
   ```

   A template is available at `.env.example`.

## Every time you want to update photos

1. Add, remove, or replace compressed images in the Drive folder.
2. From the project root, run:

   ```bash
   npm run sync-photos
   ```

   This lists every image in the Drive folder, downloads it, sanitizes the
   filename, and drops it into `public/photos/` — **replacing** whatever
   images were there before. `public/photos/_meta.json` is left untouched.
3. If you renamed or removed photos, check `public/photos/_meta.json` for
   entries pointing at filenames that no longer exist and update/remove them
   (captions/series/featured flags are keyed by filename).
4. Commit and deploy as normal:

   ```bash
   git add public/photos
   git commit -m "Update photography section"
   git push
   ```

## Troubleshooting

- **`Drive API error 403`**: the folder isn't shared as "Anyone with the
  link," or the API key is restricted to the wrong API.
- **`No images found`**: double-check `GOOGLE_DRIVE_FOLDER_ID` — it must be
  the folder's ID, not the full URL.
- **`Missing GOOGLE_DRIVE_API_KEY or GOOGLE_DRIVE_FOLDER_ID`**: make sure
  `.env.local` exists in the project root and you ran the script via
  `npm run sync-photos` (which loads it with `node --env-file=.env.local`).

## Relevant files

- `scripts/sync-drive-photos.mjs` — the sync script.
- `.env.example` — template for the required environment variables.
- `lib/getPhotos.ts` — reads photos from `public/photos/` at build time (this
  is what the site actually renders; the sync script just automates keeping
  that folder up to date).
