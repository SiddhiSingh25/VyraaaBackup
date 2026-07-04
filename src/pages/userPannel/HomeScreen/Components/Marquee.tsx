interface MarqueeItem {
  text: string;
}

const ITEMS: MarqueeItem[] = [
  { text: "Complimentary Luxury Packaging" },
  { text: "Free Shipping on Orders Above ₹2,999" },
  { text: "Premium Craftsmanship" },
  { text: "Curated Luxury Collection" },
  { text: "Secure Payments • Easy Returns" },
];

function MarqueeRow() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-3 px-6 whitespace-nowrap font-serif text-[10px] uppercase tracking-[0.28em] text-primary-light/95"
        >
          <span className="h-[3px] w-[3px] rounded-full bg-primary-light flex-shrink-0" />
          <span>{item.text}</span>
        </span>
      ))}
    </>
  );
}

export default function MarqueeBar() {
  return (
    <div
      role="marquee"
      aria-label="Brand Highlights"
      className="overflow-hidden bg-primary-dark border-y border-primary-dark/40 py-2 select-none"
    >
      <div className="flex w-max animate-[marquee-scroll_90s_linear_infinite] hover:[animation-play-state:paused]">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}