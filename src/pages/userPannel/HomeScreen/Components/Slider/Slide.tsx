import { useEffect, useRef } from "react";
import gsap from "gsap";
import SlideBackground from "./Slidebackground";
import SlideOverlay from "./Slideoverlay";
import SlideContent from "./Slidecontent";
import ShineLayer from "./Shinelayer";


export interface Slide {
  desktopImage: string;
  mobileImage: string;
  label: string;
  title1: string;
  title2: string;
  desc: string;
  ctaLabel?: string;
  ctaHref?: string;
}

// interface SlideProps {
//   slide: SlideType
//   isActive: boolean;
//   priority: boolean;
// }

// Owning the GSAP timeline per-slide (rather than one global timeline
// in HeroSlider) keeps each slide's animation self-contained and means
// adding/removing slides never requires touching animation wiring
// elsewhere — this is the "modular, no duplicated code" requirement.
export default function Slide({ slide, isActive, priority }: any) {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRootRef = useRef<HTMLDivElement>(null);

  // Background fade + scale (the "ken burns settle" luxury sliders use:
  // inactive slides sit slightly zoomed-in at scale 1.04, then ease
  // down to 1 as they become active).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    gsap.to(el, {
      opacity: isActive ? 1 : 0,
      scale: isActive ? 1 : 1.00,
      visibility: isActive ? "visible" : "hidden",
      duration: 1,
      ease: "power2.inOut",
      immediateRender: true,
    });
  }, [isActive]);

  // Text stagger: label → heading → description → CTA, each fading in
  // and moving up slightly. Runs only when this slide becomes active.
  useEffect(() => {
    if (!isActive) return;
    const targets = [labelRef.current, headingRef.current, descRef.current, ctaRef.current].filter(
      Boolean,
    );
    if (targets.length === 0) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      targets,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
    );

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <div
      ref={rootRef}
      // Base/initial styles here are what's visible before GSAP's
      // first tick (and for users with JS disabled or reduced-motion
      // tooling) — they intentionally mirror the active/inactive
      // GSAP end-states so there's no flash of unstyled content.
      style={{
        opacity: isActive ? 1 : 0,
        visibility: isActive ? "visible" : "hidden",
        transform: isActive ? "scale(1)" : "scale(1.0)",
      }}
      className="absolute inset-0"
      aria-hidden={!isActive}
    >
      <SlideBackground slide={slide} isActive={isActive} priority={priority} />
      {/* <SlideOverlay /> */}
      {isActive && <ShineLayer />}
      {/* <SlideContent
        ref={contentRootRef}
        slide={slide}
        labelRef={labelRef}
        headingRef={headingRef}
        descRef={descRef}
        ctaRef={ctaRef}
      /> */}
    </div>
  );
}