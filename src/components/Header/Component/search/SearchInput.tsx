"use client";

import { forwardRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClose, onKeyDown }, ref) => {
    return (
      <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-[#EDE4D8]">
        <Search className="h-5 w-5 shrink-0 text-[#B76E79]" strokeWidth={1.5} aria-hidden="true" />
        <input
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls="vyraaa-search-listbox"
          autoComplete="off"
          placeholder="Search perfumes, collections, brands..."
          className="flex-1 bg-transparent font-serif text-[20px] sm:text-[22px] text-[#2B2420] placeholder:text-[#B8AC9B] outline-none"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="shrink-0 rounded-full p-2 text-[#8A7F72] transition-colors hover:bg-[#F5F0E8] hover:text-[#2B2420]"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
