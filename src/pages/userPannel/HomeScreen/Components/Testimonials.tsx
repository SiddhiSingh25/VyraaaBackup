import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Gem, BadgeCheck } from "lucide-react";
import { useReveal } from "../../../../hooks/gsap/useReveal";

interface Testimonial {
  name: string;
  location: string;
  verified: boolean;
  initials: string;
  quote: string;
  productLabel: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sophia M.",
    location: "Mumbai, India",
    verified: true,
    initials: "SM",
    quote:
      "VYRAAA is my signature scent. Elegant, long-lasting and absolutely unforgettable.",
    productLabel: "Desert Oudh Eau De Parfum",
  },
  {
    name: "Aria Noor",
    location: "Dubai, UAE",
    verified: true,
    initials: "AN",
    quote:
      "The only brand that makes me feel like time has slowed down. The Seraphina Skirt is already a wardrobe cornerstone.",
    productLabel: "Seraphina Skirt",
  },
  {
    name: "Isabelle Marchand",
    location: "Paris, France",
    verified: true,
    initials: "IM",
    quote:
      "There is a quietness to VYRAAA that is rare. People ask me about this scent everywhere I go.",
    productLabel: "Desert Oudh Eau De Parfum",
  },
  {
    name: "Priya Verma",
    location: "Delhi, India",
    verified: true,
    initials: "PV",
    quote:
      "The Solstice Cuff is unlike anything I've seen at this price point. Sculptural, bold, endlessly elegant.",
    productLabel: "Solstice Cuff",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className="text-rose-gold fill-rose-gold"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useReveal<HTMLElement>();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = TESTIMONIALS.length;

  const goTo = (next: number, dir: "next" | "prev") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    window.setTimeout(() => {
      setIndex(((next % total) + total) % total);
      setAnimating(false);
    }, 280);
  };

  const handleNext = () => goTo(index + 1, "next");
  const handlePrev = () => goTo(index - 1, "prev");

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo(index + 1, "next");
    }, 5500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  });

  const current = TESTIMONIALS[index];

  return (
    <section ref={ref} className="py-10 bg-background">
      <div className="px-5 sm:px-10 lg:px-20 ">
        <div data-reveal className="text-center mb-6 sm:mb-8">
          <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary mb-2 block">
            What Our Customers Say
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-primary/40" />
            <Gem size={14} className="text-primary/90" />
            <span className="w-10 h-px bg-primary/40" />
          </div>
        </div>

        <div data-reveal className="relative flex items-center justify-center">
          {/* Prev arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="absolute left-0 sm:-left-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-admin-text hover:border-primary-light hover:scale-105 active:scale-95 transition-all duration-300 ease-out flex-shrink-0"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Content */}
          <div className="overflow-hidden w-full px-12 sm:px-20">
            <div
              key={index}
              className={`flex flex-col items-center text-center gap-6 transition-all duration-300 ease-out
                ${animating ? "opacity-0" : "opacity-100"}
                ${
                  animating
                    ? direction === "next"
                      ? "-translate-x-4"
                      : "translate-x-4"
                    : "translate-x-0"
                }`}
            >
              <Stars />

              {/* <Quote size={28} className="text-primary-light/50 -mb-2" /> */}

              <p className="font-heading italic font-light leading-relaxed text-admin-text text-[clamp(18px,2.6vw,28px)] max-w-[640px]">
                {current.quote}
              </p>

              <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase text-primary">
                {current.productLabel}
              </div>

              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-admin-text text-xs font-medium flex-shrink-0">
                  {current.initials}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-admin-text text-sm">
                      {current.name}
                    </p>
                    {current.verified && (
                      <span className="flex items-center gap-0.5 text-primary text-[10px]">
                        <BadgeCheck size={13} />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">
                    {current.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={handleNext}
            aria-label="Next testimonial"
            className="absolute right-0 sm:-right-6 w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-border bg-surface flex items-center justify-center text-muted hover:text-admin-text hover:border-primary-light hover:scale-105 active:scale-95 transition-all duration-300 ease-out flex-shrink-0"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dots */}
        <div data-reveal className="flex items-center justify-center gap-2 mt-10 sm:mt-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => goTo(i, i > index ? "next" : "prev")}
              className={`rounded-full transition-all duration-300 ease-out ${
                i === index
                  ? "w-6 h-1.5 bg-primary"
                  : "w-1.5 h-1.5 bg-border hover:bg-primary-light"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}