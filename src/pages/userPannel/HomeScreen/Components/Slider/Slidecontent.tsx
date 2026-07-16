import { forwardRef } from "react";

interface Slide {
  desktopImage: string;
  mobileImage: string;
  label: string;
  title1: string;
  title2: string;
  desc: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface SlideContentProps {
  slide: Slide;
  labelRef: React.Ref<HTMLParagraphElement>;
  headingRef: React.Ref<HTMLHeadingElement>;
  descRef: React.Ref<HTMLParagraphElement>;
  ctaRef: React.Ref<HTMLDivElement>;
}

// Each text element gets its own ref so the parent's GSAP timeline can
// stagger them independently (label → heading → description → CTA),
// matching the "text animates independently" requirement rather than
// fading the whole content block as one unit.
const SlideContent = forwardRef<HTMLDivElement, SlideContentProps>(
  ({ slide, labelRef, headingRef, descRef, ctaRef }, rootRef) => {
    return (
      <div
        ref={rootRef}
        className="relative z-20 h-full flex items-center px-5 sm:px-10 lg:px-20 "
      >
        <div className="max-w-2xl w-full">
          <p
            ref={labelRef}
            className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/60 mb-4 sm:mb-6"
          >
            {slide.label}
          </p>

          <h1
            ref={headingRef}
            className="font-heading text-white leading-none mb-6 sm:mb-8 text-[clamp(38px,7vw,96px)] font-light -tracking-[0.02em]"
          >
            <span className="block">{slide.title1}</span>
            <span className="block italic">{slide.title2}</span>
          </h1>

          <p
            ref={descRef}
            className="text-white/75 font-light text-sm sm:text-base lg:text-[17px] leading-relaxed mb-8 sm:mb-10 max-w-md"
          >
            {slide.desc}
          </p>

          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            {slide.ctaLabel && (
              <a
                href={slide.ctaHref ?? "#"}
                className="inline-block bg-white text-admin-text px-6 sm:px-8 py-3 sm:py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-card transition-colors duration-400"
              >
                {slide.ctaLabel}
              </a>
            )}
            <a
              href="#"
              className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/80 hover:text-white flex items-center gap-2 transition-colors border-b border-white/30 pb-0.5"
            >
              Watch Story
            </a>
          </div>
        </div>
      </div>
    );
  },
);

SlideContent.displayName = "SlideContent";
export default SlideContent;
