import React from "react";
import { C, CATEGORY_CHIPS } from "../constants";

export interface CategoryChipsProps {
  active: string | null;
  onSelect: (value: string | null) => void;
}

export default function CategoryChips({ active, onSelect }: CategoryChipsProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8">
      <div
        className="flex gap-2 overflow-x-auto py-3 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORY_CHIPS.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => onSelect(isActive ? null : c)}
              className="shrink-0 px-4 py-[7px] rounded-full text-[12.5px] font-medium transition-all duration-200"
              style={{
                background: isActive ? C.primary : C.surface,
                color: isActive ? "#fff" : C.body,
                border: `1px solid ${isActive ? C.primary : C.border}`,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
