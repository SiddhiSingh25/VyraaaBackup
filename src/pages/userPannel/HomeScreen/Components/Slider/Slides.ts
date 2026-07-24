
// Shared types for the luxury HeroSlider.
// `desktopImage` / `mobileImage` let us serve an art-directed crop per
// breakpoint instead of relying on CSS to crop a single image (which is

import { slider1, slider2, slider3, sliderMobile1, sliderMobile2, sliderMobile3 } from "../../../../../assets/assets";

// what produced awkward composition on mobile in the old version).
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

// NOTE: `mobileImage` currently falls back to the same desktop asset.
// Once you have dedicated mobile crops (portrait-oriented, subject
// recentred), swap the second value in each pair — no other code needs
// to change, the component already switches on breakpoint.
export const SLIDES: Slide[] = [
  {
    desktopImage: slider1,
    mobileImage: sliderMobile1,
    label: "Summer Solstice · 2025",
    title1: "The Poetry",
    title2: "of Modern Craft",
    desc: "Where ancestral techniques meet contemporary silhouettes. Each piece is a testament to the art of patience.",
    ctaLabel: "Discover Collection",
    ctaHref: "#",
  },
  {
    desktopImage: slider2,
    mobileImage: sliderMobile2,
    label: "New Arrivals · 2025",
    title1: "A World",
    title2: "Beyond Trends",
    desc: "Discover timeless pieces crafted for the woman who moves through life with intention and grace.",
    ctaLabel: "Discover Collection",
    ctaHref: "#",
  },
  {
    desktopImage: slider3,
    mobileImage: sliderMobile3,
    label: "Atelier Collection",
    title1: "Crafted by",
    title2: "Human Hands",
    desc: "From our Paris atelier to yours. Every detail, every thread, every form — made with conscious devotion.",
    ctaLabel: "Discover Collection",
    ctaHref: "#",
  },

];

