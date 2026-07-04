import { useRef } from "react";
import { IconChevronLeft, IconChevronRight, IconGem } from "./icons";

interface Offer {
  title: string;
  subtitle: string;
}

const offers: Offer[] = [
  { title: "7.5% Assured Cashback*", subtitle: "on a minimum spend of ₹100" },
  { title: "10% Instant Discount*", subtitle: "on Vyraaa Gold Card" },
  { title: "Flat ₹150 Off*", subtitle: "on orders above ₹999" },
  { title: "Free Gift Wrap", subtitle: "on all jewellery orders" },
];

const OffersStrip = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <div className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <IconGem className="h-4 w-4 text-primary" />
        <span className="font-body text-sm font-semibold text-heading">
          Offers ({offers.length})
        </span>
      </div>

      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous offer"
          className="hidden shrink-0 rounded-full border border-border p-1.5 text-muted transition-colors hover:text-primary sm:flex"
        >
          <IconChevronLeft className="h-4 w-4" />
        </button>

        <div
          ref={trackRef}
          className="flex flex-1 gap-3 overflow-x-auto scroll-smooth px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {offers.map((offer, i) => (
            <div
              key={i}
              className="flex min-w-[220px] items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-card font-heading text-xs text-primary">
                %
              </span>
              <div className="min-w-0">
                <p className="truncate font-body text-xs font-semibold text-heading">
                  {offer.title}
                </p>
                <p className="truncate font-body text-[11px] text-muted">
                  {offer.subtitle}{" "}
                  <span className="text-primary">T&amp;C</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Next offer"
          className="hidden shrink-0 rounded-full border border-border p-1.5 text-muted transition-colors hover:text-primary sm:flex"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OffersStrip;
