import React from "react";

export function SkeletonOrders() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2].map((groupIndex) => (
        <div key={groupIndex} className="rounded-2xl bg-card border border-border p-4">
          {/* Section Heading */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-border flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-24 rounded bg-border" />
              <div className="h-3 w-12 rounded bg-border" />
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2].map((itemIndex) => (
              <div
                key={itemIndex}
                className="rounded-xl border border-border bg-background p-3"
              >
                {/* Date */}
                <div className="h-3 w-36 rounded bg-border mb-3" />

                {/* Product Info */}
                <div className="flex gap-3">
                  <div className="h-20 w-20 rounded-lg bg-border flex-shrink-0" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-border" />
                    <div className="h-3 w-12 rounded bg-border" />
                    <div className="h-4 w-16 rounded bg-border" />
                  </div>
                </div>

                {/* Button Placeholder */}
                <div className="mt-4 flex gap-2">
                  <div className="h-8 w-28 rounded-full bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
