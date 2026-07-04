import React from "react";
import { Sparkles } from "lucide-react";
import { C } from "../constants";

export interface EmptyStateProps {
  onClear: () => void;
}

export default function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: C.card }}
      >
        <Sparkles size={24} color={C.primary} strokeWidth={1.5} />
      </div>
      <h3
        className="text-[18px] mb-1.5"
        style={{ fontFamily: "'Playfair Display', serif", color: C.heading }}
      >
        No pieces match just yet
      </h3>
      <p className="text-[13px] mb-6 max-w-xs" style={{ color: C.muted }}>
        Try adjusting or clearing your filters to see more of the collection.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="px-5 py-2.5 rounded-full text-[13px] font-medium"
          style={{ background: C.primary, color: "#fff" }}
        >
          Clear Filters
        </button>
        <button
          className="px-5 py-2.5 rounded-full text-[13px] font-medium"
          style={{ border: `1px solid ${C.border}`, color: C.heading }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
