"use client";

import { Clock, ArrowUpRight } from "lucide-react";
import type { RecentSearch } from "./search";

interface RecentSearchesProps {
  searches: RecentSearch[];
  highlightedIndex: number;
  onSelect: (term: string) => void;
  onClear: () => void;
}

export function RecentSearches({ searches, highlightedIndex, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="px-6 sm:px-8 pt-6">
      <div className="flex items-center justify-between pb-3">
        <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#A79A8A]">
          Recent Searches
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-[12px] text-[#B76E79] transition-colors hover:text-[#8f4c56]"
        >
          Clear
        </button>
      </div>
      <ul role="listbox" aria-label="Recent searches">
        {searches.map((search, index) => (
          <li key={search.id} role="option" aria-selected={highlightedIndex === index}>
            <button
              type="button"
              onClick={() => onSelect(search.term)}
              className={[
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150",
                highlightedIndex === index ? "bg-[#FBF1EC]" : "hover:bg-[#FAF7F2]",
              ].join(" ")}
            >
              <Clock className="h-4 w-4 shrink-0 text-[#B8AC9B]" strokeWidth={1.5} />
              <span className="flex-1 text-[14.5px] text-[#3A3128]">{search.term}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[#B8AC9B]" strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
