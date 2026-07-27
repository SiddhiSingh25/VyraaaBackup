import { useViewport } from "./Useismobile";

interface Slide {
  desktopImage: string;
  mobileImage: string;
  tabletImage?: string;
  label: string;
  title1: string;
  title2: string;
  desc: string;
  ctaLabel?: string;
  ctaHref?: string;
}

interface SlideBackgroundProps {
  slide: Slide;
  isActive: boolean;
  /** Eager-load the current + next slide; lazy/defer everything else. */
  priority: boolean;
}

// Using a background-image div (instead of <img>) is what lets us do
// `bg-cover bg-center` without any risk of the image's intrinsic
// aspect ratio fighting the layout — this is exactly how Dior/Chanel/
// LV hero banners are built, and it sidesteps the `object-contain`
// letterboxing the previous implementation had.
export default function SlideBackground({ slide, priority }: SlideBackgroundProps) {
  const viewport = useViewport();
  const image =
    viewport === "mobile"
      ? slide.mobileImage
      : viewport === "tablet" && slide.tabletImage
      ? slide.tabletImage
      : slide.desktopImage;

  return (
    <picture>
  {/* Mobile */}
  <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
  {/* Tablet (optional) */}
  {slide.tabletImage && <source media="(max-width: 1024px)" srcSet={slide.tabletImage} />}
  {/* Desktop */}
  <img
    src={slide.desktopImage}
    alt={`${slide.title1} ${slide.title2}`}
    loading={priority ? "eager" : "lazy"}
    decoding="async"
    className="slide-bg absolute inset-0 w-full h-full object-cover bg-center"
    style={{ willChange: "transform, opacity" }}
  />
</picture>
  );
}