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

const TruckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2 7h13v9H2z" stroke="#835240" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M15 10h4l3 3v3h-7v-6z" stroke="#835240" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="6.5" cy="18" r="1.8" stroke="#835240" strokeWidth="1.5" />
    <circle cx="17.5" cy="18" r="1.8" stroke="#835240" strokeWidth="1.5" />
  </svg>
);

const ReturnIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M4 4v6h6" stroke="#835240" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 14a8 8 0 1 0 2-8.5L4 10" stroke="#835240" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="12" rx="2" stroke="#835240" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="3" stroke="#835240" strokeWidth="1.5" />
    <path d="M2 9h2M20 9h2M2 15h2M20 15h2" stroke="#835240" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HelpfulIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M7 10v11M2 10h4v11H2zM7 10l3-8a2 2 0 0 1 2 2v5h6.5a2 2 0 0 1 2 2.5l-1.8 7A2 2 0 0 1 17.7 21H7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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
    className={`transition-all duration-700 ease-out ${
      trigger ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    } ${className}`}
  >
    {children}
  </div>
);

const RatingBar = ({
  star,
  count,
  total,
  active,
  delay,
}: {
  star: number;
  count: number;
  total: number;
  active: boolean;
  delay: number;
}) => {
  const [width, setWidth] = useState(0);
  const percent = total > 0 ? (count / total) * 100 : 0;

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setWidth(percent), delay);
    return () => clearTimeout(t);
  }, [active, percent, delay]);

  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="w-7 shrink-0 text-[#3b302a]">{star} ★</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#f2e8dd] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#835240] transition-all duration-[1100ms] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-8 text-right text-[#84746e]">{count}</span>
    </div>
  );
};

const FeatureCard = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center text-center gap-1.5 py-4 px-2 rounded-xl border border-[#e6d9cf] bg-[#fdf9f3] hover:border-[#835240] transition-colors duration-200">
    {icon}
    <span className="text-[11px] text-[#51443f]">{label}</span>
  </div>
);

const ReviewCard = ({
  review,
  onImageClick,
}: {
  review: Review;
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
      <button
        type="button"
        className="flex items-center gap-1.5 text-[12px] text-[#84746e] hover:text-[#835240] transition-colors duration-200"
      >
        <HelpfulIcon />
        Helpful ({review.helpful})
      </button>
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
      className={`fixed inset-0 z-50 bg-[#1c1512]/80 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
        mounted ? "opacity-100" : "opacity-0"
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

export interface Review {
  id: number;
  name: string;
  rating: number;
  verified: boolean;
  date: string;
  title: string;
  review: string;
  helpful: number;
  images?: string[];
}

interface RatingsAndReviewsProps {
  rating: number;
  totalRatings: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
  reviews: Review[];
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
    <div
      ref={sectionRef}
      className="mt-8 rounded-2xl border border-[#e6d9cf] bg-white shadow-[0_4px_24px_rgba(59,48,42,0.06)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3
          className="text-[19px] text-[#3b302a] font-medium"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Ratings &amp; Reviews
        </h3>
        <div className="flex items-center gap-2">
          <StarRow rating={rating} size={13} />
          <span className="text-[13px] text-[#3b302a] font-medium">{rating} / 5</span>
          <span className="text-[12px] text-[#84746e]">· Based on {totalRatings} Ratings</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
        <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-[44px] leading-none font-semibold text-[#3b302a]">{rating}</span>
            <svg width="22" height="22" viewBox="0 0 18 17" fill="#835240" className="ml-0.5">
              <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" />
            </svg>
          </div>
          <div className="text-[12.5px] text-[#84746e] md:mt-1">
            <p>{totalRatings} Ratings</p>
            <p>{totalReviews} Reviews</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-md">
          {[5, 4, 3, 2, 1].map((star, i) => (
            <RatingBar
              key={star}
              star={star}
              count={ratingDistribution[star] || 0}
              total={totalRatings}
              active={visible}
              delay={i * 120}
            />
          ))}
        </div>
      </div>

      <div className="my-6 h-px bg-[#e6d9cf]" />

      {/* Customer Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.slice(0, 2).map((review, i) => (
          <FadeIn key={review.id} trigger={visible} delay={i * 150}>
            <ReviewCard review={review} onImageClick={handleImageClick} />
          </FadeIn>
        ))}
      </div>

      {/* View all */}
      <div className="mt-5 flex justify-center md:justify-start">
        <button
          type="button"
          className="group flex items-center gap-1.5 text-[12.5px] tracking-[0.06em] uppercase text-[#835240] font-medium"
        >
          <span className="border-b border-transparent group-hover:border-[#835240] transition-colors duration-200">
            View All Reviews
          </span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* Feature icons */}
      <div className="mt-6 pt-6 border-t border-[#e6d9cf] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FeatureCard icon={<TruckIcon />} label="Free Shipping" />
        <FeatureCard icon={<CashIcon />} label="Cash on Delivery" />
        <FeatureCard icon={<ReturnIcon />} label="Easy Returns" />
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNav={handleNav}
        />
      )}
    </div>
  );
};

export default RatingsAndReviews;