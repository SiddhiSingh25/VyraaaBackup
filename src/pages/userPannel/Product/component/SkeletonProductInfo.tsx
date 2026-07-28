import React from "react";

export default function SkeletonProductInfo() {
  return (
    <section className="bg-[#fdf9f3] py-5">
      <div className="px-5 sm:px-10 lg:px-20 max-w-[1840px] mx-auto">
        <div className="max-w-8xl w-full">
          {/* Breadcrumbs Shimmer */}
          <div className="h-3.5 w-48 rounded animate-pulse bg-card mb-4" />

          <div className="flex flex-col md:flex-row gap-10 mt-4">
            {/* Left Column - Media */}
            <div className="flex flex-col-reverse md:flex-row gap-3 self-start w-full md:w-auto">
              {/* Thumbnails Section */}
              <div className="flex flex-row md:flex-col gap-2 md:gap-2.5 overflow-x-auto md:overflow-x-visible pb-1.5 md:pb-0 scrollbar-none">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-14 h-14 sm:w-[70px] sm:h-[70px] flex-shrink-0 rounded border border-gray-500/10 animate-pulse bg-card"
                  />
                ))}
              </div>

              {/* Main Image Section */}
              <div className="w-full max-w-[350px] aspect-[3/4] md:w-[280px] md:h-[320px] lg:w-[380px] lg:h-[420px] mx-auto md:mx-0 border border-gray-300/30 rounded-xl overflow-hidden animate-pulse bg-card flex-shrink-0" />
            </div>

            {/* Right Column - Product info */}
            <div className="w-full md:w-1/2 lg:w-2/3 2xl:w-3/5">
              {/* Brand */}
              <div className="h-3 w-16 mb-2.5 rounded animate-pulse bg-card" />

              {/* Title */}
              <div className="h-7 w-3/4 mb-3 rounded animate-pulse bg-card" />

              {/* Rating */}
              <div className="h-4.5 w-1/4 mb-4 rounded animate-pulse bg-card" />

              {/* Price */}
              <div className="h-8.5 w-1/3 mb-4 rounded animate-pulse bg-card" />

              {/* Sku / Taxes */}
              <div className="h-3.5 w-1/2 mb-5 rounded animate-pulse bg-card" />

              {/* Size Section */}
              <div className="mt-4">
                <div className="h-3 w-20 mb-2 rounded animate-pulse bg-card" />
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full animate-pulse bg-card"
                    />
                  ))}
                </div>
              </div>

              {/* Add to Cart / Buy Now buttons */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-grow h-11 rounded-sm animate-pulse bg-card" />
                <div className="flex-grow h-11 rounded-sm animate-pulse bg-card" />
              </div>

              {/* Details & Specs */}
              <div className="mt-4 py-4 border-y border-[#e6d9cf] space-y-4">
                <div>
                  <div className="h-3.5 w-28 rounded animate-pulse bg-card mb-2" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded animate-pulse bg-card" />
                    <div className="h-3.5 w-full rounded animate-pulse bg-card" />
                    <div className="h-3.5 w-[85%] rounded animate-pulse bg-card" />
                  </div>
                </div>

                <div>
                  <div className="h-3.5 w-24 rounded animate-pulse bg-card mb-2" />
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i}>
                        <div className="h-2.5 w-1/3 rounded animate-pulse bg-card mb-1" />
                        <div className="h-3.5 w-2/3 rounded animate-pulse bg-card" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Code */}
              <div className="mt-4 pt-3 border-t border-[#e6d9cf] flex items-center gap-2">
                <div className="h-3.5 w-24 rounded animate-pulse bg-card" />
                <div className="h-3.5 w-32 rounded animate-pulse bg-card" />
              </div>

              {/* Rating Reviews skeleton */}
              <div className="mt-6 border-t border-[#e6d9cf] pt-4">
                <div className="h-4.5 w-32 rounded animate-pulse bg-card mb-4" />
                <div className="flex flex-col sm:flex-row gap-6 mb-4">
                  <div className="h-20 w-36 rounded animate-pulse bg-card" />
                  <div className="flex-grow space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-2.5 w-4 rounded animate-pulse bg-card" />
                        <div className="h-2.5 flex-grow rounded animate-pulse bg-card" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
