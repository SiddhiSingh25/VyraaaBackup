// import {
//   useCallback,
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { IoArrowBack, IoArrowForward, IoPlay } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";

// // Fallback / placeholder asset — swap for real per-collection footage once
// // the API returns a `video` field.
// import sampleVideo from "../../../../assets/video.mp4";

// gsap.registerPlugin(ScrollTrigger);

// // Matches index.css @theme tokens exactly (hex, not CSS vars — we need to
// // append alpha e.g. `${accent}33`, which only works with hex strings).
// const ACCENTS = ["#835240", "#b76e79", "#c98f7a", "#51291a", "#3D2A1E"];

// interface CollectionVideo {
//   _id: string;
//   video?: string;
//   accent?: string;
//   name?: string;
//   title?: string;
//   description?: string;
// }

// // shortest signed distance from `active` to `i` on a circular track of `total`
// const signedOffset = (i: number, active: number, total: number) => {
//   let diff = i - active;
//   if (diff > total / 2) diff -= total;
//   if (diff < -total / 2) diff += total;
//   return diff;
// };

// // Fixed card footprint — same on every breakpoint tier so the video never
// // gets stretched or cropped inconsistently between slides.
// const CARD_SIZE = {
//   base: { w: 300, h: 380 }, // < sm
//   sm: { w: 360, h: 460 }, // >= 640px
//   lg: { w: 420, h: 460 }, // >= 1024px
// };

// export default function FeaturedCollections() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [videos, setVideos] = useState<CollectionVideo[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const { getQuery } = useGetQuery();

//   const getVideosData = () => {
//     getQuery({
//       url: apiUrls.Videos.getAllVideos,
//       onSuccess: (res: any) => {
//         setVideos(res.data || []);
//         setIsLoading(false);
//       },
//       onFail: (err: any) => {
//         console.log(err);
//         setIsLoading(false);
//       },
//     });
//   };

//   useEffect(() => {
//     getVideosData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const navigate = useNavigate();

//   const sectionRef = useRef<HTMLElement | null>(null);
//   const headingRef = useRef<HTMLHeadingElement | null>(null);
//   const taglineRef = useRef<HTMLParagraphElement | null>(null);
//   const stageRef = useRef<HTMLDivElement | null>(null);
//   const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
//   const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
//   const prevBtnRef = useRef<HTMLButtonElement | null>(null);
//   const nextBtnRef = useRef<HTMLButtonElement | null>(null);
//   const isMobileRef = useRef(false);

//   const total = videos.length;
//   const activeCollection = videos[activeIndex];
//   const activeAccent = activeCollection?.accent || ACCENTS[activeIndex % ACCENTS.length];

//   // A handful of static ambient particles — no JS-driven motion, pure CSS
//   // keyframes so they cost nothing on the main thread.
//   const particles = useMemo(
//     () =>
//       Array.from({ length: 8 }).map((_, i) => ({
//         id: i,
//         left: Math.round(Math.random() * 100),
//         delay: Math.round(Math.random() * 5000) / 1000,
//         duration: 12 + Math.round(Math.random() * 6000) / 1000,
//       })),
//     [],
//   );

//   /* --------------------------- positioning math ----------------------------- */
//   // Simple 2D layout only: x / scale / opacity. No 3D rotation, no blur
//   // filters — those are the expensive parts to repaint every frame.

//   const layout = useCallback((offset: number) => {
//     const abs = Math.abs(offset);
//     const spread = isMobileRef.current ? 190 : 380;

//     // Only the active card plus its immediate left/right neighbor stay
//     // visible — that's 3 cards (and 3 videos) on screen at once. Raise
//     // this back to 2 if you want 5 cards visible again.
//     if (abs > 1) {
//       return { x: offset * spread * 1.3, scale: 0.55, opacity: 0, zIndex: 0 };
//     }

//     const x = offset * spread;
//     const scale =
//       offset === 0 ? 1 : abs === 1 ? (isMobileRef.current ? 0.8 : 0.86) : 0.68;
//     const opacity = offset === 0 ? 1 : abs === 1 ? 0.5 : 0.25;
//     const zIndex = 20 - abs;
//     return { x, scale, opacity, zIndex };
//   }, []);

