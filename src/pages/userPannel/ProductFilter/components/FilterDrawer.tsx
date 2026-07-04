import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { C } from "../constants";
import FilterList from "./FilterList";
import type { FilterChangeHandler, FilterState } from "../types";

export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filterState: FilterState;
  onChange: FilterChangeHandler;
  onClearAll: () => void;
  resultCount: number;
}

export default function FilterDrawer({
  open,
  onClose,
  filterState,
  onChange,
  onClearAll,
  resultCount,
}: FilterDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: C.bg }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-[13px]"
              style={{ color: C.heading }}
            >
              <ChevronLeft size={18} /> Close
            </button>
            <span
              className="text-[15px]"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: C.heading,
              }}
            >
              Filters
            </span>
            <button
              onClick={onClearAll}
              className="text-[12.5px] underline"
              style={{ color: C.rose }}
            >
              Clear All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterList filterState={filterState} onChange={onChange} />
          </div>
          <div className="p-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={onClose}
              className="w-full h-12 rounded-full text-[14px] font-medium"
              style={{ background: C.primary, color: "#fff" }}
            >
              Show {resultCount.toLocaleString("en-IN")} Results
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
