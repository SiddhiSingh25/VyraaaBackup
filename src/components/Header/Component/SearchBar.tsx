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
//             focused ? "text-primary-dark" : "text-heading/40"
//           }`}
//         />
//         <input
//           type="text"
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholder={placeholder}
//           className="w-full h-full bg-transparent px-3 text-[13px] tracking-wide text-heading
//             placeholder:text-heading/50 focus:outline-none "
//         />
//         {value && (
//           <button
//             type="button"
//             onClick={() => setValue("")}
//             aria-label="Clear search"
//             className="mr-3 text-heading/30 hover:text-heading/60 transition-colors duration-200"
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

  const catalogue = products ?? getAllProducts();

  function openModal() {
    setIsOpen(true);
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
              isActive ? "text-primary-dark" : "text-heading/40"
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
            className="w-full h-full bg-transparent px-3 text-[13px] tracking-wide text-heading
              placeholder:text-heading/50 focus:outline-none cursor-pointer"
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