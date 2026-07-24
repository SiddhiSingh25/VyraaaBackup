import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";
const TABLET_QUERY = "(min-width: 768px) and (max-width: 1023px)";

export type ViewportType = "mobile" | "tablet" | "desktop";

/**
 * Hook to track whether the viewport is "mobile", "tablet", or "desktop".
 */
export function useViewport(): ViewportType {
  const [viewport, setViewport] = useState<ViewportType>(() => {
    if (typeof window === "undefined") return "desktop";
    if (window.matchMedia(MOBILE_QUERY).matches) return "mobile";
    if (window.matchMedia(TABLET_QUERY).matches) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const mobileMql = window.matchMedia(MOBILE_QUERY);
    const tabletMql = window.matchMedia(TABLET_QUERY);

    const onChange = () => {
      if (mobileMql.matches) {
        setViewport("mobile");
      } else if (tabletMql.matches) {
        setViewport("tablet");
      } else {
        setViewport("desktop");
      }
    };

    // Listeners for changes in breakpoints
    mobileMql.addEventListener("change", onChange);
    tabletMql.addEventListener("change", onChange);

    return () => {
      mobileMql.removeEventListener("change", onChange);
      tabletMql.removeEventListener("change", onChange);
    };
  }, []);

  return viewport;
}

/**
 * Tracks whether the viewport currently matches the mobile breakpoint.
 * Re-implemented using useViewport to keep lockstep.
 */
export function useIsMobile(): boolean {
  const viewport = useViewport();
  return viewport === "mobile";
}