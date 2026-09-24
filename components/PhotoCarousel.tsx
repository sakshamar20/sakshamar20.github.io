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

type BentoTile = {
  photo: Photo;
  row: number;
  column: number;
  rowSpan: number;
  columnSpan: number;
  filler?: boolean;
};

type BentoLayout = {
  tiles: BentoTile[];
  columnCount: number;
};

function aspect(p: Photo) {
  return p.width / Math.max(1, p.height);
}

function seededRandom(value: string, seed: number) {
  let hash = 2166136261 ^ seed;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function orderPhotosForBento(photos: Photo[], seed: number) {
  const shuffle = (items: Photo[], offset: number) =>
    [...items].sort(
      (a, b) =>
        seededRandom(a.filename, seed + offset) -
        seededRandom(b.filename, seed + offset)
    );

  const portraits = shuffle(
    photos.filter((photo) => aspect(photo) < 0.9),
    101
  );
  const others = shuffle(
    photos.filter((photo) => aspect(photo) >= 0.9),
    211
  );
  const ordered: Photo[] = [];

  // Keep the selection organic, but do not allow the portrait bucket to be
  // exhausted as one uninterrupted block at either end of the carousel.
  while (portraits.length > 0 || others.length > 0) {
    const lastWasPortrait =
      ordered.length > 0 && aspect(ordered[ordered.length - 1]) < 0.9;
    const remainingTotal = portraits.length + others.length;
    const portraitShare = portraits.length / Math.max(1, remainingTotal);
    const random = seededRandom(`order-${ordered.length}`, seed + 307);
    const mustTakePortrait =
      portraits.length > 0 && portraits.length >= others.length;
    const takePortrait =
      portraits.length > 0 &&
      (!lastWasPortrait || others.length === 0) &&
      (others.length === 0 || mustTakePortrait || random < portraitShare);

    if (takePortrait) ordered.push(portraits.shift()!);
    else if (others.length > 0) ordered.push(others.shift()!);
    else ordered.push(portraits.shift()!);
  }

  return ordered;
}

function chooseSpan(photo: Photo, index: number, rows: number, seed: number) {
  if (rows === 1) {
    return {
      rowSpan: 1,
      columnSpan:
        aspect(photo) > 1.15 && seededRandom(photo.filename, seed + index) > 0.2
          ? 2
          : 1,
    };
  }

  const ratio = aspect(photo);
  const random = seededRandom(photo.filename, seed + index);

  // Portraits become tall bento blocks; landscapes are randomly allowed to
  // become wide blocks. Near-square photos vary to keep the layout organic.
  if (ratio < 0.9) return { rowSpan: 2, columnSpan: 1 };
  if (ratio > 1.1) {
    return { rowSpan: 1, columnSpan: random < 0.72 ? 2 : 1 };
  }
  if (random < 0.3) return { rowSpan: 2, columnSpan: 1 };
  if (random < 0.65) return { rowSpan: 1, columnSpan: 2 };
  return { rowSpan: 1, columnSpan: 1 };
}

/** Packs orientation-aware spans into a dense, gap-free horizontal grid. */
function packBento(photos: Photo[], requestedRows: number, seed: number): BentoLayout {
  const rows = Math.max(1, Math.round(requestedRows));
  const orderedPhotos = orderPhotosForBento(photos, seed);
  const occupied: boolean[][] = Array.from({ length: rows }, () => []);
  const tiles: BentoTile[] = [];
  let tallTileIndex = 0;
  const startTallTilesAtBottom = seed % 2 === 1;

  const fits = (
    row: number,
    column: number,
    rowSpan: number,
    columnSpan: number
  ) => {
    if (row + rowSpan > rows) return false;
    for (let r = row; r < row + rowSpan; r += 1) {
      for (let c = column; c < column + columnSpan; c += 1) {
        if (occupied[r][c]) return false;
      }
    }
    return true;
  };

  const occupy = (tile: BentoTile) => {
    for (let r = tile.row; r < tile.row + tile.rowSpan; r += 1) {
      for (let c = tile.column; c < tile.column + tile.columnSpan; c += 1) {
        occupied[r][c] = true;
      }
    }
  };

  orderedPhotos.forEach((photo, index) => {
    const { rowSpan, columnSpan } = chooseSpan(photo, index, rows, seed);
    let column = 0;
    let placed = false;

    while (!placed) {
      const possibleRows = Array.from(
        { length: rows - rowSpan + 1 },
        (_, row) => row
      );
      const placeTallTileAtBottom =
        rowSpan > 1 &&
        (tallTileIndex % 2 === 0
          ? startTallTilesAtBottom
          : !startTallTilesAtBottom);
      if (
        placeTallTileAtBottom ||
        (rowSpan === 1 && seededRandom(photo.filename, seed + 401) < 0.5)
      ) {
        possibleRows.reverse();
      }

      // Leave at least one base column between tall blocks. Wide and square
      // photos can then occupy that space instead of portraits forming a wall.
      const touchesTallTile =
        rowSpan > 1 &&
        tiles.some(
          (tile) =>
            tile.rowSpan > 1 &&
            column <= tile.column + tile.columnSpan &&
            column + columnSpan >= tile.column
        );

      if (touchesTallTile) {
        column += 1;
        continue;
      }

      for (const row of possibleRows) {
        if (!fits(row, column, rowSpan, columnSpan)) continue;
        const tile = { photo, row, column, rowSpan, columnSpan };
        tiles.push(tile);
        occupy(tile);
        if (rowSpan > 1) tallTileIndex += 1;
        placed = true;
        break;
      }
      if (!placed) column += 1;
    }
  });

  const columnCount = tiles.reduce(
    (max, tile) => Math.max(max, tile.column + tile.columnSpan),
    0
  );

  // Complete any holes at the edge with deterministic 1×1 filler tiles so
  // the repeated track joins seamlessly without blank cells.
  let fillerIndex = 0;
  for (let column = 0; column < columnCount; column += 1) {
    for (let row = 0; row < rows; row += 1) {
      if (occupied[row][column]) continue;
      const tile: BentoTile = {
        photo: orderedPhotos[fillerIndex % orderedPhotos.length],
        row,
        column,
        rowSpan: 1,
        columnSpan: 1,
        filler: true,
      };
      fillerIndex += 1;
      tiles.push(tile);
      occupy(tile);
    }
  }

  return { tiles, columnCount };
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
    carouselPhotosPerColumn,
    carouselLayoutSeed,
    carouselGapPx,
    carouselEdgeZonePx,
    carouselFastForwardMultiplier,
  } = photographyConfig;

  const rowCount = Math.max(1, Math.round(carouselPhotosPerColumn));
  const unitSize =
    (carouselHeightPx - carouselGapPx * Math.max(0, rowCount - 1)) /
    rowCount;

  const layout = useMemo(
    () => packBento(photos, carouselPhotosPerColumn, carouselLayoutSeed),
    [photos, carouselPhotosPerColumn, carouselLayoutSeed]
  );

  const { track, trackColumnCount } = useMemo(() => {
    if (layout.columnCount === 0) {
      return { track: [] as BentoTile[], trackColumnCount: 0 };
    }

    // Make each half comfortably wider than the viewport, then duplicate it
    // exactly so the animation can wrap without changing the arrangement.
    const repeats = Math.max(1, Math.ceil(14 / layout.columnCount));
    const halfColumnCount = layout.columnCount * repeats;
    const half = Array.from({ length: repeats }, (_, repeatIndex) =>
      layout.tiles.map((tile) => ({
        ...tile,
        column: tile.column + repeatIndex * layout.columnCount,
      }))
    ).flat();

    return {
      track: [
        ...half,
        ...half.map((tile) => ({
          ...tile,
          column: tile.column + halfColumnCount,
        })),
      ],
      trackColumnCount: halfColumnCount * 2,
    };
  }, [layout]);

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
          className="grid w-max will-change-transform"
          style={{
            gridTemplateRows: `repeat(${rowCount}, ${unitSize}px)`,
            gridTemplateColumns: `repeat(${trackColumnCount}, ${unitSize}px)`,
            gap: carouselGapPx,
            height: carouselHeightPx,
          }}
        >
          {track.map((tile, tileIndex) => {
            const width =
              unitSize * tile.columnSpan +
              carouselGapPx * (tile.columnSpan - 1);
            const height =
              unitSize * tile.rowSpan + carouselGapPx * (tile.rowSpan - 1);

            return (
            <div
              key={`${tile.photo.filename}-${tile.column}-${tile.row}-${tileIndex}`}
              className="relative"
              style={{
                gridRow: `${tile.row + 1} / span ${tile.rowSpan}`,
                gridColumn: `${tile.column + 1} / span ${tile.columnSpan}`,
              }}
            >
              <PhotoTile
                photo={tile.photo}
                width={width}
                height={height}
                onOpen={onOpen}
                priority={tile.column < 5 && !tile.filler}
              />
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
