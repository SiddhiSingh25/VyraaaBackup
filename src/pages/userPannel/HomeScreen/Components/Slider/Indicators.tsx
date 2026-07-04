interface IndicatorsProps {
  count: number;
  current: number;
  onSelect: (index: number) => void;
}

// Extracted verbatim from the original inline markup (same classes,
// same behaviour) — purely a structural extraction so HeroSlider isn't
// hand-rolling indicator markup inline.
export default function Indicators({ count, current, onSelect }: IndicatorsProps) {
  return (
    <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 items-center">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === current}
          onClick={() => onSelect(i)}
          className={`h-0.5 cursor-pointer transition-all duration-400 ${
            i === current ? "w-10 bg-white" : "w-6 bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}