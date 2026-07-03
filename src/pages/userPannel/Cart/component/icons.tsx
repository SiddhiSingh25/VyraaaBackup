import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconShield = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const IconTag = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 12l8.5-8.5a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6.1a2 2 0 0 1-.6 1.4L12 21l-9-9z" />
    <circle cx="14.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconClose = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconBookmark = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
  </svg>
);

export const IconChevronLeft = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconChevronDown = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const IconClock = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconBag = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 8h12l1 12.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20.5L6 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconHeart = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 20.5s-7.5-4.6-9.7-9.2C.9 8 2.2 4.8 5.4 4c2.1-.5 4 .4 5.6 2.4C12.6 4.4 14.5 3.5 16.6 4c3.2.8 4.5 4 3.1 7.3-2.2 4.6-9.7 9.2-9.7 9.2z" />
  </svg>
);

export const IconUser = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
  </svg>
);

export const IconSearch = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </svg>
);

export const IconMenu = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

// Faceted "gem" diamond used as the brand's signature marker
export const IconGem = (props: IconProps) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 9l3.5-5h9L20 9l-8 11-8-11z" />
    <path d="M4 9h16M9 4l1.2 5L12 20l1.8-11L15 4" />
  </svg>
);
