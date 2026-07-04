import React from "react";
import { ArrowUpDown, SlidersHorizontal } from "lucide-react";
import { C } from "../constants";

export interface MobileBottomBarProps {
  onSort: () => void;
  onFilter: () => void;
  activeCount: number;
}

export default function MobileBottomBar({
  onSort,
  onFilter,
  activeCount,
}: MobileBottomBarProps) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        boxShadow: "0 -4px 20px rgba(61,42,30,0.06)",
      }}
    >
      <button
        onClick={onSort}
        className="flex-1 flex items-center justify-center gap-2 py-4 text-[13px] font-medium"
        style={{ color: C.heading }}
      >
        <ArrowUpDown size={16} /> SORT
      </button>
      <div style={{ width: 1, background: C.border }} />
      <button
        onClick={onFilter}
        className="flex-1 relative flex items-center justify-center gap-2 py-4 text-[13px] font-medium"
        style={{ color: C.heading }}
      >
        <SlidersHorizontal size={16} /> FILTER
        {activeCount > 0 && (
          <span
            className="w-1.5 h-1.5 rounded-full absolute top-3.5 right-[38%]"
            style={{ background: C.rose }}
          />
        )}
      </button>
    </div>
  );
}
