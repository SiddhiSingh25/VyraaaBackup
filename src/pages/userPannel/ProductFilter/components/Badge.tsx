import React from "react";
import { C } from "../constants";
import type { BadgeTone } from "../types";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
}

export default function Badge({ children, tone = "dark" }: BadgeProps) {
  const tones: Record<BadgeTone, { bg: string; fg: string }> = {
    dark: { bg: C.dark, fg: "#fff" },
    rose: { bg: C.rose, fg: "#fff" },
    warn: { bg: C.warning, fg: "#3B302A" },
    outline: { bg: "transparent", fg: C.heading },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[10px] tracking-wide uppercase font-medium rounded-full"
      style={{
        background: t.bg,
        color: t.fg,
        border: tone === "outline" ? `1px solid ${C.border}` : "none",
      }}
    >
      {children}
    </span>
  );
}
