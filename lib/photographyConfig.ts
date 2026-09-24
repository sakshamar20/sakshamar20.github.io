/**
 * Photography section display mode.
 * - "carousel" — infinite auto-scrolling bento strip (default)
 * - "masonry"  — original column grid with "show more"
 *
 * This sets the initial mode; visitors can also toggle in the UI.
 */
export type PhotographyMode = "carousel" | "masonry";

export const photographyConfig = {
  mode: "carousel" as PhotographyMode,

  /** Seconds for one full loop. Higher = slower. */
  carouselDurationSec: 50,

  /** Total height of the carousel strip (px). */
  carouselHeightPx: 600,

  /**
   * Number of bento-tile rows in the carousel.
   * Use 1 for a single full-height row, 2 for larger photos, or 3 for a
   * denser mix where portraits can span two rows.
   */
  carouselPhotosPerColumn: 3,

  /** Change this number to generate a different stable bento arrangement. */
  carouselLayoutSeed: 7,

  /** Gap between photos (px). */
  carouselGapPx: 7,

  /** Width of the hoverable speed-up zone at each edge (px). */
  carouselEdgeZonePx: 300,

  /** How much faster the strip scrolls while hovering an edge zone. */
  carouselFastForwardMultiplier: 5,

  /**
   * Grid ("masonry") mode — target width per photo tile (px).
   * The browser fits as many columns of roughly this width as the
   * viewport allows, so lowering this gives smaller, more numerous photos.
   */
  gridTileWidthPx: 200,

  /** Gap between tiles in grid mode (px). */
  gridGapPx: 8,
};
