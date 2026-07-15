"use client";

import { memo } from "react";
import { motion } from "motion/react";
 import type { Product } from "./search";

interface ProductCardProps {
  product: Product;
  index: number;
  isHighlighted?: boolean;
  onSelect: (product: Product) => void;
}

function formatPrice(value: number) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function ProductCardBase({ product, index, isHighlighted = false, onSelect }: ProductCardProps) {
  const discountPercent = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(product)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className={[
        "group relative flex flex-col text-left rounded-2xl border bg-white overflow-hidden",
        "transition-shadow duration-300 ease-out cursor-pointer",
        "hover:shadow-[0_18px_40px_-12px_rgba(45,32,20,0.18)]",
        isHighlighted
          ? "border-[#B76E79] shadow-[0_18px_40px_-12px_rgba(45,32,20,0.18)]"
          : "border-[#EDE4D8]",
      ].join(" ")}
      aria-label={`${product.name}, ${formatPrice(product.currentPrice)}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F0E8]">
        <img
          src={product.image}
          alt={product.name}
          
          loading="lazy"
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
        />
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#B76E79]">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 px-4 py-3.5">
        <h3 className="font-serif text-[15px] leading-snug text-[#2B2420] line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-[14px] font-medium text-[#2B2420]">
            {formatPrice(product.currentPrice)}
          </span>
          {product.originalPrice > product.currentPrice && (
            <span className="text-[12px] text-[#A79A8A] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export const ProductCard = memo(ProductCardBase);


// "use client";

// import { memo, useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import type { Product } from "./search";


// interface ProductCardProps {
//   product: Product;
//   index: number;
//   isHighlighted?: boolean;
//   onSelect: (product: Product) => void;
// }

// function formatPrice(value: number) {
//   return `Rs. ${value.toLocaleString("en-IN")}`;
// }

// function ProductCardBase({ product, index, isHighlighted = false, onSelect }: ProductCardProps) {
//   const buttonRef = useRef<HTMLButtonElement>(null);

//   const discountPercent = Math.round(
//     ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
//   );

//   // Entrance animation (replaces initial/animate/transition)
//   useEffect(() => {
//     const el = buttonRef.current;
//     if (!el) return;

//     const ctx = gsap.context(() => {
//       gsap.fromTo(
//         el,
//         { opacity: 0, y: 12 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 0.3,
//           delay: index * 0.04,
//           ease: "cubic-bezier(0.22, 1, 0.36, 1)",
//         }
//       );
//     }, el);

//     return () => ctx.revert();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Hover animation (replaces whileHover)
//   const handleMouseEnter = () => {
//     if (!buttonRef.current) return;
//     gsap.to(buttonRef.current, {
//       y: -5,
//       duration: 0.25,
//       ease: "power2.out",
//     });
//   };

//   const handleMouseLeave = () => {
//     if (!buttonRef.current) return;
//     gsap.to(buttonRef.current, {
//       y: 0,
//       duration: 0.25,
//       ease: "power2.out",
//     });
//   };

//   return (
//     <button
//       ref={buttonRef}
//       type="button"
//       onClick={() => onSelect(product)}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className={[
//         "group relative flex flex-col text-left rounded-2xl border bg-white overflow-hidden",
//         "transition-shadow duration-300 ease-out cursor-pointer",
//         "hover:shadow-[0_18px_40px_-12px_rgba(45,32,20,0.18)]",
//         isHighlighted
//           ? "border-[#B76E79] shadow-[0_18px_40px_-12px_rgba(45,32,20,0.18)]"
//           : "border-[#EDE4D8]",
//       ].join(" ")}
//       aria-label={`${product.name}, ${formatPrice(product.currentPrice)}`}
//       style={{ opacity: 0 }}
//     >
//       <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F0E8]">
//         <img
//           src={product.image}
//           alt={product.name}
          
//           loading="lazy"
//           sizes="(max-width: 768px) 50vw, 25vw"
//           className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
//         />
//         {discountPercent > 0 && (
//           <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#B76E79]">
//             {discountPercent}% OFF
//           </span>
//         )}
//       </div>

//       <div className="flex flex-col gap-1 px-4 py-3.5">
//         <h3 className="font-serif text-[15px] leading-snug text-[#2B2420] line-clamp-1">
//           {product.name}
//         </h3>
//         <div className="flex items-center gap-2 pt-0.5">
//           <span className="text-[14px] font-medium text-[#2B2420]">
//             {formatPrice(product.currentPrice)}
//           </span>
//           {product.originalPrice > product.currentPrice && (
//             <span className="text-[12px] text-[#A79A8A] line-through">
//               {formatPrice(product.originalPrice)}
//             </span>
//           )}
//         </div>
//       </div>
//     </button>
//   );
// }

// export const ProductCard = memo(ProductCardBase);