//   const applyLayoutInstant = useCallback(() => {
//     videos.forEach((_, i) => {
//       const el = cardRefs.current[i];
//       if (!el) return;
//       const offset = signedOffset(i, activeIndex, total);
//       const t = layout(offset);
//       gsap.set(el, {
//         xPercent: -50,
//         yPercent: -50,
//         x: t.x,
//         scale: t.scale,
//         opacity: t.opacity,
//         zIndex: t.zIndex,
//         pointerEvents: offset === 0 ? "auto" : "none",
//       });
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [videos, activeIndex, total, layout]);

//   /* --------------------------------- navigate -------------------------------- */
//   // One short, simple timeline per click: every card tweens x/scale/opacity to
//   // its new slot together, the video crossfades, done in ~0.55s.

//   const goTo = useCallback(
//     (nextIndex: number) => {
//       if (isAnimating || total === 0) return;
//       const normalized = ((nextIndex % total) + total) % total;
//       if (normalized === activeIndex) return;

//       setIsAnimating(true);

//       const prevIndex = activeIndex;
//       const prevVideo = videoRefs.current[prevIndex];
//       const nextVideo = videoRefs.current[normalized];
//       const accent =
//         videos[normalized]?.accent || ACCENTS[normalized % ACCENTS.length];

//       const tl = gsap.timeline({
//         defaults: { duration: 0.55, ease: "power3.out" },
//         onComplete: () => {
//           setActiveIndex(normalized);
//           setIsAnimating(false);
//         },
//       });

//       videos.forEach((_, i) => {
//         const el = cardRefs.current[i];
//         if (!el) return;
//         const offset = signedOffset(i, normalized, total);
//         const t = layout(offset);
//         tl.to(
//           el,
//           { x: t.x, scale: t.scale, opacity: t.opacity, zIndex: t.zIndex },
//           0,
//         );
//         gsap.set(el, { pointerEvents: offset === 0 ? "auto" : "none" });
//       });

//       const nextLabel =
//         cardRefs.current[normalized]?.querySelector<HTMLElement>(
//           "[data-fc-text]",
//         );
//       if (nextLabel) {
//         tl.fromTo(
//           nextLabel,
//           { y: 10, opacity: 0.6 },
//           { y: 0, opacity: 1, duration: 0.4 },
//           0.15,
//         );
//       }

//       // crossfade the tagline copy under the heading to match the incoming card
//       if (taglineRef.current) {
//         tl.to(
//           taglineRef.current,
//           {
//             opacity: 0,
//             y: -6,
//             duration: 0.2,
//             onComplete: () => {
//               if (taglineRef.current) {
//                 taglineRef.current.textContent =
//                   videos[normalized]?.description ||
//                   videos[normalized]?.name ||
//                   "Curated pieces, handpicked for you";
//               }
//             },
//           },
//           0,
//         ).to(taglineRef.current, { opacity: 1, y: 0, duration: 0.3 }, 0.25);
//       }

//       if (prevVideo) {
//         tl.to(prevVideo, { opacity: 0.3, duration: 0.35 }, 0).call(() =>
//           prevVideo.pause(),
//         );
//       }
//       if (nextVideo) {
//         nextVideo.currentTime = 0;
//         tl.set(nextVideo, { opacity: 0 }, 0.1)
//           .call(() => nextVideo.play().catch(() => { }), undefined, 0.1)
//           .to(nextVideo, { opacity: 1, duration: 0.5 }, 0.1);
//       }

//       gsap.to(sectionRef.current, {
//         "--fc-accent": accent,
//         "--fc-accent-30": `${accent}33`,
//         duration: 0.6,
//         ease: "sine.out",
//       } as any);
//     },
//     [activeIndex, videos, isAnimating, layout, total],
//   );

//   const handlePrev = () => goTo(activeIndex - 1);
//   const handleNext = () => goTo(activeIndex + 1);

//   const ripple = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const btn = e.currentTarget;
//     const rect = btn.getBoundingClientRect();
//     const span = document.createElement("span");
//     const size = Math.max(rect.width, rect.height);
//     span.style.cssText = `
//       position:absolute; left:${e.clientX - rect.left - size / 2}px; top:${e.clientY - rect.top - size / 2}px;
//       width:${size}px; height:${size}px; border-radius:9999px; pointer-events:none;
//       background: radial-gradient(circle, var(--fc-accent) 0%, transparent 70%);
//       opacity:.35;
//     `;
//     btn.appendChild(span);
//     gsap.fromTo(
//       span,
//       { scale: 0, opacity: 0.35 },
//       {
//         scale: 2,
//         opacity: 0,
//         duration: 0.5,
//         ease: "power2.out",
//         onComplete: () => span.remove(),
//       },
//     );
//   };

