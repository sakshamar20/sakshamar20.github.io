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
  carouselDurationSec: 400,

  /** Total height of the 2-row bento strip (px). */
  carouselHeightPx: 300,

  /** Gap between photos (px). */
  carouselGapPx: 10,

  /** Width of the hoverable speed-up zone at each edge (px). */
  carouselEdgeZonePx: 110,

  /** How much faster the strip scrolls while hovering an edge zone. */
  carouselFastForwardMultiplier: 10,

  /**
   * Grid ("masonry") mode — target width per photo tile (px).
   * The browser fits as many columns of roughly this width as the
   * viewport allows, so lowering this gives smaller, more numerous photos.
   */
  gridTileWidthPx: 200,

  /** Gap between tiles in grid mode (px). */
  gridGapPx: 8,
};
