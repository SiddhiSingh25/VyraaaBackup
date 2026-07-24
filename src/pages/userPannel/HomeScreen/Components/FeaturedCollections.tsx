// // import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
// // import { IoArrowBack, IoArrowForward } from "react-icons/io5";
// // import { useNavigate } from "react-router-dom";
// // import gsap from "gsap";
// // import { ScrollTrigger } from "gsap/ScrollTrigger";

// // import { apiUrls } from "@/apis";
// // import useGetQuery from "@/hooks/getQuery.hook";

// // // Fallback / placeholder asset — swap for real per-collection footage once
// // // the API returns a `video` field.
// // import sampleVideo from "../../../../assets/video.mp4";

// // gsap.registerPlugin(ScrollTrigger);

// // interface CollectionVideo {
// //   _id: string;
// //   video?: string;
// //   thumbnail?: string; // small circular avatar shown in the bottom bar
// //   name?: string;
// //   price?: number | string;
// //   slug?: string;
// // }

// // export default function FeaturedCollections() {
// //   const [videos, setVideos] = useState<CollectionVideo[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   const { getQuery } = useGetQuery();
// //   const navigate = useNavigate();

// //   const sectionRef = useRef<HTMLElement | null>(null);
// //   const headingRef = useRef<HTMLHeadingElement | null>(null);
// //   const wrapperRef = useRef<HTMLDivElement | null>(null); // fixed-width viewport around the track
// //   const trackRef = useRef<HTMLDivElement | null>(null); // the scrolling/centering flex row
// //   const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
// //   const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

// //   const total = videos.length;

// //   // How many cards should be visible at once per breakpoint. If there are
// //   // fewer videos than this, every video gets its own slot instead — that's
// //   // what makes 3 videos fill the row edge-to-edge and sit centered instead
// //   // of leaving an empty 4th column. Default is 4 (desktop).
// //   const [maxSlots, setMaxSlots] = useState(4);
// //   const [containerWidth, setContainerWidth] = useState(0);
// //   const [activeIndex, setActiveIndex] = useState(0);

// //   const effectiveSlots = Math.max(1, Math.min(total || 1, maxSlots));
// //   const isScrollable = total > maxSlots;
// //   const gap = containerWidth >= 1024 ? 20 : containerWidth >= 640 ? 16 : 12;
// //   const maxCardWidth = maxSlots === 4 ? 340 : maxSlots === 2 ? 320 : 300;
// //   const rawCardWidth =
// //     containerWidth > 0
// //       ? (containerWidth - gap * (effectiveSlots - 1)) / effectiveSlots
// //       : 0;
// //   const cardWidth =
// //     rawCardWidth > 0 ? Math.max(130, Math.min(maxCardWidth, rawCardWidth)) : 0;