//   /* ------------------------------ scroll + mount ----------------------------- */

//   useLayoutEffect(() => {
//     if (total === 0) return;

//     const reduced = window.matchMedia(
//       "(prefers-reduced-motion: reduce)",
//     ).matches;
//     const mq = window.matchMedia("(max-width: 767px)");
//     isMobileRef.current = mq.matches;
//     const onMq = (ev: MediaQueryListEvent) => {
//       isMobileRef.current = ev.matches;
//       applyLayoutInstant();
//     };
//     mq.addEventListener("change", onMq);

//     const ctx = gsap.context(() => {
//       applyLayoutInstant();
//       videoRefs.current[activeIndex]?.play().catch(() => { });

//       if (!reduced) {
//         gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
//         gsap.set(taglineRef.current, { autoAlpha: 0, y: 10 });
//         gsap.set([prevBtnRef.current, nextBtnRef.current], {
//           autoAlpha: 0,
//           y: 10,
//         });
//         cardRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 0 }));

//         const introTl = gsap.timeline({
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: "top 75%",
//             once: true,
//           },
//           defaults: { ease: "power3.out" },
//         });

//         introTl
//           .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.7 })
//           .to(
//             taglineRef.current,
//             { autoAlpha: 1, y: 0, duration: 0.6 },
//             "-=0.4",
//           )
//           .to(
//             [prevBtnRef.current, nextBtnRef.current],
//             { autoAlpha: 1, y: 0, duration: 0.5 },
//             "-=0.4",
//           );

//         // cards fade in together, center card landing slightly after — a single
//         // light stagger rather than a per-card cascade.
//         const order = videos
//           .map((_, i) => ({
//             i,
//             offset: Math.abs(signedOffset(i, activeIndex, total)),
//           }))
//           .sort((a, b) => b.offset - a.offset);

//         order.forEach(({ i }, idx) => {
//           const el = cardRefs.current[i];
//           if (!el) return;
//           introTl.to(el, { autoAlpha: 1, duration: 0.5 }, 0.15 + idx * 0.08);
//         });
//       } else {
//         cardRefs.current.forEach((el) => el && gsap.set(el, { autoAlpha: 1 }));
//         gsap.set(
//           [
//             headingRef.current,
//             taglineRef.current,
//             prevBtnRef.current,
//             nextBtnRef.current,
//           ],
//           {
//             autoAlpha: 1,
//           },
//         );
//       }
//     }, sectionRef);

//     return () => {
//       ctx.revert();
//       mq.removeEventListener("change", onMq);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [videos.length]);

//   /* --------------------------------- render ---------------------------------- */

