"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "@/lib/getPhotos";
import { photographyConfig } from "@/lib/photographyConfig";

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/2wBDAAoKCgoKCgsMDAsPEA0QDxYUExMUFiIYGhoaGCIzJSUlJSUjMzMzMzMzMzNAQEBAQEBOTk5OTk5cXFxcXFxwcHBwcHCEhISE/9sAQwEKCgoKCgoLDAwLDxANEA8WFBMTFBYiGBoaGhgiMyUlJSUlIzMzMzMzMzMzQEBAQEBATk5OTk5OXFxcXFxccHBwcHBwhISEhP/AABEIAAoACgMBIgACEQMRAD8AlSKKKAP/2Q==";

type Props = {
  photos: Photo[];
  onOpen: (filename: string) => void;
};

type BentoCell =
  | { kind: "tall"; photo: Photo; width: number; height: number }
  | {
      kind: "stack";
      top: Photo;
      bottom: Photo;
      width: number;
      halfH: number;
    };

function aspect(p: Photo) {
  return p.width / Math.max(1, p.height);
}

function isPortrait(p: Photo) {
  return aspect(p) < 1;
}

/**
 * Portraits → one tile spanning full height (2 units).
 * Landscapes → always two stacked in the same column width (no empty gaps).
 */
function packBento(
  photos: Photo[],
  totalH: number,
  gap: number
): BentoCell[] {
  const half = (totalH - gap) / 2;
  const cells: BentoCell[] = [];
  const queue = [...photos];

  while (queue.length > 0) {
    const a = queue.shift()!;

    if (isPortrait(a)) {
      cells.push({
        kind: "tall",
        photo: a,
        width: totalH * aspect(a),
        height: totalH,
      });
      continue;
    }

    // Landscape: find another landscape to stack with
    const nextLandscapeIdx = queue.findIndex((p) => !isPortrait(p));
    if (nextLandscapeIdx === -1) {
      // Lone landscape — still span full height at its ratio
      cells.push({
        kind: "tall",
        photo: a,
        width: totalH * aspect(a),
        height: totalH,
      });
      continue;
    }

    const [b] = queue.splice(nextLandscapeIdx, 1);
    // Shared column width from the average landscape ratio at half-height
    const width = half * ((aspect(a) + aspect(b)) / 2);
    cells.push({
      kind: "stack",
      top: a,
      bottom: b,
      width,
      halfH: half,
    });
  }

  return cells;
}

function PhotoTile({
  photo,
  width,
  height,
  onOpen,
  priority,
}: {
  photo: Photo;
  width: number;
  height: number;
  onOpen: (filename: string) => void;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(photo.filename)}
      className="group relative shrink-0 overflow-hidden rounded-[10px] bg-surface transition-[transform,box-shadow,border-color] duration-300 ease-out hover:z-20 hover:scale-[1.05] hover:shadow-[0_12px_40px_rgb(0_0_0_/0.35)]"
      style={{ width, height }}
    >
      <Image
        src={photo.src}
        alt={photo.meta.alt ?? photo.filename}
        fill
        sizes={`${Math.ceil(width * 1.2)}px`}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover"
      />
      {photo.meta.location && (
        <span className="pointer-events-none absolute left-2 bottom-2 font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow">
          {photo.meta.location}
        </span>
      )}
    </button>
  );
}

