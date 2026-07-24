import React, { useEffect, useRef, useState } from "react";

/* ---------------------------- Shared icons (match ProductInfo palette) ---------------------------- */

const StarRow = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array(5)
      .fill("")
      .map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
            fill={rating >= i + 1 ? "#835240" : "#e6d9cf"}
          />
        </svg>
      ))}
  </div>
);



/* ---------------------------- Small building blocks ---------------------------- */

const FadeIn = ({
  children,
  trigger,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  trigger: boolean;
  delay?: number;
  className?: string;
}) => (
  <div
    style={{ transitionDelay: `${delay}ms` }}
    className={`transition-all duration-700 ease-out ${trigger ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
  >
    {children}
  </div>
);



const ReviewCard = ({
  review,
  onImageClick,
}: {
  review: any;
  onImageClick: (images: string[], index: number) => void;
}) => (
  <div className="border border-[#e6d9cf] rounded-xl p-5 bg-[#fdf9f3]">
    <div className="flex items-center justify-between flex-wrap gap-1.5">
      <div className="flex items-center gap-2">
        <StarRow rating={review.rating} size={12} />
        {review.verified && (
          <span className="text-[10px] tracking-wide uppercase text-[#835240] bg-[#f2e8dd] px-2 py-0.5 rounded-full">
            Verified Purchase
          </span>
        )}
      </div>
      <span className="text-[11px] text-[#a89a90]">{review.date}</span>
    </div>

    <h4 className="mt-2.5 text-[14.5px] font-medium text-[#3b302a]">{review.title}</h4>
    <p className="mt-1 text-[13px] leading-[1.7] text-[#51443f]">{review.review}</p>

    {review.images && review.images.length > 0 && (
      <div className="mt-3 flex gap-2">
        {review.images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onImageClick(review.images!, i)}
            className="w-14 h-14 rounded-lg overflow-hidden border border-[#e6d9cf] cursor-pointer group shrink-0"
          >
            <img
              src={img}
              alt={`review-${review.id}-${i}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        ))}
      </div>
    )}

    <div className="mt-3 flex items-center justify-between">
      <span className="text-[12.5px] text-[#84746e]">— {review.name}</span>
      {/* <button
        type="button"
        className="flex items-center gap-1.5 text-[12px] text-[#84746e] hover:text-[#835240] transition-colors duration-200"
      >
        <HelpfulIcon />
        Helpful ({review.helpful})
      </button> */}
    </div>
  </div>
);

const Lightbox = ({
  images,
  index,
  onClose,
  onNav,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNav: (dir: number) => void;
}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 bg-[#1c1512]/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${mounted ? "opacity-100" : "opacity-0"
        }`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 text-[#fdf9f3] text-2xl leading-none hover:text-[#e6d9cf] transition-colors duration-200"
      >
        ×
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="Previous image"
            className="absolute left-4 md:left-10 text-[#fdf9f3] text-3xl hover:text-[#e6d9cf] transition-colors duration-200"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next image"
            className="absolute right-4 md:right-10 text-[#fdf9f3] text-3xl hover:text-[#e6d9cf] transition-colors duration-200"
          >
            ›
          </button>
        </>
      )}
      <img
        onClick={(e) => e.stopPropagation()}
        src={images[index]}
        alt="review-full"
        className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
      />
    </div>
  );
};

/* ---------------------------------- Types ---------------------------------- */

// Accept flexible review shape coming from API
type ApiReview = any;
interface RatingsAndReviewsProps {
  rating: number;
  totalRatings: number;
  totalReviews: number;
  ratingDistribution: Record<number, number> | any;
  reviews: ApiReview[];
}

/* ---------------------------------- Main ---------------------------------- */

const RatingsAndReviews = ({
  rating,
  totalRatings,
  totalReviews,
  ratingDistribution,
  reviews,
}: RatingsAndReviewsProps) => {
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const handleImageClick = (images: string[], index: number) => setLightbox({ images, index });
  const handleNav = (dir: number) => {
    if (!lightbox) return;
    const next = (lightbox.index + dir + lightbox.images.length) % lightbox.images.length;
    setLightbox({ ...lightbox, index: next });
  };

  return (
    <>

      {rating === 0 ? (
        <div
          ref={sectionRef}
          className="mt-8 rounded-2xl border border-[#e6d9cf] bg-white shadow-[0_4px_24px_rgba(59,48,42,0.06)] p-5"
        >
          <h3
            className="text-[19px] text-[#3b302a] font-medium"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No rating available
          </h3>
        </div>
      ) : (
        <div
          ref={sectionRef}
          className="mt-8 rounded-2xl border border-[#e6d9cf] bg-white shadow-[0_4px_24px_rgba(59,48,42,0.06)] p-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3
              className="text-[19px] text-[#3b302a] font-medium"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ratings &amp; Reviews
            </h3>

            {rating !== 0 && (
              <div className="flex items-center gap-2">
                <StarRow rating={rating} size={13} />
                <span className="text-[13px] text-[#3b302a] font-medium">{rating} / 5</span>
                {totalRatings > 0 && (
                  <span className="text-[12px] text-[#84746e]">· Based on {totalRatings} Ratings</span>
                )}
              </div>
            )}
          </div>



          <div className="my-2 mb-4 h-px bg-[#e6d9cf]" />

          {/* Customer Reviews: render all individual reviews from API */}
          <div className="grid grid-cols-1 gap-4">
            {(isExpanded ? (reviews || []) : (reviews || []).slice(0, 3)).map((review, i) => (
              <FadeIn key={review._id || review.id || i} trigger={visible} delay={i * 80}>
                <ReviewCard
                  review={{
                    id: review._id || review.id || i,
                    name: review.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() : review.name || "Customer",
                    rating: review.rating,
                    verified: review.verified || false,
                    date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : review.date || "",
                    title: review.title || "",
                    review: review.message || review.review || "",
                    helpful: review.helpful || 0,
                    images: review.images || [],
                  }}
                  onImageClick={handleImageClick}
                />
              </FadeIn>
            ))}
          </div>

          {/* Show More / Show Less Toggle */}
          {reviews && reviews.length > 3 && (
            <div className="mt-5 flex justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-1.5 text-[12.5px] tracking-[0.06em] uppercase text-[#835240] font-medium cursor-pointer"
              >
                <span className="border-b border-transparent group-hover:border-[#835240] transition-colors duration-200">
                  {isExpanded ? "Show Less" : "Show More"}
                </span>
                <span className={`transition-transform duration-200 ${isExpanded ? "-rotate-90" : "rotate-90"} inline-block`}>
                  →
                </span>
              </button>
            </div>
          )}



          {lightbox && (
            <Lightbox
              images={lightbox.images}
              index={lightbox.index}
              onClose={() => setLightbox(null)}
              onNav={handleNav}
            />
          )}
        </div>
      )}

    </>
  );
};

export default RatingsAndReviews;