//   if (isLoading) {
//     return (
//       <section className="relative overflow-hidden bg-background px-5 py-10 sm:px-10 lg:px-16">
//         <div className="mx-auto flex h-[400px] max-w-[1300px] items-center justify-center gap-5 sm:h-[440px] lg:h-[480px]">
//           {[0, 1, 2].map((i) => (
//             <div
//               key={i}
//               className={`animate-pulse rounded-[22px] border border-border bg-card ${i === 1
//                 ? "h-[340px] w-[280px] sm:h-[400px] sm:w-[330px] lg:h-[440px] lg:w-[380px]"
//                 : "hidden h-[260px] w-[200px] opacity-40 sm:block"
//                 }`}
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (total === 0) {
//     return (
//       <section className="bg-background px-5 py-14 text-center">
//         <p className="fc-sans text-sm text-muted">No collections to show yet.</p>
//       </section>
//     );
//   }

//   return (
//     <section
//       ref={sectionRef}
//       style={
//         {
//           "--fc-accent": activeAccent,
//           "--fc-accent-30": `${activeAccent}33`,
//         } as React.CSSProperties
//       }
//       className="relative isolate overflow-hidden bg-background px-5 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14"
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap');
//         .fc-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }
//         .fc-sans { font-family: 'Manrope', 'Inter', sans-serif; }
//         @keyframes fc-float {
//           0% { transform: translateY(0); opacity: 0; }
//           15% { opacity: .3; }
//           85% { opacity: .15; }
//           100% { transform: translateY(-110px); opacity: 0; }
//         }
//         .fc-card {
//           width: ${CARD_SIZE.base.w}px;
//           height: ${CARD_SIZE.base.h}px;
//         }
//         @media (min-width: 640px) {
//           .fc-card { width: ${CARD_SIZE.sm.w}px; height: ${CARD_SIZE.sm.h}px; }
//         }
//         @media (min-width: 1024px) {
//           .fc-card { width: ${CARD_SIZE.lg.w}px; height: ${CARD_SIZE.lg.h}px; }
//         }
//         .fc-nav-btn:focus-visible {
//           outline: none;
//           box-shadow: 0 0 0 2px var(--fc-accent-30), 0 0 0 1px var(--fc-accent);
//         }
//         .fc-dot:focus-visible {
//           outline: none;
//           box-shadow: 0 0 0 2px var(--fc-accent-30);
//         }
//       `}</style>

//       {/* -------- ambient background: one static gradient + light particles -------- */}
//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0 transition-[background] duration-700"
//           style={{
//             background:
//               "radial-gradient(50% 40% at 50% 30%, var(--fc-accent-30), transparent 70%)",
//           }}
//         />
//         {particles.map((p) => (
//           <span
//             key={p.id}
//             className="absolute bottom-0 h-[3px] w-[3px] rounded-full bg-primary"
//             style={{
//               left: `${p.left}%`,
//               opacity: 0,
//               animation: `fc-float ${p.duration}s ease-in ${p.delay}s infinite`,
//             }}
//           />
//         ))}
//       </div>

//       {/* --------------------------------- heading ---------------------------------- */}
//       <div className="relative z-10 mb-7 text-center sm:mb-9">
//         <div className="mb-3 flex items-center justify-center gap-3">
//           <span className="h-px w-6 bg-border" />
//           <span className="fc-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-muted">
//             Best Sellers
//           </span>
//           <span className="h-px w-6 bg-border" />
//         </div>
//         <h2
//           ref={headingRef}
//           className="fc-serif text-3xl font-light italic leading-tight text-heading sm:text-5xl lg:text-[3.25rem]"
//         >
//           Loved Around the World
//         </h2>
//         <p
//           ref={taglineRef}
//           className="fc-sans mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-muted sm:text-sm"
//         >
//           {activeCollection?.description ||
//             activeCollection?.name ||
//             "Curated pieces, handpicked for you"}
//         </p>
//       </div>

//       {/* ---------------------------------- stage ------------------------------------ */}
//       {/* Fixed pixel height (not vh) so the stage never resizes with viewport
//           quirks on mobile browser chrome show/hide — keeps the video crop stable. */}
//       <div
//         ref={stageRef}
//         className="relative z-10 mx-auto h-[400px] sm:h-[420px]"
//       >
//         {videos.map((cat, i) => {
//           const isActive = i === activeIndex;
//           const videoSrc = cat.video || sampleVideo;
//           return (
//             <div
//               key={cat._id}
//               ref={(el) => {
//                 cardRefs.current[i] = el;
//               }}
//               onClick={() => i !== activeIndex && goTo(i)}
//               className={`fc-card group absolute left-1/2 top-1/2 cursor-pointer overflow-hidden rounded-[22px] border bg-card transition-[border-color,box-shadow] duration-200 ${isActive
//                 ? "border-primary/30 shadow-[0_20px_45px_-18px_rgba(131,82,64,0.4)]"
//                 : "border-border shadow-[0_12px_30px_-16px_rgba(59,48,42,0.3)]"
//                 }`}
//               data-fc-card
//             >
//               {/* Fixed-size wrapper + object-cover: video always fills the card
//                   frame edge-to-edge with no letterboxing, regardless of source
//                   aspect ratio. */}
//               <video
//                 ref={(el) => {
//                   videoRefs.current[i] = el;
//                 }}
//                 src={videoSrc}
//                 muted
//                 loop
//                 playsInline
//                 preload="metadata"
//                 className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
//               />

//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

//               {/* subtle play affordance on the side (inactive) cards — hints
//                   this is a video, click to bring it forward */}
//               {!isActive && (
//                 <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
//                   <span
//                     className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm sm:h-10 sm:w-10"
//                     style={{
//                       background: "rgba(255,255,255,0.16)",
//                       boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
//                     }}
//                   >
//                     <IoPlay className="ml-0.5 text-sm text-white sm:text-base" />
//                   </span>
//                 </div>
//               )}

//               {(cat.title || cat.name) && (
//                 <div
//                   data-fc-text
//                   className="fc-sans absolute inset-x-0 bottom-0 px-4 pb-4 pt-8"
//                 >
//                   <p
//                     className={`text-[13px] font-medium tracking-wide text-white transition-opacity duration-200 sm:text-sm ${isActive ? "opacity-100" : "opacity-0"
//                       }`}
//                   >
//                     {cat.title || cat.name}
//                   </p>
//                 </div>
//               )}

//               <div
//                 className="pointer-events-none absolute inset-0 rounded-[22px]"
//                 style={{
//                   boxShadow: isActive
//                     ? "inset 0 0 0 1px rgba(255,255,255,0.16)"
//                     : "inset 0 0 0 1px rgba(255,255,255,0.07)",
//                 }}
//               />
//             </div>
//           );
//         })}
//       </div>

//       {/* ------------------------------- navigation ---------------------------------- */}
//       <div className="relative z-20 mt-6 flex items-center justify-center gap-5 sm:mt-7">
//         <button
//           ref={prevBtnRef}
//           onClick={(e) => {
//             ripple(e);
//             handlePrev();
//           }}
//           aria-label="Previous collection"
//           disabled={isAnimating}
//           className="fc-nav-btn relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-heading transition-all duration-200 hover:border-primary/30 hover:bg-card disabled:opacity-40 sm:h-11 sm:w-11"
//           style={{ boxShadow: "0 6px 16px -10px rgba(59,48,42,0.3)" }}
//         >
//           <IoArrowBack className="relative z-10 text-base" />
//         </button>

//         <div className="fc-sans flex items-center gap-2">
//           {videos.map((_, i) => (
//             <button
//               key={i}
//               aria-label={`Go to collection ${i + 1}`}
//               onClick={() => i !== activeIndex && goTo(i)}
//               className="fc-dot h-1.5 w-1.5 rounded-full bg-border transition-all duration-200"
//               style={
//                 i === activeIndex
//                   ? { width: 18, background: "var(--fc-accent)" }
//                   : undefined
//               }
//             />
//           ))}
//         </div>

//         <button
//           ref={nextBtnRef}
//           onClick={(e) => {
//             ripple(e);
//             handleNext();
//           }}
//           aria-label="Next collection"
//           disabled={isAnimating}
//           className="fc-nav-btn relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-heading transition-all duration-200 hover:border-primary/30 hover:bg-card disabled:opacity-40 sm:h-11 sm:w-11"
//           style={{ boxShadow: "0 6px 16px -10px rgba(59,48,42,0.3)" }}
//         >
//           <IoArrowForward className="relative z-10 text-base" />
//         </button>
//       </div>
//     </section>
//   );
// }








import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  IoArrowBack,
  IoArrowForward,
  IoPlay,
  IoPause,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

/* ---------------------------------------------------------------------- *
 * VYRAAA — Hero Video Slider
 *
 * Single-file companion to FeaturedCollections, following the same
 * conventions: useGetQuery + apiUrls for data, GSAP for the coarse
 * timeline/parallax work, refs over state for anything per-frame.
 *
 * Data source: reuses the same Videos endpoint FeaturedCollections already
 * pulls from (apiUrls.Videos.getAllVideos). If hero slides end up living on
 * a dedicated endpoint later, swap the one `getQuery` call below — nothing
 * else in the component needs to change.
 * ---------------------------------------------------------------------- */

interface HeroSlide {
  _id: string;
  video?: string;
  poster?: string;
  accent?: string;
  label?: string; // e.g. "SIGNATURE SCENT"
  headline?: string; // e.g. "Crafted to Leave a Memory"
  description?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryLink?: string;
}

const AUTOPLAY_MS = 6000;

const FALLBACK_SLIDES: Required<
  Pick<HeroSlide, "label" | "headline" | "description">
>[] = [
  {
    label: "VYRAAA COLLECTION",
    headline: "Crafted to Leave a Memory",
    description:
      "Discover handcrafted fragrances where timeless elegance meets modern sophistication.",
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0–1, current slide autoplay progress

  const { getQuery } = useGetQuery();
  const navigate = useNavigate();

  useEffect(() => {
    getQuery({
      url: apiUrls.Videos.getAllVideos,
      onSuccess: (res: any) => {
        setSlides(res.data || []);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err);
        setIsLoading(false);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = slides.length;
  const current = slides[active];

  /* ------------------------------ refs -------------------------------- */

  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]); // crossfade wrapper per slide
  const contentRef = useRef<HTMLDivElement | null>(null);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);
  const progressRafRef = useRef<number | null>(null);
  const progressStartRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const parallaxRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------- reduced motion ---------------------------- */

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedMotionRef.current = mq.matches;
      setReducedMotion(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ---------------------- pause on tab hidden --------------------------- */

  useEffect(() => {
    const onVis = () => setIsPaused(document.hidden ? true : isPausedRef.current);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  /* ------------------------------ nav ----------------------------------- */

  const goTo = useCallback(
    (nextIndex: number, dir: 1 | -1 = 1) => {
      if (isAnimating || total === 0) return;
      const normalized = ((nextIndex % total) + total) % total;
      if (normalized === active) return;

      setIsAnimating(true);
      const prevIndex = active;
      const prevVideo = videoRefs.current[prevIndex];
      const nextVideo = videoRefs.current[normalized];
      const prevLayer = layerRefs.current[prevIndex];
      const nextLayer = layerRefs.current[normalized];

      const dur = reducedMotionRef.current ? 0.4 : 1.1;
      const ease = "power2.inOut";

      const tl = gsap.timeline({
        defaults: { duration: dur, ease },
        onComplete: () => {
          prevVideo?.pause();
          setActive(normalized);
          setIsAnimating(false);
        },
      });

      if (nextLayer) {
        gsap.set(nextLayer, { autoAlpha: 1, zIndex: 2 });
        gsap.set(nextLayer.querySelector("video"), {
          scale: reducedMotionRef.current ? 1 : 1,
        });
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
        }
        tl.fromTo(
          nextLayer,
          { autoAlpha: 0, filter: reducedMotionRef.current ? "none" : "blur(8px)" },
          { autoAlpha: 1, filter: "blur(0px)" },
          0,
        );
        if (!reducedMotionRef.current) {
          tl.fromTo(
            nextLayer.querySelector("video"),
            { scale: 1.12, xPercent: dir * 2 },
            { scale: 1, xPercent: 0 },
            0,
          );
        }
      }

      if (prevLayer) {
        tl.to(prevLayer, { autoAlpha: 0, duration: dur * 0.8 }, 0.1).set(
          prevLayer,
          { zIndex: 0 },
        );
        if (!reducedMotionRef.current) {
          tl.to(
            prevLayer.querySelector("video"),
            { scale: 1.08 },
            0,
          );
        }
      }

      if (contentRef.current) {
        tl.to(
          contentRef.current,
          { autoAlpha: 0, y: reducedMotionRef.current ? 0 : -14, duration: 0.35 },
          0,
        );
      }
    },
    [active, isAnimating, total],
  );

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  /* ---------------------------- autoplay -------------------------------- */

  useEffect(() => {
    if (total <= 1) return;
    let cancelled = false;
    progressStartRef.current = performance.now();
    pausedElapsedRef.current = 0;

    const tick = (now: number) => {
      if (cancelled) return;
      if (isPausedRef.current || isAnimating) {
        progressStartRef.current = now - pausedElapsedRef.current;
        progressRafRef.current = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - progressStartRef.current;
      pausedElapsedRef.current = elapsed;
      const pct = Math.min(elapsed / AUTOPLAY_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        next();
        return; // effect re-runs on `active` change and resets timing
      }
      progressRafRef.current = requestAnimationFrame(tick);
    };

    progressRafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, total, isAnimating]);

  /* ------------------------- keyboard nav -------------------------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* ----------------------------- swipe ------------------------------------ */

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    touchStartX.current = null;
  };

  /* ------------------------- mount: play first, parallax ------------------ */

  useLayoutEffect(() => {
    if (total === 0) return;
    videoRefs.current[active]?.play().catch(() => {});
    if (layerRefs.current[active]) {
      gsap.set(layerRefs.current[active], { autoAlpha: 1, zIndex: 2 });
    }

    if (contentRef.current) {
      const items = contentRef.current.querySelectorAll("[data-stagger]");
      if (reducedMotionRef.current) {
        gsap.set(items, { autoAlpha: 1, y: 0, filter: "none" });
        gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      } else {
        gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 22, filter: "blur(6px)", letterSpacing: "0.02em" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            letterSpacing: "0em",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.2,
          },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  // re-run intro stagger whenever the active slide settles (post-transition)
  useEffect(() => {
    if (isAnimating || !contentRef.current) return;
    const items = contentRef.current.querySelectorAll("[data-stagger]");
    if (reducedMotionRef.current) {
      gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
      gsap.set(items, { autoAlpha: 1 });
      return;
    }
    gsap.set(contentRef.current, { autoAlpha: 1, y: 0 });
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 18, filter: "blur(5px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      },
    );
  }, [active, isAnimating]);

  /* -------------------------- subtle mouse parallax ------------------------ */

  useEffect(() => {
    if (reducedMotion) return;
    const el = parallaxRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      gsap.to(el, { x, y, duration: 0.8, ease: "power2.out" });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion]);

  /* -------------------------- preload next video ---------------------------- */

  useEffect(() => {
    if (total < 2) return;
    const nextIndex = (active + 1) % total;
    const el = videoRefs.current[nextIndex];
    if (el) el.preload = "auto";
  }, [active, total]);

  /* --------------------------------- render ---------------------------------- */

  if (isLoading) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-[#0D0D0D]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#151312] via-[#0D0D0D] to-[#151312]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="h-3 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-72 animate-pulse rounded-full bg-white/10 sm:w-96" />
          <div className="h-3 w-56 animate-pulse rounded-full bg-white/10" />
        </div>
      </section>
    );
  }

  const displaySlides: HeroSlide[] = total > 0 ? slides : (FALLBACK_SLIDES as any);
  const safeCurrent = current || (displaySlides[0] as HeroSlide);
  const accent = safeCurrent?.accent || "#C8A96A";

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ "--hero-accent": accent } as React.CSSProperties}
      className="relative isolate h-screen w-full overflow-hidden bg-[#0D0D0D]"
      aria-roledescription="carousel"
      aria-label="VYRAAA featured fragrances"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .hs-serif { font-family: 'Cormorant Garamond', serif; }
        .hs-sans { font-family: 'Jost', sans-serif; }
        .hs-glass {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.14);
        }
        .hs-glass:hover { background: rgba(255,255,255,0.14); box-shadow: 0 0 24px -6px var(--hero-accent); }
        .hs-glow:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(200,169,106,0.35), 0 0 0 1px var(--hero-accent);
        }
        @keyframes hs-float {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: .35; }
          85% { opacity: .15; }
          100% { transform: translateY(-140px); opacity: 0; }
        }
      `}</style>

      {/* ---------------------------- video layers ---------------------------- */}
      <div ref={parallaxRef} className="absolute inset-0 scale-[1.04]">
        {displaySlides.map((s, i) => (
          <div
            key={s._id || i}
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
            className="absolute inset-0"
            style={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 2 : 0 }}
          >
            {s.video ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={s.video}
                poster={s.poster}
                muted
                loop
                playsInline
                preload={i === active ? "auto" : "none"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: s.poster ? `url(${s.poster})` : undefined,
                  backgroundColor: "#151312",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ------------------------------- overlays ------------------------------ */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50" />
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-1000"
        style={{
          background:
            "radial-gradient(60% 45% at 30% 60%, color-mix(in srgb, var(--hero-accent) 22%, transparent), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.65)]" />
      {!reducedMotion &&
        Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-0 h-[3px] w-[3px] rounded-full"
            style={{
              left: `${(i * 97) % 100}%`,
              background: "#C8A96A",
              opacity: 0,
              animation: `hs-float ${14 + (i % 5)}s ease-in ${i * 1.3}s infinite`,
            }}
          />
        ))}

      {/* -------------------------------- content ------------------------------- */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-6 sm:px-12 lg:px-20"
      >
        <span
          data-stagger
          className="hs-sans mb-4 text-[11px] font-medium uppercase tracking-[0.4em]"
          style={{ color: "#C8A96A" }}
        >
          {safeCurrent?.label || "VYRAAA COLLECTION"}
        </span>
        <h1
          data-stagger
          className="hs-serif text-4xl font-light italic leading-[1.08] text-[#F8F5F0] sm:text-6xl lg:text-7xl"
        >
          {safeCurrent?.headline || "Crafted to Leave a Memory"}
        </h1>
        <p
          data-stagger
          className="hs-sans mt-5 max-w-md text-sm leading-relaxed text-[#F8F5F0]/70 sm:text-base"
        >
          {safeCurrent?.description ||
            "Discover handcrafted fragrances where timeless elegance meets modern sophistication."}
        </p>

        <div data-stagger className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={() =>
              safeCurrent?.ctaPrimaryLink && navigate(safeCurrent.ctaPrimaryLink)
            }
            className="hs-sans hs-glow rounded-full px-7 py-3 text-[13px] font-medium uppercase tracking-[0.15em] text-[#0D0D0D] transition-transform duration-300 hover:scale-[1.03]"
            style={{ background: "#C8A96A" }}
          >
            {safeCurrent?.ctaPrimaryLabel || "Explore Collection"}
          </button>
          <button
            onClick={() =>
              safeCurrent?.ctaSecondaryLink && navigate(safeCurrent.ctaSecondaryLink)
            }
            className="hs-glass hs-sans hs-glow rounded-full px-7 py-3 text-[13px] font-medium uppercase tracking-[0.15em] text-[#F8F5F0] transition-transform duration-300 hover:scale-[1.03]"
          >
            {safeCurrent?.ctaSecondaryLabel || "Discover Story"}
          </button>
        </div>
      </div>

      {/* -------------------------------- controls -------------------------------- */}
      {total > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 sm:px-12 sm:pb-8">
          {/* progress bar */}
          <div className="mb-4 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: "linear-gradient(90deg,#C8A96A,#B98A44)",
                transition: isAnimating ? "none" : "width 80ms linear",
              }}
            />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            {/* thumbnails */}
            <div
              ref={thumbStripRef}
              className="hs-sans flex items-center gap-2 overflow-x-auto"
            >
              {displaySlides.map((s, i) => (
                <button
                  key={s._id || i}
                  onClick={() => goTo(i, i > active ? 1 : -1)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`hs-glow relative h-12 w-20 shrink-0 overflow-hidden rounded-md border transition-all duration-300 sm:h-14 sm:w-24 ${
                    i === active
                      ? "border-[#C8A96A] opacity-100"
                      : "border-white/15 opacity-50 hover:opacity-80"
                  }`}
                  style={
                    i === active
                      ? { boxShadow: "0 0 0 1px #C8A96A, 0 0 14px -2px #C8A96A" }
                      : undefined
                  }
                >
                  {s.video ? (
                    <video
                      src={s.video}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: s.poster ? `url(${s.poster})` : undefined }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* arrows + dots + counter */}
            <div className="flex items-center gap-4">
              <span className="hs-sans text-xs tracking-[0.2em] text-[#F8F5F0]/60">
                {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-2">
                {displaySlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => goTo(i, i > active ? 1 : -1)}
                    className="hs-glow h-1.5 rounded-full bg-white/25 transition-all duration-300"
                    style={
                      i === active
                        ? { width: 22, background: "#C8A96A" }
                        : { width: 6 }
                    }
                  />
                ))}
              </div>

              <button
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
                className="hs-glass hs-glow flex h-9 w-9 items-center justify-center rounded-full text-[#F8F5F0]"
              >
                {isPaused ? (
                  <IoPlay className="text-sm" />
                ) : (
                  <IoPause className="text-sm" />
                )}
              </button>

              <button
                onClick={prev}
                disabled={isAnimating}
                aria-label="Previous slide"
                className="hs-glass hs-glow flex h-10 w-10 items-center justify-center rounded-full text-[#F8F5F0] disabled:opacity-40 sm:h-11 sm:w-11"
              >
                <IoArrowBack className="text-base" />
              </button>
              <button
                onClick={next}
                disabled={isAnimating}
                aria-label="Next slide"
                className="hs-glass hs-glow flex h-10 w-10 items-center justify-center rounded-full text-[#F8F5F0] disabled:opacity-40 sm:h-11 sm:w-11"
              >
                <IoArrowForward className="text-base" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}