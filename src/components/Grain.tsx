/**
 * Static film grain. Rendered once as an inline SVG data URI rather than a live
 * <feTurbulence> filter over a full-viewport <rect>, so it costs nothing to
 * repaint on scroll or resize.
 */
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="140" height="140" filter="url(#n)"/></svg>`,
  );

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-multiply"
      style={{ backgroundImage: `url("${GRAIN}")`, backgroundRepeat: "repeat" }}
    />
  );
}
