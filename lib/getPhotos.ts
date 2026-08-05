import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export type PhotoMeta = {
  location?: string;
  series?: string;
  featured?: boolean;
  alt?: string;
};

export type Photo = {
  filename: string;
  src: string;
  meta: PhotoMeta;
  width: number;
  height: number;
};

export type PhotoData = {
  featured: Photo | null;
  photos: Photo[];
  series: string[];
  hasMeta: boolean;
};

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;

export async function getPhotos(): Promise<PhotoData> {
  const dir = path.join(process.cwd(), "public", "photos");
  let entries: string[] = [];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return { featured: null, photos: [], series: [], hasMeta: false };
  }

  let metaMap: Record<string, PhotoMeta> = {};
  let hasMeta = false;
  if (entries.includes("_meta.json")) {
    try {
      const raw = await fs.readFile(path.join(dir, "_meta.json"), "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        metaMap = parsed as Record<string, PhotoMeta>;
        hasMeta = true;
      }
    } catch {
      // Ignore malformed metadata; treat as missing.
    }
  }

  const files = entries
    .filter((f) => SAFE_FILENAME.test(f))
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const photos: Photo[] = await Promise.all(
    files.map(async (filename) => {
      let width = 4;
      let height = 3;
      try {
        const meta = await sharp(path.join(dir, filename)).metadata();
        if (meta.width && meta.height) {
          width = meta.width;
          height = meta.height;
        }
      } catch {
        // keep fallback ratio
      }
      return {
        filename,
        src: `/photos/${filename}`,
        meta: metaMap[filename] ?? {},
        width,
        height,
      };
    })
  );

  let featured: Photo | null = null;
  const explicit = photos.find((p) => p.meta.featured);
  featured = explicit ?? photos[0] ?? null;

  const seriesSet = new Set<string>();
  for (const p of photos) {
    if (p.meta.series) seriesSet.add(p.meta.series);
  }

  return {
    featured,
    photos,
    series: Array.from(seriesSet).sort(),
    hasMeta,
  };
}
