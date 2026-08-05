import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const DEFAULT_FILENAME = "Profile Photo.png";

export async function getProfilePhotos(): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "pfp");
  let entries: string[] = [];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const files = entries
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => {
      if (a === DEFAULT_FILENAME) return -1;
      if (b === DEFAULT_FILENAME) return 1;
      return a.localeCompare(b);
    });

  return files.map((f) => `/pfp/${encodeURIComponent(f)}`);
}
