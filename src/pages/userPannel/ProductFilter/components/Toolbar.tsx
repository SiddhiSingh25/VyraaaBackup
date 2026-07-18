import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown, Check, X } from "lucide-react";
import { C } from "../constants";
import type { ActiveChip } from "../types";

export interface ToolbarProps {
  activeCount: number;
  onClearAll: () => void;
  onOpenFilter: () => void;
  count: number;
  activeChips: ActiveChip[];
  onRemoveChip: (chip: ActiveChip) => void;
}

export default function Toolbar({
  activeCount,
  onClearAll,
  onOpenFilter,
  count,
  activeChips,
  onRemoveChip,
}: ToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className=" px-8 pt-3 md:flex items-center justify-between gap-4 hidden">
      <div className="flex items-center gap-3 flex-wrap min-h-[32px]">
        <span className="text-[12.5px]" style={{ color: C.muted }}>
          {count.toLocaleString("en-IN")} results
        </span>
        {activeChips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => onRemoveChip(chip)}
            className="flex items-center gap-1.5 pl-3 pr-2 py-[5px] rounded-full text-[12px]"
            style={{
              background: C.card,
              color: C.heading,
              border: `1px solid ${C.border}`,
            }}
          >
            {chip.label}
            <X size={12} />
          </button>
        ))}
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-[12px] underline underline-offset-2"
            style={{ color: C.rose }}
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
