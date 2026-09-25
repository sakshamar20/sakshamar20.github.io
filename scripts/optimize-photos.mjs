import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
export const photosDirectory = path.join(projectRoot, "public", "photos");

const cachePath = path.join(photosDirectory, ".optimization-cache.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const maxDimension = 2000;
const imageQuality = 82;
const cacheVersion = `max-${maxDimension}-quality-${imageQuality}-v1`;

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function hashBuffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

async function loadCache() {
  try {
    const parsed = JSON.parse(await fs.readFile(cachePath, "utf8"));
    if (parsed.version === cacheVersion && parsed.files) return parsed;
  } catch {
    // A missing or stale cache simply causes one fresh optimization pass.
  }
  return { version: cacheVersion, files: {} };
}

async function saveCache(cache) {
  const temporaryPath = `${cachePath}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`);
  await fs.rename(temporaryPath, cachePath);
}

function encoderFor(extension, pipeline) {
  if (extension === ".jpg" || extension === ".jpeg") {
    return pipeline.jpeg({
      quality: imageQuality,
      progressive: true,
      mozjpeg: true,
      chromaSubsampling: "4:2:0",
    });
  }
  if (extension === ".webp") {
    return pipeline.webp({ quality: imageQuality, effort: 5 });
  }
  return pipeline.png({ compressionLevel: 9, effort: 10 });
}

async function listPhotos() {
  const entries = await fs.readdir(photosDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((filename) => imageExtensions.has(path.extname(filename).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

async function optimizePhoto(filename, cache) {
  const filePath = path.join(photosDirectory, filename);
  const extension = path.extname(filename).toLowerCase();
  const input = await fs.readFile(filePath);
  const inputHash = hashBuffer(input);

  if (cache.files[filename]?.hash === inputHash) {
    return { changed: false, before: input.length, after: input.length };
  }

  const metadata = await sharp(input).metadata();
  const needsResize =
    Math.max(metadata.width ?? 0, metadata.height ?? 0) > maxDimension;
  const pipeline = sharp(input)
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    });
  const output = await encoderFor(extension, pipeline).toBuffer();

  // Keep the original only when encoding provides no size benefit and no
  // resize was required. Either way, record the hash to avoid repeat work.
  const shouldReplace = needsResize || output.length < input.length;
  const finalBuffer = shouldReplace ? output : input;

  if (shouldReplace) {
    const temporaryPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(temporaryPath, finalBuffer);
    await fs.rename(temporaryPath, filePath);
  }

  cache.files[filename] = {
    hash: hashBuffer(finalBuffer),
    optimizedAt: new Date().toISOString(),
  };

  return {
    changed: shouldReplace,
    before: input.length,
    after: finalBuffer.length,
  };
}

export async function optimizePhotos({ quiet = false } = {}) {
  await fs.mkdir(photosDirectory, { recursive: true });
  const filenames = await listPhotos();
  const cache = await loadCache();
  const activeFiles = new Set(filenames);
  let changed = 0;
  let before = 0;
  let after = 0;

  for (const filename of filenames) {
    try {
      const result = await optimizePhoto(filename, cache);
      before += result.before;
      after += result.after;
      if (result.changed) changed += 1;
    } catch (error) {
      console.warn(`[photos] Could not optimize ${filename}: ${error.message}`);
    }
  }

  for (const filename of Object.keys(cache.files)) {
    if (!activeFiles.has(filename)) delete cache.files[filename];
  }
  await saveCache(cache);

  if (!quiet) {
    if (changed === 0) {
      console.log(`[photos] ${filenames.length} photos already optimized.`);
    } else {
      console.log(
        `[photos] Optimized ${changed} photos: ${formatBytes(before)} → ${formatBytes(after)}.`
      );
    }
  }

  return { total: filenames.length, changed, before, after };
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  await optimizePhotos();
}
