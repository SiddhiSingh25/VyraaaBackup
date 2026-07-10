import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { Offer } from "../types";

interface OfferCarouselProps {
  offers: Offer[];
}

export default function OfferCarousel({ offers }: OfferCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 280;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(index);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 280;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  };

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-body text-sm font-semibold tracking-wide text-admin-text">
          Offers &amp; Cashback
        </h2>
        <span className="font-body text-xs text-muted">{offers.length} available</span>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-4 overflow-x-auto pb-1"
      >
        {offers.map((offer, i) => {
          const Icon = (Icons as any)[offer.icon] ?? Icons.Sparkles;
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="vyraaa-card-shadow flex w-[260px] shrink-0 flex-col gap-2 rounded-2xl border border-border bg-card px-4 py-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
              <p className="font-heading text-[15px] leading-tight text-admin-text">
                {offer.title}
              </p>
              <p className="font-body text-xs leading-snug text-muted">
                {offer.description}
              </p>
              <button className="mt-1 w-fit font-body text-xs font-medium text-primary underline-offset-2 hover:underline">
                View Details →
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to offer ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 18 : 6,
              backgroundColor: i === activeIndex ? "#835240" : "#e6d9cf",
            }}
          />
        ))}
      </div>
    </div>
  );
}
