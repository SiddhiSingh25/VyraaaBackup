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

interface CollectionVideo {
  _id: string;
  video?: string;
  accent?: string;
  name?: string;
  title?: string;
  description?: string;
}

// shortest signed distance from `active` to `i` on a circular track of `total`
const signedOffset = (i: number, active: number, total: number) => {
  let diff = i - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
};

// Fixed card footprint — same on every breakpoint tier so the video never
// gets stretched or cropped inconsistently between slides.
const CARD_SIZE = {
  base: { w: 300, h: 380 }, // < sm
  sm: { w: 360, h: 460 }, // >= 640px
  lg: { w: 420, h: 460 }, // >= 1024px
};

export default function FeaturedCollections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [videos, setVideos] = useState<CollectionVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getQuery } = useGetQuery();

  const getVideosData = () => {
    getQuery({
      url: apiUrls.Videos.getAllVideos,
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
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const isMobileRef = useRef(false);

  const total = videos.length;
  const activeCollection = videos[activeIndex];
  const activeAccent = activeCollection?.accent || ACCENTS[activeIndex % ACCENTS.length];

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

  const layout = useCallback((offset: number) => {
    const abs = Math.abs(offset);
    const spread = isMobileRef.current ? 190 : 380;

    // Only the active card plus its immediate left/right neighbor stay
    // visible — that's 3 cards (and 3 videos) on screen at once. Raise
    // this back to 2 if you want 5 cards visible again.
    if (abs > 1) {
      return { x: offset * spread * 1.3, scale: 0.55, opacity: 0, zIndex: 0 };
    }

    const x = offset * spread;
    const scale =
      offset === 0 ? 1 : abs === 1 ? (isMobileRef.current ? 0.8 : 0.86) : 0.68;
    const opacity = offset === 0 ? 1 : abs === 1 ? 0.5 : 0.25;
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
        pointerEvents: offset === 0 ? "auto" : "none",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, activeIndex, total, layout]);

  /* --------------------------------- navigate -------------------------------- */
  // One short, simple timeline per click: every card tweens x/scale/opacity to
  // its new slot together, the video crossfades, done in ~0.55s.

  const goTo = useCallback(
    (nextIndex: number) => {
      if (isAnimating || total === 0) return;
      const normalized = ((nextIndex % total) + total) % total;
      if (normalized === activeIndex) return;

      setIsAnimating(true);

      const prevIndex = activeIndex;
      const prevVideo = videoRefs.current[prevIndex];
      const nextVideo = videoRefs.current[normalized];
      const accent =
        videos[normalized]?.accent || ACCENTS[normalized % ACCENTS.length];

      const tl = gsap.timeline({
        defaults: { duration: 0.55, ease: "power3.out" },
        onComplete: () => {
          setActiveIndex(normalized);
          setIsAnimating(false);
        },
      });

      videos.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const offset = signedOffset(i, normalized, total);
        const t = layout(offset);
        tl.to(
          el,
          { x: t.x, scale: t.scale, opacity: t.opacity, zIndex: t.zIndex },
          0,
        );
        gsap.set(el, { pointerEvents: offset === 0 ? "auto" : "none" });
      });

      const nextLabel =
        cardRefs.current[normalized]?.querySelector<HTMLElement>(
          "[data-fc-text]",
        );
      if (nextLabel) {
        tl.fromTo(
          nextLabel,
          { y: 10, opacity: 0.6 },
          { y: 0, opacity: 1, duration: 0.4 },
          0.15,
        );
      }

      // crossfade the tagline copy under the heading to match the incoming card
      if (taglineRef.current) {
        tl.to(
          taglineRef.current,
          {
            opacity: 0,
            y: -6,
            duration: 0.2,
            onComplete: () => {
              if (taglineRef.current) {
                taglineRef.current.textContent =
                  videos[normalized]?.description ||
                  videos[normalized]?.name ||
                  "Curated pieces, handpicked for you";
              }
            },
          },
          0,
        ).to(taglineRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.25);
      }

      if (prevVideo) {
        tl.to(prevVideo, { opacity: 0.3, duration: 0.35 }, 0).call(() =>
          prevVideo.pause(),
        );
      }
      if (nextVideo) {
        nextVideo.currentTime = 0;
        tl.set(nextVideo, { opacity: 0 }, 0.1)
          .call(() => nextVideo.play().catch(() => { }), undefined, 0.1)
          .to(nextVideo, { opacity: 1, duration: 0.5 }, 0.1);
      }

      gsap.to(sectionRef.current, {
        "--fc-accent": accent,
        "--fc-accent-30": `${accent}33`,
        duration: 0.6,
        ease: "sine.out",
      } as any);
    },
    [activeIndex, videos, isAnimating, layout, total],
  );

  const handlePrev = () => goTo(activeIndex - 1);
  const handleNext = () => goTo(activeIndex + 1);

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
      videoRefs.current[activeIndex]?.play().catch(() => { });

      if (!reduced) {
        gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
        gsap.set(taglineRef.current, { autoAlpha: 0, y: 10 });
        gsap.set([prevBtnRef.current, nextBtnRef.current], {
          autoAlpha: 0,
          y: 10,
        });
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
          .to(
            taglineRef.current,
            { autoAlpha: 1, y: 0, duration: 0.6 },
            "-=0.4",
          )
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
          introTl.to(el, { autoAlpha: 1, duration: 0.5 }, 0.15 + idx * 0.08);
        });
      } else {
        cardRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 1 }));
        gsap.set(
          [
            headingRef.current,
            taglineRef.current,
            prevBtnRef.current,
            nextBtnRef.current,
          ],
          {
            autoAlpha: 1,
          },
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
        <div className="mx-auto flex h-[400px] max-w-[1300px] items-center justify-center gap-5 sm:h-[440px] lg:h-[480px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`animate-pulse rounded-[22px] border border-border bg-card ${i === 1
                ? "h-[340px] w-[280px] sm:h-[400px] sm:w-[330px] lg:h-[440px] lg:w-[380px]"
                : "hidden h-[260px] w-[200px] opacity-40 sm:block"
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
        }
        @media (min-width: 640px) {
          .fc-card { width: ${CARD_SIZE.sm.w}px; height: ${CARD_SIZE.sm.h}px; }
        }
        @media (min-width: 1024px) {
          .fc-card { width: ${CARD_SIZE.lg.w}px; height: ${CARD_SIZE.lg.h}px; }
        }
        .fc-nav-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--fc-accent-30), 0 0 0 1px var(--fc-accent);
        }
        .fc-dot:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--fc-accent-30);
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
          quirks on mobile browser chrome show/hide — keeps the video crop stable. */}
      <div
        ref={stageRef}
        className="relative z-10 mx-auto h-[400px] sm:h-[420px]"
      >
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
              className={`fc-card group absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-[22px] border bg-card transition-[border-color,box-shadow] duration-200 ${isActive
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
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

              {/* subtle play affordance on the side (inactive) cards — hints
                  this is a video, click to bring it forward */}
              {!isActive && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm sm:h-10 sm:w-10"
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
                    }}
                  >
                    <IoPlay className="ml-0.5 text-sm text-white sm:text-base" />
                  </span>
                </div>
              )}

              {(cat.title || cat.name) && (
                <div
                  data-fc-text
                  className="fc-sans absolute inset-x-0 bottom-0 px-4 pb-4 pt-8"
                >
                  <p
                    className={`text-[13px] font-medium tracking-wide text-white transition-opacity duration-200 sm:text-sm ${isActive ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    {cat.title || cat.name}
                  </p>
                </div>
              )}

              <div
                className="pointer-events-none absolute inset-0 rounded-[22px]"
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

      {/* ------------------------------- navigation ---------------------------------- */}
      <div className="relative z-20 mt-6 flex items-center justify-center gap-5 sm:mt-7">
        <button
          ref={prevBtnRef}
          onClick={(e) => {
            ripple(e);
            handlePrev();
          }}
          aria-label="Previous collection"
          disabled={isAnimating}
          className="fc-nav-btn relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-heading transition-all duration-200 hover:border-primary/30 hover:bg-card disabled:opacity-40 sm:h-11 sm:w-11"
          style={{ boxShadow: "0 6px 16px -10px rgba(59,48,42,0.3)" }}
        >
          <IoArrowBack className="relative z-10 text-base" />
        </button>

        <div className="fc-sans flex items-center gap-2">
          {videos.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to collection ${i + 1}`}
              onClick={() => i !== activeIndex && goTo(i)}
              className="fc-dot h-1.5 w-1.5 rounded-full bg-border transition-all duration-200"
              style={
                i === activeIndex
                  ? { width: 18, background: "var(--fc-accent)" }
                  : undefined
              }
            />
          ))}
        </div>

        <button
          ref={nextBtnRef}
          onClick={(e) => {
            ripple(e);
            handleNext();
          }}
          aria-label="Next collection"
          disabled={isAnimating}
          className="fc-nav-btn relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-heading transition-all duration-200 hover:border-primary/30 hover:bg-card disabled:opacity-40 sm:h-11 sm:w-11"
          style={{ boxShadow: "0 6px 16px -10px rgba(59,48,42,0.3)" }}
        >
          <IoArrowForward className="relative z-10 text-base" />
        </button>
      </div>
    </section>
  );
}




