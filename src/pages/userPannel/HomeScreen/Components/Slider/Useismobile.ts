import { useEffect, useState } from "react";

// 768px matches Tailwind's `md` breakpoint, so this stays in lockstep
// with whatever responsive classes the slider uses elsewhere.
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Tracks whether the viewport currently matches the mobile breakpoint.
 * Used to pick `desktopImage` vs `mobileImage` without re-rendering on
 * every resize pixel (matchMedia only fires on actual breakpoint cross).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}