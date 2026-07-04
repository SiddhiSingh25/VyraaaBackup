"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "./search";

interface RecentlyViewedProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export function RecentlyViewed({ products, onSelect }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <div className="px-6 sm:px-8 pt-7">
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-[#A79A8A]">
        Recently Viewed
      </span>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
