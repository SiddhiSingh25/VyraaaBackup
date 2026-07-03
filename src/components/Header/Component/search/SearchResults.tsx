"use client";

import { SearchX } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { Product } from "./search";

interface SearchResultsProps {
  products: Product[];
  query: string;
  highlightedIndex: number;
  onSelect: (product: Product) => void;
}

export function SearchResults({ products, query, highlightedIndex, onSelect }: SearchResultsProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
        <SearchX className="h-10 w-10 text-[#D8CDBC]" strokeWidth={1.2} aria-hidden="true" />
        <p className="font-serif text-[19px] text-[#2B2420]">No products found</p>
        <p className="text-[13.5px] text-[#A79A8A]">
          Try searching another keyword for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 pt-6" id="vyraaa-search-listbox" role="listbox" aria-label="Search results">
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#A79A8A]">
        {products.length} {products.length === 1 ? "Result" : "Results"}
      </span>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={product.id} role="option" aria-selected={highlightedIndex === index}>
            <ProductCard
              product={product}
              index={index}
              isHighlighted={highlightedIndex === index}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
