import { spawn } from "node:child_process";
import { watch } from "node:fs";
import path from "node:path";
import {
  optimizePhotos,
  photosDirectory,
  projectRoot,
} from "./optimize-photos.mjs";

const imagePattern = /\.(?:jpe?g|png|webp)$/i;

await optimizePhotos();

const nextBinary = path.join(
  projectRoot,
  "node_modules",
  "next",
  "dist",
  "bin",
  "next"
);
const next = spawn(process.execPath, [nextBinary, "dev", "-p", "3000"], {
  cwd: projectRoot,
  stdio: "inherit",
});

let debounceTimer;
let optimizationQueue = Promise.resolve();
let shuttingDown = false;
const watcher = watch(photosDirectory, (_eventType, filename) => {
  if (!filename || !imagePattern.test(filename.toString())) return;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    optimizationQueue = optimizationQueue
      .then(() => optimizePhotos())
      .catch((error) => console.error(`[photos] ${error.message}`));
  }, 500);
});

function shutDown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearTimeout(debounceTimer);
  watcher.close();
  if (!next.killed) next.kill(signal);
}

process.on("SIGINT", () => shutDown("SIGINT"));
process.on("SIGTERM", () => shutDown("SIGTERM"));

next.on("exit", (code, signal) => {
  watcher.close();
  process.exit(signal ? 0 : (code ?? 0));
});
