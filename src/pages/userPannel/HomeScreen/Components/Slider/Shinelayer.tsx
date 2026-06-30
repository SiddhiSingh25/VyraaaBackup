// A subtle diagonal light sweep, purely in CSS (no images, no GSAP —
// it's ambient and decorative, so letting the browser's compositor
// handle it via `animation` is cheaper than driving it from JS).
//
// Tailwind's arbitrary-value utilities can't express a keyframe
// animation, so the keyframes live in a <style> tag scoped to this
// component. If you have a global stylesheet, move `.shine-sweep` /
// `@keyframes shine-sweep` there instead and drop the <style> tag.
export default function ShineLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[15]">
      <div className="shine-sweep absolute -top-1/2 -left-1/3 h-[220%] w-1/4 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style>{`
        @keyframes shine-sweep {
          0% { transform: translateX(-120%) rotate(12deg); }
          45% { transform: translateX(420%) rotate(12deg); }
          100% { transform: translateX(420%) rotate(12deg); }
        }
        .shine-sweep {
          animation: shine-sweep 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .shine-sweep { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}