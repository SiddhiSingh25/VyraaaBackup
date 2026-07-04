import React from "react";
import { C } from "../constants";

export interface IconBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
  badge?: number | string;
}

export default function IconBtn({
  children,
  onClick,
  label,
  badge,
}: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative w-11 h-11 flex items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ color: C.heading, outlineColor: C.primary }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
      {badge ? (
        <span
          className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center"
          style={{ background: C.rose, color: "#fff" }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}
