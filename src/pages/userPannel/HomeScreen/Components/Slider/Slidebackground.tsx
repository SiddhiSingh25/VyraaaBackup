import { useIsMobile } from "./Useismobile";
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
  console.log(slide)
  const isMobile = useIsMobile();
  const image = isMobile ? slide.mobileImage : slide.desktopImage;

  return (
    <div
      role="img"
      aria-label={`${slide.title1} ${slide.title2}`}
      // `fetchpriority` is a real DOM attribute (lowercase in React);
      // it tells the browser to prioritize the active slide's image
      // over the rest of the page's resources.
      // @ts-expect-error fetchpriority isn't in older React DOM typings
      fetchpriority={priority ? "high" : "low"}
      className="slide-bg absolute inset-0 bg-cover bg-center bg-no-repeat h-[20h]  mx-auto px-8 xl:px-12 gap-8 xl:gap-12"
      style={{ backgroundImage: `url(${image})`, willChange: "transform, opacity" }}
    />
  );
}