function EdgeArrowZone({
  side,
  widthPx,
  onActivate,
  onDeactivate,
}: {
  side: "left" | "right";
  widthPx: number;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div
      role="presentation"
      aria-hidden
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      className={[
        "group absolute inset-y-0 z-30 flex items-center cursor-pointer",
        side === "left"
          ? "left-0 justify-start bg-gradient-to-r"
          : "right-0 justify-end bg-gradient-to-l",
        "from-background/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300",
      ].join(" ")}
      style={{ width: widthPx }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 20 20"
        fill="none"
        className={[
          "text-primary transition-transform duration-300",
          side === "left"
            ? "ml-3 group-hover:-translate-x-1"
            : "mr-3 group-hover:translate-x-1",
        ].join(" ")}
      >
        <path
          d={side === "left" ? "M12.5 4l-6 6 6 6" : "M7.5 4l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function PhotoCarousel({ photos, onOpen }: Props) {
  const [hovering, setHovering] = useState(false);
  const [fastForward, setFastForward] = useState(false);
  const {
    carouselDurationSec,
    carouselHeightPx,
    carouselGapPx,
    carouselEdgeZonePx,
    carouselFastForwardMultiplier,
  } = photographyConfig;

  const cells = useMemo(
    () => packBento(photos, carouselHeightPx, carouselGapPx),
    [photos, carouselHeightPx, carouselGapPx]
  );

  const sequence = useMemo(() => {
    if (cells.length === 0) return [];
    // Enough copies that one half of the track always exceeds the viewport.
    const min = 14;
    const n = Math.max(3, Math.ceil(min / cells.length));
    return Array.from({ length: n }, () => cells).flat();
  }, [cells]);

  const track = useMemo(() => [...sequence, ...sequence], [sequence]);

  // Position is driven by rAF instead of a CSS animation so that changing
  // speed (hover / fast-forward) never resets or jumps the scroll — the
  // browser doesn't reliably preserve progress when animation-duration
  // changes on a running keyframe animation.
  const trackRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const halfWidthRef = useRef(0);
  const speedRef = useRef(0); // px/sec for a full loop at normal speed
  const hoveringRef = useRef(hovering);
  const fastForwardRef = useRef(fastForward);

  useEffect(() => {
    hoveringRef.current = hovering;
  }, [hovering]);
  useEffect(() => {
    fastForwardRef.current = fastForward;
  }, [fastForward]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const computeWidths = () => {
      const half = el.scrollWidth / 2;
      halfWidthRef.current = half;
      speedRef.current = half > 0 ? half / carouselDurationSec : 0;
      // Keep position within bounds if the track resized.
      if (half > 0 && posRef.current <= -half) {
        posRef.current %= half;
      }
    };
    computeWidths();

    const ro = new ResizeObserver(computeWidths);
    ro.observe(el);

    let rafId: number;
    let lastTs: number | null = null;

    const loop = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const isPaused = hoveringRef.current && !fastForwardRef.current;
      const half = halfWidthRef.current;
      if (!isPaused && half > 0) {
        const multiplier = fastForwardRef.current
          ? carouselFastForwardMultiplier
          : 1;
        posRef.current -= speedRef.current * multiplier * dt;
        if (posRef.current <= -half) {
          posRef.current += half;
        }
        el.style.transform = `translateX(${posRef.current}px)`;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [carouselDurationSec, carouselFastForwardMultiplier, track]);

  if (photos.length === 0) return null;

  return (
    <div
      className="relative mt-8 w-screen max-w-[100vw] ml-[calc(-50vw+50%)]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setFastForward(false);
      }}
    >
      <EdgeArrowZone
        side="left"
        widthPx={carouselEdgeZonePx}
        onActivate={() => setFastForward(true)}
        onDeactivate={() => setFastForward(false)}
      />
      <EdgeArrowZone
        side="right"
        widthPx={carouselEdgeZonePx}
        onActivate={() => setFastForward(true)}
        onDeactivate={() => setFastForward(false)}
      />

      <div className="overflow-hidden py-10">
        <div
          ref={trackRef}
          className="flex w-max items-stretch will-change-transform"
          style={{
            gap: carouselGapPx,
            height: carouselHeightPx,
          }}
        >
          {track.map((cell, i) =>
            cell.kind === "tall" ? (
              <PhotoTile
                key={`tall-${cell.photo.filename}-${i}`}
                photo={cell.photo}
                width={cell.width}
                height={cell.height}
                onOpen={onOpen}
                priority={i < 8}
              />
            ) : (
              <div
                key={`stack-${cell.top.filename}-${i}`}
                className="flex shrink-0 flex-col"
                style={{ width: cell.width, gap: carouselGapPx }}
              >
                <PhotoTile
                  photo={cell.top}
                  width={cell.width}
                  height={cell.halfH}
                  onOpen={onOpen}
                  priority={i < 8}
                />
                <PhotoTile
                  photo={cell.bottom}
                  width={cell.width}
                  height={cell.halfH}
                  onOpen={onOpen}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
