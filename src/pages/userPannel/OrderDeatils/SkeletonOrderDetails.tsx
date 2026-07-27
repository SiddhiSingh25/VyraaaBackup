import React from "react";

export function SkeletonOrderDetails() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse select-none">
      {/* Left Column: Items */}
      <div className="lg:col-span-2 space-y-6 animate-pulse">
        <div className="bg-surface rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <div className="h-5 w-5 rounded-full bg-border flex-shrink-0 animate-pulse" />
            <div className="h-5 w-32 rounded bg-border animate-pulse" />
          </div>

          <div className="space-y-6">
            {[1, 2].map((itemIndex) => (
              <div
                key={itemIndex}
                className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-border last:border-0 last:pb-0 animate-pulse"
              >
                {/* Product Image Placeholder */}
                <div className="w-24 h-24 rounded-xl border border-border bg-border flex-shrink-0 animate-pulse" />

                {/* Product Title and Category Info */}
                <div className="flex-grow space-y-2 animate-pulse">
                  <div className="h-4 w-3/4 rounded bg-border animate-pulse" />
                  <div className="h-3 w-1/4 rounded bg-border animate-pulse" />
                  <div className="flex flex-wrap gap-2 pt-1 animate-pulse">
                    <div className="h-7 w-20 rounded bg-border animate-pulse" />
                    <div className="h-7 w-16 rounded bg-border animate-pulse" />
                  </div>
                </div>

                {/* Pricing & Status */}
                <div className="text-right flex flex-col justify-between items-end gap-2 animate-pulse">
                  <div className="h-5 w-16 rounded bg-border animate-pulse" />
                  <div className="h-5 w-20 rounded bg-border mt-2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Address and Summary */}
      <div className="space-y-6 animate-pulse">
        {/* Shipping Address Skeleton */}
        <div className="bg-surface rounded-2xl p-6 border border-border animate-pulse">
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <div className="h-4.5 w-4.5 rounded-full bg-border flex-shrink-0 animate-pulse" />
            <div className="h-4.5 w-36 rounded bg-border animate-pulse" />
          </div>
          <div className="space-y-2.5 animate-pulse">
            <div className="h-4.5 w-1/3 rounded bg-border animate-pulse" />
            <div className="h-3.5 w-5/6 rounded bg-border animate-pulse" />
            <div className="h-3.5 w-2/3 rounded bg-border animate-pulse" />
            <div className="h-3.5 w-1/2 rounded bg-border animate-pulse" />
            <div className="pt-3 mt-3 border-t border-border/50 h-5 w-40 rounded bg-border animate-pulse" />
          </div>
        </div>

        {/* Payment & Summary Skeleton */}
        <div className="bg-surface rounded-2xl p-6 border border-border animate-pulse">
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <div className="h-4.5 w-4.5 rounded-full bg-border flex-shrink-0 animate-pulse" />
            <div className="h-4.5 w-36 rounded bg-border animate-pulse" />
          </div>

          <div className="space-y-3 animate-pulse">
            <div className="flex justify-between items-center animate-pulse">
              <div className="h-3 w-16 rounded bg-border animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-border animate-pulse" />
            </div>
            <div className="flex justify-between items-center animate-pulse">
              <div className="h-3 w-12 rounded bg-border animate-pulse" />
              <div className="h-5 w-16 rounded bg-border animate-pulse" />
            </div>

            <div className="border-t border-border pt-4 space-y-3 animate-pulse">
              <div className="flex justify-between animate-pulse">
                <div className="h-3 w-28 rounded bg-border animate-pulse" />
                <div className="h-3.5 w-16 rounded bg-border animate-pulse" />
              </div>
              <div className="flex justify-between animate-pulse">
                <div className="h-3 w-16 rounded bg-border animate-pulse" />
                <div className="h-3.5 w-10 rounded bg-border animate-pulse" />
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-border animate-pulse">
                <div className="h-4.5 w-24 rounded bg-border animate-pulse" />
                <div className="h-6 w-24 rounded bg-border animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
