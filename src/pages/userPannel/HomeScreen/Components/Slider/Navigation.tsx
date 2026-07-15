interface NavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

// Kept deliberately minimal (thin chevrons, no circles/backgrounds) —
// loud arrow buttons read as "stock template," whereas Chanel/Dior
// hero banners favour near-invisible controls that appear on hover.
export default function Navigation({ onPrev, onNext }: NavigationProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Previous slide"
        onClick={onPrev}
        className="group absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white transition-colors duration-300"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={onNext}
        className="group absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2 text-white/50 hover:text-white transition-colors duration-300"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}