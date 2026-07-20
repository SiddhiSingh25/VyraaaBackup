// import { useState } from "react";
// import { Search, X } from "lucide-react";

// interface SearchBarProps {
//   variant?: "desktop" | "mobile";
//   placeholder?: string;
//   className?: string;
// }

// export default function SearchBar({
//   variant = "desktop",
//   placeholder = "Search for products, brands and more",
//   className = "",
// }: SearchBarProps) {
//   const [value, setValue] = useState("");
//   const [focused, setFocused] = useState(false);
//   const isMobile = variant === "mobile";

//   return (
//     <div className={`relative w-full ${isMobile ? "h-10" : "h-10"} ${className}`}>
//       <div
//         className={`flex items-center w-full h-full rounded-full border bg-heading/[0.035]
//           transition-all duration-300 ease-out
//           ${
//             focused
//               ? "border-primary/40 bg-background shadow-[0_0_0_4px_rgba(0,0,0,0.03)] ring-2 ring-primary/15"
//               : "border-border/70 hover:border-border"
//           }`}
//       >
//         <Search
//           size={16}
//           strokeWidth={1.8}
//           className={`ml-4 shrink-0 transition-colors duration-300 ${
//             focused ? "text-primary-dark" : "text-admin-text/40"
//           }`}
//         />
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder={placeholder}
//           className="w-full h-full bg-transparent px-3 text-[13px] tracking-wide text-admin-text
//             placeholder:text-admin-text/50 focus:outline-none "
//         />
//         {value && (
//           <button
//             type="button"
//             onClick={() => setValue("")}
//             aria-label="Clear search"
//             className="mr-3 text-admin-text/30 hover:text-admin-text/60 transition-colors duration-200"
//           >
//             <X size={14} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search/SearchModal";
import { getAllProducts } from "./search/mock-products";
import type { Product } from "./search/search";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";


interface SearchBarProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
  className?: string;
  /** Optional override — defaults to the shared catalogue used by SearchModal. */
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export default function SearchBar({
  variant = "desktop",
  placeholder = "Search for products, brands and more",
  className = "",
  products,
  onSelectProduct,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = variant === "mobile";
  const isActive = focused || isOpen;

  let  { getQuery} = useGetQuery()

  const catalogue = products ?? getAllProducts();

  function openModal() {
    setIsOpen(true);
  }

  const handleSearch  = ()=>{
      getQuery({
      url: apiUrls.Search.search,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          const formattedProducts = res.data.map((item: any) => {
            // 1. Safely extract the first available price object
            const basePrice =
              item.price && item.price.length > 0 ? item.price[0] : null;

            // 2. Generate badges dynamically based on API flags
            const badges: string[] = [];
            if (basePrice?.isFewLeft) {
              badges.push("Only Few Left");
            }
            if (!basePrice?.isAvailable) {
              // Example condition for "Premium"
              badges.push("Not Available");
            }

            // 3. Return strictly typed object for ProductCard
            return {
              id: item._id,
              name: item.title,
              img: item.image,
              img2: item.image, // Fallback to same image since API doesn't provide img2
              brand: item.brand?.brand || "Vyraa", // Safe check, fallback if missing
              price: basePrice ? basePrice.amount : 0, // Must be a number for money()
              mrp: basePrice ? basePrice.markupPrice : 0, // Must be a number for pct()
              rating: item.averageRating || item.rating || 4.5,
              reviews: 120, // Fallback: Not in API
              badges: badges,
              size: basePrice ? basePrice.size._id : null,
              sizeName: basePrice ? basePrice.size.size : null,
            };
          });
          
        }
      },
      onFail: (res: any) => {
        console.log(res);
      },
    });
  }

  return (
    <>
      <div className={`relative w-full ${isMobile ? "h-10" : "h-10"} ${className}`}>
        {/*
          This bar is a trigger, not a live input — all typing happens in the
          centered SearchModal (matches the "click to expand" brief). Clicking
          anywhere on the pill, or focusing the input via keyboard, opens it.
        */}
        <div
          onClick={openModal}
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Open search"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openModal();
            }
          }}
          className={`flex items-center w-full h-full rounded-full border bg-heading/[0.035] cursor-pointer
            transition-all duration-300 ease-out
            ${
              isActive
                ? "border-primary/40 bg-background shadow-[0_0_0_4px_rgba(0,0,0,0.03)] ring-2 ring-primary/15"
                : "border-border/70 hover:border-border"
            }`}
        >
          <Search
            size={16}
            strokeWidth={1.8}
            className={`ml-4 shrink-0 transition-colors duration-300 ${
              isActive ? "text-primary-dark" : "text-admin-text/40"
            }`}
          />
          <input
            type="text"
            value=""
            readOnly
            onFocus={() => {
              setFocused(true);
              // openModal();
            }}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full h-full bg-transparent px-3 text-[13px] tracking-wide text-admin-text
              placeholder:text-admin-text/50 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      <SearchModal
        isOpen={isOpen}
        onClose={() => {
    console.log("Closing modal");
    setIsOpen(false);
  }}
        products={catalogue}
        onSelectProduct={onSelectProduct}
      />
    </>
  );
}