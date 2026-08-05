"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Lightbox from "./Lightbox";
import PhotoCarousel from "./PhotoCarousel";
import type { Photo, PhotoData } from "@/lib/getPhotos";
import {
  photographyConfig,
  type PhotographyMode,
} from "@/lib/photographyConfig";

const ALL = "All";
const INITIAL_COUNT = 9;
const COLLAPSED_HEIGHT_PX = 640;
const INSTAGRAM_URL = "https://www.instagram.com/highhonshots";
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA0QDxYUExMUFiIYGhoaGCIzJSUlJSUjMzMzMzMzMzNAQEBAQEBOTk5OTk5cXFxcXFxwcHBwcHCEhISE/9sAQwEKCgoKCgoLDAwLDxANEA8WFBMTFBYiGBoaGhgiMyUlJSUlIzMzMzMzMzMzQEBAQEBATk5OTk5OXFxcXFxccHBwcHBwhISEhP/AABEIAAoACgMBIgACEQMRAD8AlSKKKAP/2Q==";

/** Original column / masonry gallery — kept intact; switch via photographyConfig.mode */
function MasonryGallery({
  photos,
  filtered,
  showFilter,
  series,
  onOpen,
}: {
  photos: Photo[];
  filtered: Photo[];
  showFilter: boolean;
  series: string[];
  onOpen: (filename: string) => void;
}) {
  const [active, setActive] = useState<string>(ALL);
  const [showAll, setShowAll] = useState(false);

  const seriesFiltered = useMemo(() => {
    if (active === ALL) return filtered;
    return filtered.filter((p) => p.meta.series === active);
  }, [active, filtered]);

  const hasMore = !showAll && seriesFiltered.length > INITIAL_COUNT;
  const { gridTileWidthPx, gridGapPx } = photographyConfig;

  return (
    <>
      {showFilter && (
        <div className="mt-8 flex flex-wrap gap-2">
          {[ALL, ...series].map((s) => (
            <button
              key={s}
              onClick={() => {
                setActive(s);
                setShowAll(false);
              }}
              className={[
                "font-mono text-[11px] tracking-wide uppercase px-3 py-1.5 rounded-full border transition-colors",
                active === s
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-secondary border-border hover:text-primary hover:border-primary/40",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="relative w-screen max-w-[100vw] ml-[calc(-50vw+50%)] px-5 md:px-8">
        <div
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: hasMore ? COLLAPSED_HEIGHT_PX : undefined }}
        >
          <div
            className="mt-8 [column-fill:_balance]"
            style={{ columnWidth: gridTileWidthPx, columnGap: gridGapPx }}
          >
            {seriesFiltered.map((p) => (
              <button
                key={p.filename}
                onClick={() => onOpen(p.filename)}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-[10px] transition-colors duration-300 bg-surface"
                style={{ marginBottom: gridGapPx }}
              >
                <div className="overflow-hidden">
                  <Image
                    src={p.src}
                    alt={p.meta.alt ?? p.filename}
                    width={800}
                    height={1000}
                    sizes={`${gridTileWidthPx}px`}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                {p.meta.location && (
                  <span className="pointer-events-none absolute left-3 bottom-2 font-mono text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {p.meta.location}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {hasMore && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-40 items-end justify-center bg-gradient-to-t from-background via-background/85 to-transparent">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="relative pointer-events-auto mb-8 font-mono text-[11px] tracking-[0.14em] uppercase px-4 py-2 rounded-full border border-border bg-surface text-secondary hover:text-primary hover:border-accent/40 transition-colors"
            >
              Show {seriesFiltered.length - INITIAL_COUNT} more
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function Photography({ photos }: { photos: PhotoData }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<PhotographyMode>(photographyConfig.mode);
  const [sepia, setSepia] = useState(false);

  const openByFilename = (filename: string) => {
    setLightboxIdx(photos.photos.findIndex((x) => x.filename === filename));
  };

  return (
    <section id="photography" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent mb-6">
          Photography
        </p>
        <h2 className="font-display text-primary text-[28px] md:text-[36px] mb-4">
          light, held still.
        </h2>
        <p className="font-display italic text-[20px] text-secondary text-center max-w-xl mx-auto leading-snug mb-3">
          a collection of landscapes, streets, and lights.
        </p>
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-tertiary text-center max-w-2xl mx-auto mb-6">
          Former Coordinator, Photography Club, IIT Kanpur
        </p>

        {photos.photos.length > 0 && (
          <div
            role="group"
            aria-label="Photography layout"
            className="mb-8 flex flex-wrap items-center justify-center gap-4"
          >
            <div className="inline-flex rounded-full border border-border p-0.5 bg-surface/60">
              {(
                [
                  { id: "carousel", label: "Carousel" },
                  { id: "masonry", label: "Grid" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  aria-pressed={mode === opt.id}
                  className={[
                    "relative font-mono text-[11px] tracking-[0.14em] uppercase px-4 py-1.5 rounded-full text-secondary transition-colors hover:text-primary",
                    mode === opt.id
                      ? "text-white hover:text-white"
                      : "",
                  ].join(" ")}
                >
                  {mode === opt.id && (
                    <motion.span
                      layoutId="photography-mode"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-pressed={sepia}
              onClick={() => setSepia((v) => !v)}
              className={[
                "rounded-full border border-border px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                sepia
                  ? "border-accent bg-accent text-white"
                  : "bg-surface/60 text-secondary hover:text-primary",
              ].join(" ")}
            >
              Sepia
            </button>
          </div>
        )}

        {photos.photos.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-10 text-center text-secondary text-sm">
            <p>
              No photos yet. Drop image files (.jpg, .jpeg, .png, .webp) into{" "}
              <code className="font-mono text-primary">/public/photos/</code>{" "}
              and they will appear here.
            </p>
          </div>
        ) : (
          <div
            style={
              sepia
                ? { filter: "sepia(0.85) contrast(1.05) saturate(1.1)" }
                : undefined
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {mode === "carousel" ? (
                  <>
                <PhotoCarousel photos={photos.photos} onOpen={openByFilename} />
                <p className="mt-6 text-center font-mono text-[12px] text-tertiary">
                  All photos shot through Galaxy S24 or Pixel 6a. Available
                  for commissions.
                </p>
                  </>
                ) : (
                  <>
                    <MasonryGallery
                      photos={photos.photos}
                      filtered={photos.photos}
                      showFilter={photos.hasMeta && photos.series.length > 0}
                      series={photos.series}
                      onOpen={openByFilename}
                    />
                    <p className="mt-10 text-center font-mono text-[12px] text-tertiary">
                      all photos are shot through Galaxy S24 or Pixel 6a. Available
                      for commissions.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {photos.photos.length > 0 && (
          <div className="mt-10 flex justify-center">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 text-[14px] text-secondary hover:text-primary transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden
              >
                <rect
                  x="2.5"
                  y="2.5"
                  width="17"
                  height="17"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="4.25"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <circle cx="15.75" cy="6.25" r="0.9" fill="currentColor" />
              </svg>
              <span>instagram &bull; highhonshots </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        )}
      </div>

      <Lightbox
        photos={photos.photos}
        index={lightboxIdx}
        onClose={() => setLightboxIdx(null)}
        onNavigate={(n) => setLightboxIdx(n)}
      />
    </section>
  );
}
