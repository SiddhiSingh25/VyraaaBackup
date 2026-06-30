// Four overlay layers, stacked low-to-high z-index. Each one does a
// single job rather than one overlay trying to do everything — this
// is what keeps the result adjustable (e.g. designers can tune the
// vignette without touching the gradient meant for text contrast).
export default function SlideOverlay() {
  return (
    <>
      {/* 1. Dark luxury gradient — guarantees text contrast on the left
             where the copy sits, fades out toward the right so the
             product/scene stays visible. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-black/10 via-black/25 to-transparent" />

      {/* 2. Soft warm beige wash — the thing that makes a banner feel
             "Maison" rather than "stock photo"; a faint warm tint
             unifies otherwise-cool product photography. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[#E9DFC9]/[0.09] mix-blend-overlay" />

      {/* 3. Vignette — subtle darkening at the edges to pull the eye
             toward center/left content, echoes print-catalogue lighting. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.35)_100%)]" />

      {/* 4. Light rays — a faint diagonal glow, evokes studio backlight
             without resorting to an image asset. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0%,transparent_30%)]" />

      {/* Bottom-edge gradient ensures indicators/nav always sit on a
          dark-enough base regardless of the underlying image. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/40 to-transparent" />
    </>
  );
}