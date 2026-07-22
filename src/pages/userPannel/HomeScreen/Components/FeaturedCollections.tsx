import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

// Fallback / placeholder asset — swap for real per-collection footage once
// the API returns a `video` field.
import sampleVideo from "../../../../assets/video.mp4";

gsap.registerPlugin(ScrollTrigger);

// Matches index.css @theme tokens exactly (hex, not CSS vars — we need to
// append alpha e.g. `${accent}33`, which only works with hex strings).
const ACCENTS = ["#835240", "#b76e79", "#c98f7a", "#51291a", "#3D2A1E"];

// How many neighbors on EACH side stay visible → 2 + active + 2 = 5 cards on screen.
const VISIBLE_SIDE = 2;
// Auto-advance interval.
const AUTOPLAY_MS = 5000;

interface CollectionVideo {
  _id: string;
  video?: string;
  accent?: string;
  name?: string;
  title?: string;
  description?: string;
  slug?: string;
}

// shortest signed distance from `active` to `i` on a circular track of `total`
const signedOffset = (i: number, active: number, total: number) => {
  let diff = i - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

// Card footprint per breakpoint. Smaller than before so 5 can sit on
// screen at once without the outer two spilling off narrow viewports —
// side cards are additionally scaled down in `layout()`.
const CARD_SIZE = {
  base: { w: 190, h: 260 }, // < sm — center card only really reads here
  sm: { w: 230, h: 300 }, // >= 640px
  lg: { w: 300, h: 380 }, // >= 1024px
};

// Small mark + wordmark burned onto every card so the carousel reads as
// branded product photography rather than a generic media grid.
const BrandMark = ({ className = "" }: { className?: string }) => (
  <div
    className={`pointer-events-none flex flex-col items-center gap-1.5 text-white ${className}`}
  >
    <img
      src="/logo.png"
      alt="VYRAAA"
      className="h-10 w-auto object-contain sm:h-14 lg:h-16"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  </div>
);

export default function FeaturedCollections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [videos, setVideos] = useState<CollectionVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const { getQuery } = useGetQuery();

  const getVideosData = () => {
    getQuery({
      url: apiUrls.Home.getVideos,
      onSuccess: (res: any) => {
        setVideos(res.data || []);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    getVideosData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const taglineRef = useRef<HTMLParagraphElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const exploreBtnRef = useRef<HTMLButtonElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const isMobileRef = useRef(false);

  const total = videos.length;
  const activeCollection = videos[activeIndex];
  const activeAccent =
    activeCollection?.accent || ACCENTS[activeIndex % ACCENTS.length];

  // Refs mirroring the latest state so the autoplay interval (set up once)
  // never reads stale closures.
  const activeIndexRef = useRef(activeIndex);
  const isAnimatingRef = useRef(isAnimating);
  const isPausedRef = useRef(isPaused);
  const totalRef = useRef(total);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  // A handful of static ambient particles — no JS-driven motion, pure CSS
  // keyframes so they cost nothing on the main thread.
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: Math.round(Math.random() * 100),
        delay: Math.round(Math.random() * 5000) / 1000,
        duration: 12 + Math.round(Math.random() * 6000) / 1000,
      })),
    [],
  );

  /* --------------------------- positioning math ----------------------------- */
  // Simple 2D layout only: x / scale / opacity. No 3D rotation, no blur
  // filters — those are the expensive parts to repaint every frame.
  // Five slots visible: active (0), ±1 (near neighbor), ±2 (far neighbor).

  const layout = useCallback((offset: number) => {
    const abs = Math.abs(offset);
    const spread = isMobileRef.current ? 108 : 190;

    if (abs > VISIBLE_SIDE) {
      return { x: offset * spread * 1.15, scale: 0.5, opacity: 0, zIndex: 0 };
    }

    const x = offset * spread;
    const scale =
      abs === 0 ? 1 : abs === 1 ? (isMobileRef.current ? 0.82 : 0.86) : isMobileRef.current ? 0.62 : 0.7;
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : 0.55;
    const zIndex = 20 - abs;
    return { x, scale, opacity, zIndex };
  }, []);

  const applyLayoutInstant = useCallback(() => {
    videos.forEach((_, i) => {
      const el = cardRefs.current[i];
      if (!el) return;
      const offset = signedOffset(i, activeIndex, total);
      const t = layout(offset);
      gsap.set(el, {
        xPercent: -50,
        yPercent: -50,
        x: t.x,
        scale: t.scale,
        opacity: t.opacity,
        zIndex: t.zIndex,
        pointerEvents: Math.abs(offset) <= VISIBLE_SIDE ? "auto" : "none",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, activeIndex, total, layout]);

  /* --------------------------------- navigate -------------------------------- */
  // One short, refined timeline per click: every card tweens x/scale/opacity to
  // its new slot together, the video crossfades, done in ~0.65s of eased motion.

  const goTo = useCallback(
    (nextIndex: number) => {
      if (isAnimatingRef.current || totalRef.current === 0) return;
      const t = totalRef.current;
      const normalized = ((nextIndex % t) + t) % t;
      if (normalized === activeIndexRef.current) return;

      setIsAnimating(true);

      const prevIndex = activeIndexRef.current;
      const prevVideo = videoRefs.current[prevIndex];
      const nextVideo = videoRefs.current[normalized];
      const accent =
        videos[normalized]?.accent || ACCENTS[normalized % ACCENTS.length];

      const tl = gsap.timeline({
        defaults: { duration: 0.65, ease: "power4.out" },
        onComplete: () => {
          setActiveIndex(normalized);
          setIsAnimating(false);
        },
      });

      videos.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const offset = signedOffset(i, normalized, t);
        const lt = layout(offset);
        tl.to(
          el,
          { x: lt.x, scale: lt.scale, opacity: lt.opacity, zIndex: lt.zIndex },
          0,
        );
        gsap.set(el, {
          pointerEvents: Math.abs(offset) <= VISIBLE_SIDE ? "auto" : "none",
        });
      });

      const nextLabel = cardRefs.current[normalized]?.querySelector<HTMLElement>(
        "[data-fc-text]",
      );
      if (nextLabel) {
        tl.fromTo(
          nextLabel,
          { y: 10, opacity: 0.6 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
          0.18,
        );
      }



      if (prevVideo) {
        tl.to(prevVideo, { opacity: 0.3, duration: 0.4 }, 0).call(() =>
          prevVideo.pause(),
        );
      }
      if (nextVideo) {
        nextVideo.currentTime = 0;
        tl.set(nextVideo, { opacity: 0 }, 0.1)
          .call(() => nextVideo.play().catch(() => {}), undefined, 0.1)
          .to(nextVideo, { opacity: 1, duration: 0.55 }, 0.1);
      }

      gsap.to(sectionRef.current, {
        "--fc-accent": accent,
        "--fc-accent-30": `${accent}33`,
        duration: 0.7,
        ease: "sine.out",
      } as any);
    },

    [videos, layout],
  );

  const goToRef = useRef(goTo);
  useEffect(() => {
    goToRef.current = goTo;
  }, [goTo]);

  const handlePrev = () => goTo(activeIndexRef.current - 1);
  const handleNext = () => goTo(activeIndexRef.current + 1);

  /* --------------------------------- autoplay --------------------------------- */
  // Advances one slide every 5s. Pauses on hover/touch and while a
  // transition is already running, resumes automatically after.

  useEffect(() => {
    if (total <= 1) return;
    const id = window.setInterval(() => {
      if (isAnimatingRef.current || isPausedRef.current) return;
      goToRef.current(activeIndexRef.current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [total]);

  const ripple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const span = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    span.style.cssText = `
      position:absolute; left:${e.clientX - rect.left - size / 2}px; top:${e.clientY - rect.top - size / 2}px;
      width:${size}px; height:${size}px; border-radius:9999px; pointer-events:none;
      background: radial-gradient(circle, var(--fc-accent) 0%, transparent 70%);
      opacity:.35;
    `;
    btn.appendChild(span);
    gsap.fromTo(
      span,
      { scale: 0, opacity: 0.35 },
      {
        scale: 2,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => span.remove(),
      },
    );
  };

  const goToCollection = (cat: CollectionVideo | undefined) => {
    const path = cat?.slug || cat?._id;
    navigate(path ? `/collections/${path}` : "/collections");
  };

  const handleExplore = (e: React.MouseEvent<HTMLButtonElement>) => {
    ripple(e);
    gsap.fromTo(
      exploreBtnRef.current,
      { scale: 0.97 },
      { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" },
    );
    goToCollection(activeCollection);
  };

  // Explore badge on an individual card. Stops propagation so it never
  // also fires the card's onClick (which would just re-center the card).
  const handleCardExplore = (
    e: React.MouseEvent<HTMLButtonElement>,
    cat: CollectionVideo,
  ) => {
    e.stopPropagation();
    goToCollection(cat);
  };

  /* ------------------------------ scroll + mount ----------------------------- */

  useLayoutEffect(() => {
    if (total === 0) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const mq = window.matchMedia("(max-width: 767px)");
    isMobileRef.current = mq.matches;
    const onMq = (ev: MediaQueryListEvent) => {
      isMobileRef.current = ev.matches;
      applyLayoutInstant();
    };
    mq.addEventListener("change", onMq);

    const ctx = gsap.context(() => {
      applyLayoutInstant();
      videoRefs.current[activeIndex]?.play().catch(() => {});

      if (!reduced) {
        gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
        gsap.set(taglineRef.current, { autoAlpha: 0, y: 10 });
        gsap.set(
          [prevBtnRef.current, nextBtnRef.current, exploreBtnRef.current],
          { autoAlpha: 0, y: 10 },
        );
        cardRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        introTl
          .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.7 })
          .to(taglineRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.4")
          .to(
            [prevBtnRef.current, nextBtnRef.current],
            { autoAlpha: 1, y: 0, duration: 0.5 },
            "-=0.4",
          );

        // cards fade in together, center card landing slightly after — a single
        // light stagger rather than a per-card cascade.
        const order = videos
          .map((_, i) => ({
            i,
            offset: Math.abs(signedOffset(i, activeIndex, total)),
          }))
          .sort((a, b) => b.offset - a.offset);

        order.forEach(({ i }, idx) => {
          const el = cardRefs.current[i];
          if (!el) return;
          introTl.to(el, { autoAlpha: 1, duration: 0.5 }, 0.15 + idx * 0.06);
        });

        introTl.to(
          exploreBtnRef.current,
          { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.15",
        );
      } else {
        cardRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 1 }));
        gsap.set(
          [
            headingRef.current,
            taglineRef.current,
            prevBtnRef.current,
            nextBtnRef.current,
            exploreBtnRef.current,
          ],
          { autoAlpha: 1 },
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      mq.removeEventListener("change", onMq);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos.length]);

  /* --------------------------------- render ---------------------------------- */

  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-background px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex h-[300px] max-w-[1300px] items-center justify-center gap-4 sm:h-[340px] lg:h-[400px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`animate-pulse rounded-[22px] border border-border bg-card ${
                i === 2
                  ? "h-[260px] w-[190px] sm:h-[300px] sm:w-[230px] lg:h-[380px] lg:w-[300px]"
                  : i === 1 || i === 3
                    ? "hidden h-[220px] w-[160px] opacity-70 sm:block sm:h-[255px] sm:w-[195px] lg:h-[325px] lg:w-[255px]"
                    : "hidden h-[190px] w-[135px] opacity-40 lg:block lg:h-[266px] lg:w-[210px]"
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (total === 0) {
    return (
      <section className="bg-background px-5 py-14 text-center">
        <p className="fc-sans text-sm text-muted">No collections to show yet.</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      style={
        {
          "--fc-accent": activeAccent,
          "--fc-accent-30": `${activeAccent}33`,
        } as React.CSSProperties
      }
      className="relative isolate overflow-hidden bg-background px-5 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap');
        .fc-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }
        .fc-sans { font-family: 'Manrope', 'Inter', sans-serif; }
        @keyframes fc-float {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: .3; }
          85% { opacity: .15; }
          100% { transform: translateY(-110px); opacity: 0; }
        }
        .fc-card {
          width: ${CARD_SIZE.base.w}px;
          height: ${CARD_SIZE.base.h}px;
          transition: box-shadow .4s cubic-bezier(.22,.61,.36,1), border-color .4s ease;
        }
        @media (min-width: 640px) {
          .fc-card { width: ${CARD_SIZE.sm.w}px; height: ${CARD_SIZE.sm.h}px; }
        }
        @media (min-width: 1024px) {
          .fc-card { width: ${CARD_SIZE.lg.w}px; height: ${CARD_SIZE.lg.h}px; }
        }
        .fc-card:hover {
          box-shadow: 0 26px 55px -20px var(--fc-accent-30), 0 8px 20px -12px rgba(59,48,42,0.35);
          border-color: var(--fc-accent);
        }
        .fc-nav-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--fc-accent-30), 0 0 0 1px var(--fc-accent);
        }
        .fc-nav-btn {
          transition: transform .25s cubic-bezier(.22,.61,.36,1), border-color .25s ease, background-color .25s ease, box-shadow .25s ease;
        }
        .fc-nav-btn:hover:not(:disabled) {
          transform: translateY(-50%) scale(1.06);
        }
        .fc-nav-btn:active:not(:disabled) {
          transform: translateY(-50%) scale(0.94);
        }
        .fc-dot {
          transition: width .35s cubic-bezier(.22,.61,.36,1), background-color .35s ease, transform .2s ease;
        }
        .fc-dot:hover {
          transform: scaleY(1.4);
        }
        .fc-dot:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--fc-accent-30);
        }
        .fc-explore-btn {
          transition: border-color .35s ease, color .35s ease, box-shadow .35s ease, transform .3s cubic-bezier(.22,.61,.36,1);
        }
        .fc-explore-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px -16px var(--fc-accent-30);
        }
        .fc-explore-btn:active {
          transform: translateY(0);
        }
        .fc-card-explore {
          transition: transform .25s cubic-bezier(.22,.61,.36,1), background-color .25s ease, border-color .25s ease;
        }
        .fc-card-explore:hover {
          transform: translateY(-1px) scale(1.03);
          background-color: rgba(0,0,0,0.35);
          border-color: var(--fc-accent);
        }
        .fc-card-explore:active {
          transform: translateY(0) scale(0.97);
        }
      `}</style>

      {/* -------- ambient background: one static gradient + light particles -------- */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 transition-[background] duration-700"
          style={{
            background:
              "radial-gradient(50% 40% at 50% 30%, var(--fc-accent-30), transparent 70%)",
          }}
        />
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 h-[3px] w-[3px] rounded-full bg-primary"
            style={{
              left: `${p.left}%`,
              opacity: 0,
              animation: `fc-float ${p.duration}s ease-in ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* --------------------------------- heading ---------------------------------- */}
      <div className="relative z-10 mb-7 text-center sm:mb-9">
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-border" />
          <span className="fc-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-muted">
            Best Sellers
          </span>
          <span className="h-px w-6 bg-border" />
        </div>
        <h2
          ref={headingRef}
          className="fc-serif text-3xl font-light italic leading-tight text-heading sm:text-5xl lg:text-[3.25rem]"
        >
          Loved Around the World
        </h2>
        <p
          ref={taglineRef}
          className="fc-sans mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm"
        >
          {activeCollection?.description ||
            activeCollection?.name ||
            "Curated pieces, handpicked for you"}
        </p>
      </div>

      {/* ---------------------------------- stage ------------------------------------ */}
      {/* Fixed pixel height (not vh) so the stage never resizes with viewport
          quirks on mobile browser chrome show/hide — keeps the video crop stable.
          Arrows are pinned to the left/right edges of this container so they
          sit beside the image track, not below it. */}
      <div
        ref={stageRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="relative z-10 mx-auto h-[300px] max-w-[1300px] sm:h-[340px] lg:h-[420px]"
      >
        <button
          ref={prevBtnRef}
          onClick={(e) => {
            ripple(e);
            handlePrev();
          }}
          aria-label="Previous collection"
          disabled={isAnimating}
          className="fc-nav-btn absolute left-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md disabled:opacity-40 sm:left-2 sm:h-11 sm:w-11 lg:left-4 lg:h-12 lg:w-12"
          style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
        >
          <IoArrowBack className="relative z-10 text-sm sm:text-base" />
        </button>

        <button
          ref={nextBtnRef}
          onClick={(e) => {
            ripple(e);
            handleNext();
          }}
          aria-label="Next collection"
          disabled={isAnimating}
          className="fc-nav-btn absolute right-1 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md disabled:opacity-40 sm:right-2 sm:h-11 sm:w-11 lg:right-4 lg:h-12 lg:w-12"
          style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
        >
          <IoArrowForward className="relative z-10 text-sm sm:text-base" />
        </button>

        {videos.map((cat, i) => {
          const isActive = i === activeIndex;
          const videoSrc = cat.video || sampleVideo;
          return (
            <div
              key={cat._id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => i !== activeIndex && goTo(i)}
              className={`fc-card group absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-[20px] border bg-card ${
                isActive
                  ? "border-primary/30 shadow-[0_20px_45px_-18px_rgba(131,82,64,0.4)]"
                  : "border-border shadow-[0_12px_30px_-16px_rgba(59,48,42,0.3)]"
              }`}
              data-fc-card
            >
              {/* Fixed-size wrapper + object-cover: video always fills the card
                  frame edge-to-edge with no letterboxing, regardless of source
                  aspect ratio. */}
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={videoSrc}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />

              {/* top + bottom scrims so the wordmark and title stay legible over
                  any footage, without a flat overlay muddying the whole frame */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/55 via-black/10 to-transparent sm:h-20" />
              <div className="absolute inset-0 "/>

              <div className="absolute inset-x-0 top-0 flex justify-center pt-3 sm:pt-4">
                <BrandMark />
              </div>

              {/* play affordance on inactive cards — hints this is a video,
                  click to bring it forward */}
              {!isActive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm sm:h-9 sm:w-9"
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
                    }}
                  >
                    <IoPlay className="ml-0.5 text-xs text-white sm:text-sm" />
                  </span>
                </div>
              )}

              {(cat.title || cat.name) && (
                <div
                  data-fc-text
                  className="fc-sans absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3 pb-3 pt-8 sm:px-4 sm:pb-4"
                >
                  <p
                    className={`text-[11px] font-medium tracking-wide text-white transition-opacity duration-200 sm:text-[13px] ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {cat.title || cat.name}
                  </p>

                  {/* Per-card Explore — visible on the active card (always) and
                      on hover for neighbors. Stops propagation so it doesn't
                      also trigger the card's re-center click. */}
                  <button
                    onClick={(e) => handleCardExplore(e, cat)}
                    className={`fc-card-explore fc-sans shrink-0 rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur-md transition-opacity duration-200 sm:px-3 sm:py-1.5 sm:text-[10px] ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    Explore
                  </button>
                </div>
              )}

              <div
                className="pointer-events-none absolute inset-0 rounded-[20px]"
                style={{
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.16)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.07)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ------------------------------- dots only ---------------------------------- */}
      <div className="relative z-20 mt-6 flex items-center justify-center sm:mt-7">
        <div className="fc-sans flex items-center gap-2">
          {videos.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to collection ${i + 1}`}
              onClick={() => i !== activeIndex && goTo(i)}
              className="fc-dot h-1.5 w-1.5 rounded-full bg-border"
              style={
                i === activeIndex
                  ? { width: 18, background: "var(--fc-accent)" }
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* ------------------------------- explore CTA ---------------------------------- */}
      <div className="relative z-20 mt-6 flex justify-center sm:mt-7">
        <button
          ref={exploreBtnRef}
          onClick={handleExplore}
          className="fc-explore-btn relative flex items-center gap-2.5 overflow-hidden rounded-full border border-border bg-dark px-6 py-3 fc-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-50 sm:px-7 sm:py-3.5 sm:text-xs"
          style={{ boxShadow: "0 10px 26px -14px rgba(59,48,42,0.32)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--fc-accent)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "";
          }}
        >
          Explore Collection
          <IoArrowForward className="relative z-10 text-sm transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}