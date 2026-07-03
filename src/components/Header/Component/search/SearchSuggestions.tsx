"use client";

const SUGGESTIONS = [
  "Perfumes",
  "Luxury Collection",
  "Gift Sets",
  "Oud",
  "Fresh",
  "Woody",
  "Floral",
];

interface SearchSuggestionsProps {
  onSelect: (term: string) => void;
}

export function SearchSuggestions({ onSelect }: SearchSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-6 sm:px-8 pt-5">
      {SUGGESTIONS.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onSelect(term)}
          className="rounded-full border border-[#EDE4D8] bg-[#FAF7F2] px-4 py-1.5 text-[13px] tracking-wide text-[#5C5348] transition-colors duration-200 hover:border-[#B76E79] hover:bg-[#FBF1EC] hover:text-[#B76E79]"
        >
          {term}
        </button>
      ))}
    </div>
  );
}
