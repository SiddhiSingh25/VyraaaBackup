"use client";

/**
 * Example only — shows how to wire SearchModal into your existing Navbar.
 * Drop the button + <SearchModal /> into Navbar.tsx and swap `getAllProducts()`
 * for your real product source.
 */

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./SearchModal";
import type { Product } from "./search";
import { getAllProducts } from "./mock-products";


export function SearchTriggerExample() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const products = getAllProducts();

  function handleSelectProduct(product: Product) {
    // Navigate to the product page — adjust to your routing.
    window.location.href = `/products/${product.slug}`;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Open search"
        className="flex items-center gap-2 rounded-full border border-[#EDE4D8] px-4 py-2 text-[13px] text-[#8A7F72] transition-colors hover:border-[#B76E79] hover:text-[#B76E79]"
      >
        <Search className="h-4 w-4" strokeWidth={1.5} />
        <span className="hidden sm:inline">Search</span>
      </button>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />
    </>
  );
}