// //   /* --------------------------------- fetch --------------------------------- */
// //   useEffect(() => {
// //     getQuery({
// //       url: apiUrls.Home.getVideos,
// //       onSuccess: (res: any) => {
// //         setVideos(res.data || []);
// //         setIsLoading(false);
// //       },
// //       onFail: (err: any) => {
// //         console.log(err);
// //         setIsLoading(false);
// //       },
// //     });
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const goToCollection = (cat: CollectionVideo) => {
// //     const path = cat?.slug || cat?._id;
// //     navigate(path ? `/collections/${path}` : "/collections");
// //   };

// //   const formatPrice = (price?: number | string) => {
// //     if (price === undefined || price === null || price === "") return null;
// //     const num = typeof price === "string" ? Number(price) : price;
// //     if (Number.isNaN(num)) return String(price);
// //     return `₹${num.toLocaleString("en-IN")}`;
// //   };

// //   /* ---------------------------- responsive slot math -------------------------- */
// //   useLayoutEffect(() => {
// //     const wrapper = wrapperRef.current;
// //     if (!wrapper) return;

// //     const measure = () => {
// //       setContainerWidth(wrapper.offsetWidth);
// //       setMaxSlots(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
// //     };

// //     measure();
// //     const ro = new ResizeObserver(measure);
// //     ro.observe(wrapper);
// //     window.addEventListener("resize", measure);
// //     return () => {
// //       ro.disconnect();
// //       window.removeEventListener("resize", measure);
// //     };
// //   }, [total]);

// //   /* ------------------------------ active dot tracking -------------------------- */
// //   const updateActiveFromScroll = useCallback(() => {
// //     const track = trackRef.current;
// //     if (!track) return;
// //     const trackRect = track.getBoundingClientRect();
// //     const center = trackRect.left + trackRect.width / 2;
// //     let closest = 0;
// //     let closestDist = Infinity;
// //     cardRefs.current.forEach((el, idx) => {
// //       if (!el) return;
// //       const r = el.getBoundingClientRect();
// //       const dist = Math.abs(r.left + r.width / 2 - center);
// //       if (dist < closestDist) {
// //         closestDist = dist;
// //         closest = idx;
// //       }
// //     });
// //     setActiveIndex(closest);
// //   }, []);

// //   const scrollRaf = useRef<number | null>(null);
// //   const handleTrackScroll = () => {
// //     if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
// //     scrollRaf.current = requestAnimationFrame(updateActiveFromScroll);
// //   };

// //   // Wraps around at both ends so the arrows (and the auto-advance-on-end
// //   // behavior below) never get stuck / disabled at the boundaries.
// //   const goToIndex = useCallback(
// //     (idx: number) => {
// //       if (total === 0) return;
// //       const wrapped = ((idx % total) + total) % total;
// //       cardRefs.current[wrapped]?.scrollIntoView({
// //         behavior: "smooth",
// //         inline: "center",
// //         block: "nearest",
// //       });
// //       setActiveIndex(wrapped);
// //     },
// //     [total],
// //   );

// //   const handlePrev = () => goToIndex(activeIndex - 1);
// //   const handleNext = () => goToIndex(activeIndex + 1);

// //   /* --------------------------- play only visible cards ---------------------------- */
// //   // Autoplaying every video at once is wasteful once you have more than a
// //   // handful of cards, especially on mobile. Only decode/play the ones
// //   // actually on screen (matters on the horizontally-scrollable mobile track).
// //   useEffect(() => {
// //     if (typeof IntersectionObserver === "undefined") return;
// //     const observer = new IntersectionObserver(
// //       (entries) => {
// //         entries.forEach((entry) => {
// //           const vid = entry.target as HTMLVideoElement;
// //           if (entry.isIntersecting) {
// //             vid.play().catch(() => {});
// //           } else {
// //             vid.pause();
// //           }
// //         });
// //       },
// //       { threshold: 0.35 },
// //     );
// //     videoRefs.current.forEach((vid) => vid && observer.observe(vid));
// //     return () => observer.disconnect();
// //   }, [videos]);

// //   // When the *focused* card's video finishes, auto-advance the track to the
// //   // next one (wrapping back to the first after the last). Cards that aren't
// //   // currently focused just quietly loop themselves so the row still looks
// //   // "alive" while you're watching a different one.
// //   const handleVideoEnded = (i: number) => {
// //     if (!isScrollable) return; // nothing to advance to — let it loop natively
// //     if (i === activeIndex) {
// //       goToIndex(activeIndex + 1);
// //     } else {
// //       const vid = videoRefs.current[i];
// //       if (vid) {
// //         vid.currentTime = 0;
// //         vid.play().catch(() => {});
// //       }
// //     }
// //   };

// //   /* -------------------------------- entrance -------------------------------- */
// //   useLayoutEffect(() => {
// //     if (videos.length === 0) return;
// //     const reduced = window.matchMedia(
// //       "(prefers-reduced-motion: reduce)",
// //     ).matches;

// //     const ctx = gsap.context(() => {
// //       if (reduced) {
// //         gsap.set([headingRef.current, ...cardRefs.current], { autoAlpha: 1 });
// //         return;
// //       }

// //       gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
// //       gsap.set(cardRefs.current, { autoAlpha: 0, y: 28 });

// //       const tl = gsap.timeline({
// //         scrollTrigger: {
// //           trigger: sectionRef.current,
// //           start: "top 78%",
// //           once: true,
// //         },
// //         defaults: { ease: "power3.out" },
// //       });

// //       tl.to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.65 }).to(
// //         cardRefs.current,
// //         { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
// //         "-=0.3",
// //       );
// //     }, sectionRef);

// //     return () => ctx.revert();
// //   }, [videos.length]);

// //   /* --------------------------------- render ---------------------------------- */

// //   if (isLoading) {
// //     return (
// //       <section className="bg-background px-5 py-10 sm:px-10 lg:px-16">
// //         <div className="mx-auto flex max-w-[1300px] gap-3 overflow-hidden sm:gap-4 lg:gap-5">
// //           {[0, 1, 2, 3].map((i) => (
// //             <div
// //               key={i}
// //               className="fc-card-skel aspect-[3/3.8] w-[38%] shrink-0 animate-pulse rounded-2xl border border-border bg-card sm:w-[26%] lg:w-1/4"
// //             />
// //           ))}
// //         </div>
// //       </section>
// //     );
// //   }

// //   if (videos.length === 0) {
// //     return (
// //       <section className="bg-background px-5 py-14 text-center">
// //         <p className="fc-sans text-sm text-muted">No collections to show yet.</p>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section
// //       ref={sectionRef}
// //       className="relative bg-background px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16"
// //     >
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap');
// //         .fc-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }
// //         .fc-sans { font-family: 'Manrope', 'Inter', sans-serif; }

// //         /* Horizontal scroll-snap track. Card width + gap are computed in JS
// //            (see cardWidth/gap above) from the actual container width and the
// //            video count, so: fewer videos than fit on screen => they share the
// //            row evenly and sit centered with no leftover gap; more videos than
// //            fit => fixed comfortable width and it becomes a swipeable/scrollable
// //            row with working arrows + dots. */
// //         .fc-track {
// //           display: flex;
// //           overflow-x: auto;
// //           scroll-snap-type: x mandatory;
// //           scroll-behavior: smooth;
// //           -webkit-overflow-scrolling: touch;
// //           scrollbar-width: none;
// //           padding: 2px; /* room for the focus ring / hover shadow */
// //         }
// //         .fc-track::-webkit-scrollbar { display: none; }
// //         .fc-track--static {
// //           overflow-x: hidden;
// //           scroll-snap-type: none;
// //           justify-content: center;
// //         }
// //         .fc-card {
// //           scroll-snap-align: center;
// //           flex: 0 0 auto;
// //           width: 70%; /* fallback before the JS width kicks in on mount */
// //         }

// // .fc-nav-btn {
// // cursor: pointer;
// //   transition: background-color .3s ease, box-shadow .3s ease, border-color .3s ease;
// // }

// // .fc-nav-btn:hover {
// //   background: rgba(0, 0, 0, 0.45);
// //   border-color: rgba(255, 255, 255, 0.45);
// //   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
// // }

// // .fc-nav-btn:active {
// //   background: rgba(0, 0, 0, 0.6);
// // }

// //         .fc-nav-btn:focus-visible {
// //           outline: none;
// //           box-shadow: 0 0 0 2px rgba(131,82,64,0.35), 0 0 0 1px var(--color-primary, #835240);
// //         }

// //         .fc-dot {
// //           transition: width .35s cubic-bezier(.22,.61,.36,1), background-color .35s ease;
// //         }
// //         .fc-dot:focus-visible {
// //           outline: none;
// //           box-shadow: 0 0 0 2px rgba(131,82,64,0.35);
// //         }

// //         .fc-card-inner {
// //           transition: box-shadow .4s cubic-bezier(.22,.61,.36,1), border-color .4s ease;
// //         }
// //         .fc-card-inner:hover {
// //           box-shadow: 0 24px 48px -20px rgba(59,48,42,0.45);
// //           border-color: var(--color-primary, #835240);
// //         }
// //         .fc-card-inner:focus-visible {
// //           outline: none;
// //           box-shadow: 0 0 0 2px rgba(131,82,64,0.35), 0 0 0 1px var(--color-primary, #835240);
// //         }
// //         .fc-thumb {
// //           box-shadow: 0 0 0 1px rgba(255,255,255,0.5);
// //         }
// //       `}</style>

// //       {/* --------------------------------- heading ---------------------------------- */}
// //       <div className="relative z-10 mb-6 text-center sm:mb-9">
// //         <span className="fc-sans block text-[10px] font-semibold uppercase tracking-[0.32em] text-muted">
// //           See It In Action
// //         </span>
// //         <h2
// //           ref={headingRef}
// //           className="fc-serif mt-2 text-3xl font-light italic leading-tight text-dark/90 sm:text-4xl lg:text-[2.75rem]"
// //         >
// //           Shop The Experience
// //         </h2>
// //       </div>

// //       {/* ---------------------------------- stage ------------------------------------ */}
// //       <div ref={wrapperRef} className="relative z-10 mx-auto max-w-[1300px]">
// //         {total > 1 && (
// //           <button
// //             type="button"
// //             onClick={handlePrev}
// //             aria-label="Previous collection"
// //             className="fc-nav-btn absolute left-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md sm:-left-3 sm:h-11 sm:w-11 lg:-left-6 lg:h-12 lg:w-12"
// //             style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
// //           >
// //             <IoArrowBack className="relative z-10 text-sm sm:text-base" />
// //           </button>
// //         )}

// //         {total > 1 && (
// //           <button
// //             type="button"
// //             onClick={handleNext}
// //             aria-label="Next collection"
// //             className="fc-nav-btn absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md sm:-right-3 sm:h-11 sm:w-11 lg:-right-6 lg:h-12 lg:w-12"
// //             style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
// //           >
// //             <IoArrowForward className="relative z-10 text-sm sm:text-base" />
// //           </button>
// //         )}

// //         <div
// //           ref={trackRef}
// //           onScroll={isScrollable ? handleTrackScroll : undefined}
// //           className={`fc-track ${isScrollable ? "" : "fc-track--static"}`}
// //           style={{ gap: `${gap}px` }}
// //         >
// //           {videos.map((cat, i) => {
// //             const videoSrc = cat.video || sampleVideo;
// //             const price = formatPrice(cat.price);
// //             return (
// //               <div
// //                 key={cat._id}
// //                 ref={(el) => {
// //                   cardRefs.current[i] = el;
// //                 }}
// //                 className="fc-card"
// //                 style={cardWidth ? { width: `${cardWidth}px` } : undefined}
// //               >
// //                 <div
// //                   role="button"
// //                   tabIndex={0}
// //                   onClick={() => goToCollection(cat)}
// //                   onKeyDown={(e) => {
// //                     if (e.key === "Enter" || e.key === " ") goToCollection(cat);
// //                   }}
// //                   className="fc-card-inner relative aspect-[3/3.8] w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
// //                 >
// //                   <video
// //                     ref={(el) => {
// //                       videoRefs.current[i] = el;
// //                     }}
// //                     src={videoSrc}
// //                     muted
// //                     loop={!isScrollable}
// //                     playsInline
// //                     preload="metadata"
// //                     onEnded={() => handleVideoEnded(i)}
// //                     className="absolute inset-0 h-full w-full object-cover object-center"
// //                   />

// //                   {/* bottom scrim so the info bar stays legible over any footage */}
// //                   <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 via-black/25 to-transparent sm:h-20" />

// //                   {/* bottom info bar: avatar + name / price */}
// //                   <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2 sm:gap-2 sm:p-2.5">
// //                     <span className="fc-thumb h-15 w-15 shrink-0 overflow-hidden rounded-full border border-white/30 bg-dark sm:h-7 sm:w-7">
// //                       <img
// //                           src="logo.png"
// //                           alt=""
// //                           className="h-full w-full object-cover"
// //                         />
// //                     </span>
// //                     <div className="min-w-0 text-left">
// //                       <p className="fc-sans truncate text-[10px] font-semibold leading-tight text-white sm:text-xs">
// //                         {"Eau De Parfum"}
// //                       </p>
// //                       {(
// //                         <p className="fc-sans text-[9px] leading-tight text-white/70 sm:text-[10px]">
// //                           Exclusive Products
// //                         </p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* ------------------------------- dots ---------------------------------- */}
// //       {total > 1 && (
// //         <div className="relative z-20 mt-4 flex items-center justify-center sm:mt-6">
// //           <div className="fc-sans flex items-center gap-2">
// //             {videos.map((_, i) => (
// //               <button
// //                 key={i}
// //                 type="button"
// //                 aria-label={`Go to slide ${i + 1}`}
// //                 onClick={() => goToIndex(i)}
// //                 className="fc-dot h-1.5 w-1.5 rounded-full bg-border"
// //                 style={
// //                   i === activeIndex
// //                     ? { width: 18, background: "var(--color-primary, #835240)" }
// //                     : undefined
// //                 }
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </section>
// //   );
// // }









// import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
// import { IoArrowBack, IoArrowForward } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { apiUrls } from "@/apis";
// import useGetQuery from "@/hooks/getQuery.hook";

// // Fallback / placeholder asset — swap for real per-collection footage once
// // the API returns a `video` field.
// import sampleVideo from "../../../../assets/video.mp4";

// gsap.registerPlugin(ScrollTrigger);

// interface CollectionVideo {
//   _id: string;
//   video?: string;
//   thumbnail?: string; // small circular avatar shown in the bottom bar
//   name?: string;
//   price?: number | string;
//   slug?: string;
// }

// export default function FeaturedCollections() {
//   const [videos, setVideos] = useState<CollectionVideo[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const { getQuery } = useGetQuery();
//   const navigate = useNavigate();

//   const sectionRef = useRef<HTMLElement | null>(null);
//   const headingRef = useRef<HTMLHeadingElement | null>(null);
//   const wrapperRef = useRef<HTMLDivElement | null>(null); // fixed-width viewport around the track
//   const trackRef = useRef<HTMLDivElement | null>(null); // the scrolling/centering flex row
//   const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
//   const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

//   const total = videos.length;

//   // How many cards should be visible at once per breakpoint. If there are
//   // fewer videos than this, every video gets its own slot instead — that's
//   // what makes 3 videos fill the row edge-to-edge and sit centered instead
//   // of leaving an empty 4th column. Default is 4 (desktop).
//   const [maxSlots, setMaxSlots] = useState(4);
//   const [containerWidth, setContainerWidth] = useState(0);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const effectiveSlots = Math.max(1, Math.min(total || 1, maxSlots));
//   const isScrollable = total > maxSlots;
//   const gap = containerWidth >= 1024 ? 20 : containerWidth >= 640 ? 16 : 12;
//   const maxCardWidth = maxSlots === 4 ? 340 : maxSlots === 2 ? 320 : 300;
//   const rawCardWidth =
//     containerWidth > 0
//       ? (containerWidth - gap * (effectiveSlots - 1)) / effectiveSlots
//       : 0;
//   const cardWidth =
//     rawCardWidth > 0 ? Math.max(130, Math.min(maxCardWidth, rawCardWidth)) : 0;

//   /* --------------------------------- fetch --------------------------------- */
//   useEffect(() => {
//     getQuery({
//       url: apiUrls.Home.getVideos,
//       onSuccess: (res: any) => {
//         setVideos(res.data || []);
//         setIsLoading(false);
//       },
//       onFail: (err: any) => {
//         console.log(err);
//         setIsLoading(false);
//       },
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const goToCollection = (cat: CollectionVideo) => {
//     const path = cat?.slug || cat?._id;
//     navigate(path ? `/collections/${path}` : "/collections");
//   };

//   const formatPrice = (price?: number | string) => {
//     if (price === undefined || price === null || price === "") return null;
//     const num = typeof price === "string" ? Number(price) : price;
//     if (Number.isNaN(num)) return String(price);
//     return `₹${num.toLocaleString("en-IN")}`;
//   };

//   /* ---------------------------- responsive slot math -------------------------- */
//   useLayoutEffect(() => {
//     const wrapper = wrapperRef.current;
//     if (!wrapper) return;

//     const measure = () => {
//       setContainerWidth(wrapper.offsetWidth);
//       setMaxSlots(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
//     };

//     measure();
//     const ro = new ResizeObserver(measure);
//     ro.observe(wrapper);
//     window.addEventListener("resize", measure);
//     return () => {
//       ro.disconnect();
//       window.removeEventListener("resize", measure);
//     };
//   }, [total]);

//   /* ------------------------------ active dot tracking -------------------------- */
//   const updateActiveFromScroll = useCallback(() => {
//     const track = trackRef.current;
//     if (!track) return;
//     const trackRect = track.getBoundingClientRect();
//     const center = trackRect.left + trackRect.width / 2;
//     let closest = 0;
//     let closestDist = Infinity;
//     cardRefs.current.forEach((el, idx) => {
//       if (!el) return;
//       const r = el.getBoundingClientRect();
//       const dist = Math.abs(r.left + r.width / 2 - center);
//       if (dist < closestDist) {
//         closestDist = dist;
//         closest = idx;
//       }
//     });
//     setActiveIndex(closest);
//   }, []);

//   const scrollRaf = useRef<number | null>(null);
//   const handleTrackScroll = () => {
//     if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
//     scrollRaf.current = requestAnimationFrame(updateActiveFromScroll);
//   };

//   // Wraps around at both ends so the arrows (and the auto-advance-on-end
//   // behavior below) never get stuck / disabled at the boundaries.
//   // Animation is driven by GSAP (tweening scrollLeft directly) instead of
//   // scrollIntoView so the easing is consistent across browsers and the
//   // active card always lands centered, even at the scroll boundaries.
//   const goToIndex = useCallback(
//     (idx: number) => {
//       if (total === 0) return;
//       const wrapped = ((idx % total) + total) % total;
//       const track = trackRef.current;
//       const card = cardRefs.current[wrapped];

//       if (track && card) {
//         const maxScroll = track.scrollWidth - track.clientWidth;
//         const target =
//           card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
//         const clamped = Math.max(0, Math.min(target, maxScroll));

//         gsap.to(track, {
//           scrollLeft: clamped,
//           duration: 0.6,
//           ease: "power3.out",
//           overwrite: "auto",
//         });
//       }

//       setActiveIndex(wrapped);
//     },
//     [total],
//   );

//   const handlePrev = () => goToIndex(activeIndex - 1);
//   const handleNext = () => goToIndex(activeIndex + 1);

//   /* --------------------------- play only visible cards ---------------------------- */
//   // Autoplaying every video at once is wasteful once you have more than a
//   // handful of cards, especially on mobile. Only decode/play the ones
//   // actually on screen (matters on the horizontally-scrollable mobile track).
//   useEffect(() => {
//     if (typeof IntersectionObserver === "undefined") return;
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const vid = entry.target as HTMLVideoElement;
//           if (entry.isIntersecting) {
//             vid.play().catch(() => { });
//           } else {
//             vid.pause();
//           }
//         });
//       },
//       { threshold: 0.35 },
//     );
//     videoRefs.current.forEach((vid) => vid && observer.observe(vid));
//     return () => observer.disconnect();
//   }, [videos]);

//   // When the *focused* card's video finishes, auto-advance the track to the
//   // next one (wrapping back to the first after the last). Cards that aren't
//   // currently focused just quietly loop themselves so the row still looks
//   // "alive" while you're watching a different one.
//   const handleVideoEnded = (i: number) => {
//     if (!isScrollable) return; // nothing to advance to — let it loop natively
//     if (i === activeIndex) {
//       goToIndex(activeIndex + 1);
//     } else {
//       const vid = videoRefs.current[i];
//       if (vid) {
//         vid.currentTime = 0;
//         vid.play().catch(() => { });
//       }
//     }
//   };

//   /* -------------------------------- entrance -------------------------------- */
//   useLayoutEffect(() => {
//     if (videos.length === 0) return;
//     const reduced = window.matchMedia(
//       "(prefers-reduced-motion: reduce)",
//     ).matches;

//     const ctx = gsap.context(() => {
//       if (reduced) {
//         gsap.set([headingRef.current, ...cardRefs.current], { autoAlpha: 1 });
//         return;
//       }

//       gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
//       gsap.set(cardRefs.current, { autoAlpha: 0, y: 28 });

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 78%",
//           once: true,
//         },
//         defaults: { ease: "power3.out" },
//       });

//       tl.to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.65 }).to(
//         cardRefs.current,
//         { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
//         "-=0.3",
//       );
//     }, sectionRef);

//     return () => ctx.revert();
//   }, [videos.length]);

//   /* --------------------------------- render ---------------------------------- */

//   if (isLoading) {
//     return (
//       <section className="bg-background px-5 py-10 sm:px-10 lg:px-16">
//         <div className="mx-auto flex max-w-[1300px] gap-3 overflow-hidden sm:gap-4 lg:gap-5">
//           {[0, 1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="fc-card-skel aspect-[3/3.8] w-[38%] shrink-0 animate-pulse rounded-2xl border border-border bg-card sm:w-[26%] lg:w-1/4"
//             />
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (videos.length === 0) {
//     return (
//       <section className="bg-background px-5 py-14 text-center">
//         <p className="fc-sans text-sm text-muted">No collections to show yet.</p>
//       </section>
//     );
//   }

//   return (
//     <section
//       ref={sectionRef}
//       className="relative bg-background px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16"
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap');
//         .fc-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }
//         .fc-sans { font-family: 'Manrope', 'Inter', sans-serif; }

//         /* Horizontal scroll-snap track. Card width + gap are computed in JS
//            (see cardWidth/gap above) from the actual container width and the
//            video count, so: fewer videos than fit on screen => they share the
//            row evenly and sit centered with no leftover gap; more videos than
//            fit => fixed comfortable width and it becomes a swipeable/scrollable
//            row with working arrows + dots.
//            Note: no CSS scroll-behavior here — the arrow-driven slide is
//            animated by GSAP directly, and letting the browser's native
//            smooth-scroll run at the same time causes the two animations to
//            fight each other and stutter. Touch/trackpad swiping is untouched
//            and stays native. */
//         .fc-track {
//           display: flex;
//           overflow-x: auto;
//           scroll-snap-type: x mandatory;
//           -webkit-overflow-scrolling: touch;
//           scrollbar-width: none;
//           padding: 2px; /* room for the focus ring / hover shadow */
//         }
//         .fc-track::-webkit-scrollbar { display: none; }
//         .fc-track--static {
//           overflow-x: hidden;
//           scroll-snap-type: none;
//           justify-content: center;
//         }
//         .fc-card {
//           scroll-snap-align: center;
//           flex: 0 0 auto;
//           width: 70%; /* fallback before the JS width kicks in on mount */
//         }

// .fc-nav-btn {
// cursor: pointer;
//   transition: background-color .3s ease, box-shadow .3s ease, border-color .3s ease;
// }

// .fc-nav-btn:hover {
//   background: rgba(0, 0, 0, 0.45);
//   border-color: rgba(255, 255, 255, 0.45);
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
// }

// .fc-nav-btn:active {
//   background: rgba(0, 0, 0, 0.6);
// }

//         .fc-nav-btn:focus-visible {
//           outline: none;
//           box-shadow: 0 0 0 2px rgba(131,82,64,0.35), 0 0 0 1px var(--color-primary, #835240);
//         }

//         .fc-dot {
//           transition: width .35s cubic-bezier(.22,.61,.36,1), background-color .35s ease;
//         }
//         .fc-dot:focus-visible {
//           outline: none;
//           box-shadow: 0 0 0 2px rgba(131,82,64,0.35);
//         }

//         .fc-card-inner {
//           transition: box-shadow .4s cubic-bezier(.22,.61,.36,1), border-color .4s ease;
//         }
//         .fc-card-inner:hover {
//           box-shadow: 0 24px 48px -20px rgba(59,48,42,0.45);
//           border-color: var(--color-primary, #835240);
//         }
//         .fc-card-inner:focus-visible {
//           outline: none;
//           box-shadow: 0 0 0 2px rgba(131,82,64,0.35), 0 0 0 1px var(--color-primary, #835240);
//         }
//         .fc-thumb {
//           box-shadow: 0 0 0 1px rgba(255,255,255,0.5);
//         }
//       `}</style>

//       {/* --------------------------------- heading ---------------------------------- */}
//       <div className="relative z-10 mb-6 text-center sm:mb-9">
//         <span className="fc-sans block text-[10px] font-semibold uppercase tracking-[0.32em] text-muted">
//           See It In Action
//         </span>
//         <h2
//           ref={headingRef}
//           className="fc-serif mt-2 text-3xl font-light italic leading-tight text-dark/90 sm:text-4xl lg:text-[2.75rem]"
//         >
//           Shop The Experience
//         </h2>
//       </div>

//       {/* ---------------------------------- stage ------------------------------------ */}
//       <div ref={wrapperRef} className="relative z-10 mx-auto max-w-[1300px]">
//         {isScrollable && (
//           <button
//             type="button"
//             onClick={handlePrev}
//             aria-label="Previous collection"
//             className="fc-nav-btn absolute left-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md sm:-left-3 sm:h-11 sm:w-11 lg:-left-6 lg:h-12 lg:w-12"
//             style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
//           >
//             <IoArrowBack className="relative z-10 text-sm sm:text-base" />
//           </button>
//         )}

//         {isScrollable && (
//           <button
//             type="button"
//             onClick={handleNext}
//             aria-label="Next collection"
//             className="fc-nav-btn absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md sm:-right-3 sm:h-11 sm:w-11 lg:-right-6 lg:h-12 lg:w-12"
//             style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
//           >
//             <IoArrowForward className="relative z-10 text-sm sm:text-base" />
//           </button>
//         )}

//         <div
//           ref={trackRef}
//           onScroll={isScrollable ? handleTrackScroll : undefined}
//           className={`fc-track ${isScrollable ? "" : "fc-track--static"}`}
//           style={{ gap: `${gap}px` }}
//         >
//           {videos.map((cat, i) => {
//             const videoSrc = cat.video || sampleVideo;
//             const price = formatPrice(cat.price);
//             return (
//               <div
//                 key={cat._id}
//                 ref={(el) => {
//                   cardRefs.current[i] = el;
//                 }}
//                 className="fc-card"
//                 style={cardWidth ? { width: `${cardWidth}px` } : undefined}
//               >
//                 <div
//                   role="button"
//                   tabIndex={0}
//                   onClick={() => goToCollection(cat)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") goToCollection(cat);
//                   }}
//                   className="fc-card-inner relative aspect-[3/3.8] w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
//                 >
//                   <video
//                     ref={(el) => {
//                       videoRefs.current[i] = el;
//                     }}
//                     src={videoSrc}
//                     muted
//                     loop={!isScrollable}
//                     playsInline
//                     preload="metadata"
//                     onEnded={() => handleVideoEnded(i)}
//                     className="absolute inset-0 h-full w-full object-cover object-center"
//                   />

//                   {/* bottom scrim so the info bar stays legible over any footage */}
//                   <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 via-black/25 to-transparent sm:h-20" />

//                   {/* bottom info bar: avatar + name / price */}
//                   <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2 sm:gap-2 sm:p-2.5">
//                     <span className="fc-thumb h-15 w-15 shrink-0 overflow-hidden rounded-full border border-white/30 bg-dark sm:h-7 sm:w-7">
//                       <img
//                         src="logo.png"
//                         alt=""
//                         className="h-full w-full object-cover"
//                       />
//                     </span>
//                     <div className="min-w-0 text-left">
//                       <p className="fc-sans truncate text-[10px] font-semibold leading-tight text-white sm:text-xs">
//                         {"Eau De Parfum"}
//                       </p>
//                       {(
//                         <p className="fc-sans text-[9px] leading-tight text-white/70 sm:text-[10px]">
//                           Exclusive Products
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ------------------------------- dots ---------------------------------- */}
//       {isScrollable && (
//         <div className="relative z-20 mt-4 flex items-center justify-center sm:mt-6">
//           <div className="fc-sans flex items-center gap-2">
//             {videos.map((_, i) => (
//               <button
//                 key={i}
//                 type="button"
//                 aria-label={`Go to slide ${i + 1}`}
//                 onClick={() => goToIndex(i)}
//                 className="fc-dot h-1.5 w-1.5 rounded-full bg-border"
//                 style={
//                   i === activeIndex
//                     ? { width: 18, background: "var(--color-primary, #835240)" }
//                     : undefined
//                 }
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }










import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { apiUrls } from "@/apis";
import useGetQuery from "@/hooks/getQuery.hook";

import sampleVideo from "../../../../assets/video.mp4";

gsap.registerPlugin(ScrollTrigger);

interface CollectionVideo {
  _id: string;
  video?: string;
  thumbnail?: string;
  name?: string;
  price?: number | string;
  slug?: string;
}

export default function FeaturedCollections() {
  const [videos, setVideos] = useState<CollectionVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getQuery } = useGetQuery();
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const total = videos.length;

  const [maxSlots, setMaxSlots] = useState(4);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const effectiveSlots = Math.max(1, Math.min(total || 1, maxSlots));
  const isScrollable = total > maxSlots; // still used for per-card loop + snap tuning
  const showNav = total > 1; // arrows/dots show for any 2+ items, not just when overflowing
  const gap = containerWidth >= 1024 ? 20 : containerWidth >= 640 ? 16 : 12;
  const maxCardWidth = maxSlots === 4 ? 340 : maxSlots === 2 ? 320 : 300;
  const rawCardWidth =
    containerWidth > 0
      ? (containerWidth - gap * (effectiveSlots - 1)) / effectiveSlots
      : 0;
  const cardWidth =
    rawCardWidth > 0 ? Math.max(130, Math.min(maxCardWidth, rawCardWidth)) : 0;

  /* --------------------------------- fetch --------------------------------- */
  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToCollection = (cat: CollectionVideo) => {
    const path = cat?.slug || cat?._id;
    navigate(path ? `/collections/${path}` : "/collections");
  };

  const formatPrice = (price?: number | string) => {
    if (price === undefined || price === null || price === "") return null;
    const num = typeof price === "string" ? Number(price) : price;
    if (Number.isNaN(num)) return String(price);
    return `₹${num.toLocaleString("en-IN")}`;
  };

  /* ---------------------------- responsive slot math -------------------------- */
  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const measure = () => {
      setContainerWidth(wrapper.offsetWidth);
      setMaxSlots(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [total]);

  /* ------------------------------ active dot tracking -------------------------- */
  const updateActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let closest = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = idx;
      }
    });
    setActiveIndex(closest);
  }, []);

  const scrollRaf = useRef<number | null>(null);
  const handleTrackScroll = () => {
    if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
    scrollRaf.current = requestAnimationFrame(updateActiveFromScroll);
  };

  // Wraps around at both ends. Animation is driven by GSAP tweening
  // scrollLeft directly for consistent easing. When every card already
  // fits on screen (nothing left to scroll), the tween is a no-op distance-
  // wise, but activeIndex still updates — which drives the highlighted-card
  // ring/scale below, so the arrows always produce a visible result.
  const goToIndex = useCallback(
    (idx: number) => {
      if (total === 0) return;
      const wrapped = ((idx % total) + total) % total;
      const track = trackRef.current;
      const card = cardRefs.current[wrapped];

      if (track && card) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const target =
          card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
        const clamped = Math.max(0, Math.min(target, maxScroll));

        gsap.to(track, {
          scrollLeft: clamped,
          duration: 0.6,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      setActiveIndex(wrapped);
    },
    [total],
  );

  const handlePrev = () => goToIndex(activeIndex - 1);
  const handleNext = () => goToIndex(activeIndex + 1);

  /* --------------------------- play only visible cards ---------------------------- */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            vid.play().catch(() => { });
          } else {
            vid.pause();
          }
        });
      },
      { threshold: 0.35 },
    );
    videoRefs.current.forEach((vid) => vid && observer.observe(vid));
    return () => observer.disconnect();
  }, [videos]);

  // When the focused card's video finishes, advance to the next one. Cards
  // that aren't focused just loop themselves. Note: when loop={true} (the
  // non-scrollable case), the browser never fires 'ended' at all, so this
  // naturally only matters when isScrollable — no explicit guard needed.
  const handleVideoEnded = (i: number) => {
    if (i === activeIndex) {
      goToIndex(activeIndex + 1);
    } else {
      const vid = videoRefs.current[i];
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      }
    }
  };

  /* -------------------------------- entrance -------------------------------- */
  useLayoutEffect(() => {
    if (videos.length === 0) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([headingRef.current, ...cardRefs.current], { autoAlpha: 1 });
        return;
      }

      gsap.set(headingRef.current, { autoAlpha: 0, y: 16 });
      gsap.set(cardRefs.current, { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      tl.to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.65 }).to(
        cardRefs.current,
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
        "-=0.3",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [videos.length]);

  /* --------------------------------- render ---------------------------------- */

  if (isLoading) {
    return (
      <section className="bg-background px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1300px] gap-3 overflow-hidden sm:gap-4 lg:gap-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="fc-card-skel aspect-[3/3.8] w-[38%] shrink-0 animate-pulse rounded-2xl border border-border bg-card sm:w-[26%] lg:w-1/4"
            />
          ))}
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="bg-background px-5 py-14 text-center">
        <p className="fc-sans text-sm text-muted">No collections to show yet.</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-background px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,400&family=Manrope:wght@300;400;500;600&display=swap');
        .fc-serif { font-family: 'Cormorant Garamond', 'Playfair Display', serif; }
        .fc-sans { font-family: 'Manrope', 'Inter', sans-serif; }

        /* Track is always horizontally scrollable. "justify-content: safe
           center" centers the cards when they all fit inside the viewport
           (nothing to scroll), but automatically switches to normal
           start-aligned scrolling the moment content overflows — so nothing
           gets clipped and the track never fights itself. No separate
           "static" variant needed anymore. */
        .fc-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 2px;
          justify-content: safe center;
        }
        .fc-track::-webkit-scrollbar { display: none; }
        .fc-card {
          scroll-snap-align: center;
          flex: 0 0 auto;
          width: 70%;
        }

        .fc-nav-btn {
          cursor: pointer;
          transition: background-color .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .fc-nav-btn:hover {
          background: rgba(0, 0, 0, 0.45);
          border-color: rgba(255, 255, 255, 0.45);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }
        .fc-nav-btn:active {
          background: rgba(0, 0, 0, 0.6);
        }
        .fc-nav-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(131,82,64,0.35), 0 0 0 1px var(--color-primary, #835240);
        }

        .fc-dot {
          transition: width .35s cubic-bezier(.22,.61,.36,1), background-color .35s ease;
        }
        .fc-dot:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(131,82,64,0.35);
        }

        .fc-card-inner {
          transition: box-shadow .4s cubic-bezier(.22,.61,.36,1), border-color .4s ease, transform .4s cubic-bezier(.22,.61,.36,1);
        }
        .fc-card-inner:hover {
          box-shadow: 0 24px 48px -20px rgba(59,48,42,0.45);
          border-color: var(--color-primary, #835240);
        }
        .fc-card-inner:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(131,82,64,0.35), 0 0 0 1px var(--color-primary, #835240);
        }
        /* Active-card highlight — visible feedback from the arrows even in
           the case where every card is already on screen and there's no
           distance left to scroll. */
        .fc-card-inner--active {
          border-color: var(--color-primary, #835240);
          box-shadow: 0 24px 48px -20px rgba(59,48,42,0.45);
          transform: scale(1.015);
        }
        .fc-thumb {
          box-shadow: 0 0 0 1px rgba(255,255,255,0.5);
        }
      `}</style>

      <div className="relative z-10 mb-6 text-center sm:mb-9">
        <span className="fc-sans block text-[10px] font-semibold uppercase tracking-[0.32em] text-muted">
          See It In Action
        </span>
        <h2
          ref={headingRef}
          className="fc-serif mt-2 text-3xl font-light italic leading-tight text-dark/90 sm:text-4xl lg:text-[2.75rem]"
        >
          Shop The Experience
        </h2>
      </div>

      <div ref={wrapperRef} className="relative z-10 mx-auto max-w-[1300px]">
        {showNav && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous collection"
            className="fc-nav-btn absolute left-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md sm:-left-3 sm:h-11 sm:w-11 lg:-left-6 lg:h-12 lg:w-12"
            style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
          >
            <IoArrowBack className="relative z-10 text-sm sm:text-base" />
          </button>
        )}

        {showNav && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next collection"
            className="fc-nav-btn absolute right-2 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md sm:-right-3 sm:h-11 sm:w-11 lg:-right-6 lg:h-12 lg:w-12"
            style={{ boxShadow: "0 8px 22px -10px rgba(0,0,0,0.45)" }}
          >
            <IoArrowForward className="relative z-10 text-sm sm:text-base" />
          </button>
        )}

        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="fc-track"
          style={{ gap: `${gap}px` }}
        >
          {videos.map((cat, i) => {
            const videoSrc = cat.video || sampleVideo;
            return (
              <div
                key={cat._id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="fc-card"
                style={cardWidth ? { width: `${cardWidth}px` } : undefined}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => goToCollection(cat)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") goToCollection(cat);
                  }}
                  className={`fc-card-inner relative aspect-[3/3.8] w-full cursor-pointer overflow-hidden rounded-2xl border border-border bg-card ${i === activeIndex ? "fc-card-inner--active" : ""
                    }`}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={videoSrc}
                    muted
                    loop={!isScrollable}
                    playsInline
                    preload="metadata"
                    onEnded={() => handleVideoEnded(i)}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 via-black/25 to-transparent sm:h-20" />

                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2 sm:gap-2 sm:p-2.5">
                    <span className="fc-thumb h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/30 bg-dark sm:h-7 sm:w-7">
                      <img src="logo.png" alt="" className="h-full w-full object-cover" />
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="fc-sans truncate text-[10px] font-semibold leading-tight text-white sm:text-xs">
                        {"Eau De Parfum"}
                      </p>
                      <p className="fc-sans text-[9px] leading-tight text-white/70 sm:text-[10px]">
                        Exclusive Products
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showNav && (
        <div className="relative z-20 mt-4 flex items-center justify-center sm:mt-6">
          <div className="fc-sans flex items-center gap-2">
            {videos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goToIndex(i)}
                className="fc-dot h-1.5 w-1.5 rounded-full bg-border"
                style={
                  i === activeIndex
                    ? { width: 18, background: "var(--color-primary, #835240)" }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}