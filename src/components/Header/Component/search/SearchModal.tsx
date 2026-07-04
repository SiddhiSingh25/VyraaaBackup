

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";


import { SearchInput } from "./SearchInput";
import { SearchSuggestions } from "./SearchSuggestions";
import { RecentSearches } from "./RecentSearches";
import { RecentlyViewed } from "./RecentlyViewed";
import { SearchResults } from "./SearchResults";
import type { Product, RecentSearch } from "./search";
import { useLocalStorage } from "./useLocalStorage";

const RECENT_SEARCHES_KEY = "vyraaa:recent-searches";
const RECENTLY_VIEWED_KEY = "vyraaa:recently-viewed";
const MAX_RECENT_SEARCHES = 5;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

function filterProducts(products: Product[], query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];

  return products.filter((product) => {
    const haystack = [product.name, product.category, ...product.tags]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}

export function SearchModal({ isOpen, onClose, products, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const { value: recentSearches, setValue: setRecentSearches } = useLocalStorage<RecentSearch[]>(
    RECENT_SEARCHES_KEY,
    []
  );
  const { value: recentlyViewed, setValue: setRecentlyViewed } = useLocalStorage<Product[]>(
    RECENTLY_VIEWED_KEY,
    []
  );

  const filteredProducts = useMemo(() => filterProducts(products, query), [products, query]);
  const isTyping = query.trim().length > 0;
  const activeListLength = isTyping ? filteredProducts.length : recentSearches.length;

  // Reset transient state whenever the modal opens fresh.
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Focus management: capture the trigger, focus the input, restore on close.
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement;
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    previouslyFocused.current?.focus();
  }, [isOpen]);

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const saveRecentSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const withoutDuplicate = prev.filter(
          (item) => item.term.toLowerCase() !== trimmed.toLowerCase()
        );
        const next: RecentSearch[] = [
          { id: `${Date.now()}`, term: trimmed, timestamp: Date.now() },
          ...withoutDuplicate,
        ];
        return next.slice(0, MAX_RECENT_SEARCHES);
      });
    },
    [setRecentSearches]
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      if (isTyping) saveRecentSearch(query);
      setRecentlyViewed((prev) => {
        const withoutDuplicate = prev.filter((item) => item.id !== product.id);
        return [product, ...withoutDuplicate].slice(0, 8);
      });
      onSelectProduct?.(product);
      onClose();
    },
    [isTyping, query, saveRecentSearch, setRecentlyViewed, onSelectProduct, onClose]
  );

  const handleSelectSuggestion = useCallback((term: string) => {
    setQuery(term);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleSelectRecentSearch = useCallback((term: string) => {
    setQuery(term);
    setSelectedIndex(-1);
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (activeListLength === 0) return;
        setSelectedIndex((prev) => (prev + 1) % activeListLength);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (activeListLength === 0) return;
        setSelectedIndex((prev) => (prev <= 0 ? activeListLength - 1 : prev - 1));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndex < 0) {
          if (isTyping) saveRecentSearch(query);
          return;
        }
        if (isTyping) {
          const product = filteredProducts[selectedIndex];
          if (product) handleSelectProduct(product);
        } else {
          const search = recentSearches[selectedIndex];
          if (search) handleSelectRecentSearch(search.term);
        }
      }
    },
    [
      activeListLength,
      onClose,
      selectedIndex,
      isTyping,
      filteredProducts,
      recentSearches,
      query,
      saveRecentSearch,
      handleSelectProduct,
      handleSelectRecentSearch,
    ]
  );

  // Basic focus trap while open.
  useEffect(() => {
    if (!isOpen) return;

    function handleTrap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTrap);
    return () => document.removeEventListener("keydown", handleTrap);
  }, [isOpen]);

  function handleChange(next: string) {
    setQuery(next);
    setSelectedIndex(-1);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-[#241C14]/45 backdrop-blur-[2px] sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search VYRAAA"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "relative flex w-full flex-col overflow-hidden bg-white",
              "h-full sm:h-[70vh] sm:w-[80vw] sm:max-w-[900px]",
              "rounded-none sm:rounded-[20px]",
              "shadow-[0_30px_80px_-20px_rgba(43,32,20,0.35)]",
            ].join(" ")}
          >
            <SearchInput
              ref={inputRef}
              value={query}
              onChange={handleChange}
              onClose={onClose}
              onKeyDown={handleKeyDown}
            />

            {!isTyping && <SearchSuggestions onSelect={handleSelectSuggestion} />}

            <div className="flex-1 overflow-y-auto pb-8">
              {isTyping ? (
                <SearchResults
                  products={filteredProducts}
                  query={query}
                  highlightedIndex={selectedIndex}
                  onSelect={handleSelectProduct}
                />
              ) : (
                <>
                  <RecentSearches
                    searches={recentSearches}
                    highlightedIndex={selectedIndex}
                    onSelect={handleSelectRecentSearch}
                    onClear={handleClearRecentSearches}
                  />
                  <RecentlyViewed products={recentlyViewed} onSelect={handleSelectProduct} />
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}