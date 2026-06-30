import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SLIDES } from "./Slides";
import Slide from "./Slide";
import Indicators from "./Indicators";
import Navigation from "./Navigation";
import { useIsMobile } from "./useIsMobile";

const AUTOPLAY_DELAY = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isMobile = useIsMobile();

  // useCallback: goTo is referenced by the autoplay timer, swipe
  // handlers and indicator clicks alike — memoizing it means none of
  // those need to be redeclared (and risk a stale closure) on every
  // render.
  const goTo = useCallback((n: number) => {
    setCurrent((prev) => {
      const next = (n + SLIDES.length) % SLIDES.length;
      return next === prev ? prev : next;
    });
  }, []);

  const goToIndex = useCallback((n: number) => goTo(n), [goTo]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Autoplay — restarts whenever `current` changes (manual nav resets
  // the timer too, which is the expected luxury-slider behaviour: a
  // user-initiated change shouldn't be immediately undone by autoplay).
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => goTo(current + 1), AUTOPLAY_DELAY);
    return () => clearTimeout(timerRef.current);
  }, [current, goTo]);

  // Swipe support (mobile). useCallback keeps these stable across
  // re-renders triggered by `current` changing.
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    },
    [goTo, current],
  );

  // Preload the *next* slide's image (the one most likely to be seen
  // next, whether via autoplay or a swipe) so its fade-in is instant.
  // Remaining slides are left to load lazily as the browser gets to
  // them — this is what "prevents layout shift / avoids over-fetching"
  // means in practice for a hero banner.
  const nextIndex = useMemo(() => (current + 1) % SLIDES.length, [current]);

  useEffect(() => {
    const nextSlide = SLIDES[nextIndex];
    const src = isMobile ? nextSlide.mobileImage : nextSlide.desktopImage;
    const img = new Image();
    img.src = src;
    void img;
  }, [nextIndex, isMobile]);

  return (
    <section
      ref={sectionRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      // Per the brief: h-screen on desktop/tablet, min-h-screen on
      // mobile (so tall content never gets clipped on small devices).
      className="relative h-screen md:h-screen min-h-screen md:min-h-[560px] w-full overflow-hidden bg-black"
    >
      {SLIDES.map((slide, i) => (
        <Slide
          key={i}
          slide={slide}
          isActive={i === current}
          priority={i === current || i === nextIndex}
        />
      ))}

      <Navigation onPrev={prev} onNext={next} />
      <Indicators count={SLIDES.length} current={current} onSelect={goToIndex} />
    </section>
  );
}