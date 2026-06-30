interface MarqueeItem {
  type: "sale" | "plain";
  text: string;
  pct?: string;
}

const ITEMS: MarqueeItem[] = [
  { type: "sale", text: "Summer Sale — Up to", pct: "40% Off" },
  { type: "plain", text: "Free Shipping on Orders Over ₹2,999" },
  { type: "sale", text: "New Arrivals —", pct: "20% Off" },
  { type: "plain", text: "Complimentary Gift Wrapping" },
  { type: "sale", text: "Exclusive Members —", pct: "Extra 15%" },
  { type: "plain", text: "Crafted with Premium Ingredients" },
  { type: "sale", text: "Limited Edition — Use Code", pct: "LUXURY20" },
  { type: "plain", text: "Ethically Sourced · Long-Lasting Fragrance" },
];

function MarqueeRow() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-3.5 px-7 font-serif text-[11px] tracking-[0.2em] uppercase text-primary-light whitespace-nowrap"
        >
          <span className="w-[3px] h-[3px] rounded-full bg-primary flex-shrink-0" />
          <span>
            {item.text}
            {item.pct && (
              <span className="ml-2 inline-flex items-center justify-center bg-primary-light text-primary-dark text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded-sm">
                {item.pct}
              </span>
            )}
          </span>
        </span>
      ))}
    </>
  );
}

export default function MarqueeBar() {
  return (
    <div
      role="marquee"
      aria-label="Promotional offers"
      className="mt-16 bg-primary-dark overflow-hidden py-1.5 border-y border-primary-dark/60 select-none"
    >
      <div className="flex w-max animate-[marquee-scroll_100s_linear_infinite] hover:[animation-play-state:paused]">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}