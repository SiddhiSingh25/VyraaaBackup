import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown, Check, X } from "lucide-react";
import { C, SORT_OPTIONS } from "../constants";
import type { ActiveChip } from "../types";

export interface ToolbarProps {
  sort: string;
  setSort: (sort: string) => void;
  activeCount: number;
  onClearAll: () => void;
  onOpenSort: () => void;
  onOpenFilter: () => void;
  count: number;
  activeChips: ActiveChip[];
  onRemoveChip: (chip: ActiveChip) => void;
}

export default function Toolbar({
  sort,
  setSort,
  activeCount,
  onClearAll,
  count,
  activeChips,
  onRemoveChip,
}: ToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

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
      {/* <div className="relative" ref={ref}>
        <button
          onClick={() => setSortOpen((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors"
          style={{
            border: `1px solid ${C.border}`,
            color: C.heading,
            background: sortOpen ? C.surface : "transparent",
          }}
        >
          <ArrowUpDown size={14} />
          Sort: {SORT_OPTIONS.find((s) => s.id === sort)?.label}
          <ChevronDown size={14} />
        </button>
        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg z-50"
              style={{ background: "#fff", border: `1px solid ${C.border}` }}
            >
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSort(o.id);
                    setSortOpen(false);
                  }}
                  className="w-full flex items-center justify-between text-left px-4 py-2.5 text-[13px] transition-colors"
                  style={{
                    color: sort === o.id ? C.primary : C.body,
                    background: sort === o.id ? C.surface : "transparent",
                  }}
                >
                  {o.label}
                  {sort === o.id && <Check size={14} />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}
    </div>
  );
}
