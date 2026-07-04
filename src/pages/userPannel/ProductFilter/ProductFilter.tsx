import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Star,
  Eye,
  Plus,
  ChevronLeft, ChevronRight,
  Check,
  Sparkles,
} from "lucide-react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import SuggestedProduct from "../Product/component/SuggestedProduct";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* ============================================================================
   VYRAAA — Product Listing Page
   Production-ready, API-ready, fully data-driven filter architecture.
============================================================================ */

/* ---------------------------------- Tokens --------------------------------- */
const C = {
  primary: "#835240",
  primaryLight: "#C98F7A",
  primaryDark: "#51291A",
  dark: "#3D2A1E",
  rose: "#B76E79",
  bg: "#FDF9F3",
  surface: "#F8F4EE",
  card: "#F2E8DD",
  heading: "#3B302A",
  body: "#51443F",
  muted: "#84746E",
  border: "#E6D9CF",
  success: "#4CAF50",
  warning: "#F59E0B",
  error: "#BA1A1A",
};

/* ------------------------------ Filter Schema ------------------------------
   interface FilterSection {
     id: string; title: string;
     type: "checkbox" | "radio" | "color" | "size" | "range" | "toggle";
     options?: { id: string; label: string; value: string; count?: number; swatch?: string }[];
     min?: number; max?: number; step?: number; unit?: string;
     quickValues?: number[];
     searchable?: boolean;
   }
   This shape is the ONLY contract the UI depends on — swap in real API data
   with zero component changes.
----------------------------------------------------------------------------*/

const FILTERS = [
  {
    id: "category",
    title: "Category",
    type: "radio",
    options: [
      { id: "kurtis", label: "Kurtis", value: "kurtis", count: 398 },
      { id: "kurtas", label: "Kurtas", value: "kurtas", count: 371 },
      { id: "dresses", label: "Dresses", value: "dresses", count: 129 },
      { id: "sets", label: "Co-ord Sets", value: "sets", count: 84 },
      { id: "sarees", label: "Sarees", value: "sarees", count: 212 },
    ],
  },
  {
    id: "brand",
    title: "Brand",
    type: "checkbox",
    searchable: true,
    options: [
      {
        id: "vyraaa-house",
        label: "Vyraaa House",
        value: "vyraaa-house",
        count: 156,
      },
      { id: "anouk-r", label: "Anouk Rustic", value: "anouk-r", count: 24 },
      { id: "roshni", label: "Roshni", value: "roshni", count: 76 },
      { id: "julee", label: "Julee", value: "julee", count: 41 },
      { id: "monique", label: "Monique", value: "monique", count: 19 },
    ],
  },
  {
    id: "price",
    title: "Price",
    type: "range",
    min: 499,
    max: 9999,
    step: 100,
    unit: "₹",
    quickValues: [499, 999, 1999],
  },
  {
    id: "discount",
    title: "Discount",
    type: "checkbox",
    options: [
      { id: "d10", label: "10% and above", value: "10", count: 612 },
      { id: "d20", label: "20% and above", value: "20", count: 480 },
      { id: "d30", label: "30% and above", value: "30", count: 355 },
      { id: "d40", label: "40% and above", value: "40", count: 210 },
      { id: "d50", label: "50% and above", value: "50", count: 132 },
      { id: "d70", label: "70% and above", value: "70", count: 44 },
    ],
  },
  {
    id: "rating",
    title: "Customer Rating",
    type: "radio",
    options: [
      { id: "r4", label: "4★ & above", value: "4", count: 588 },
      { id: "r3", label: "3★ & above", value: "3", count: 891 },
      { id: "r2", label: "2★ & above", value: "2", count: 1023 },
    ],
  },
  {
    id: "size",
    title: "Size",
    type: "size",
    options: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
      id: s,
      label: s,
      value: s,
    })),
  },
  {
    id: "color",
    title: "Colour",
    type: "color",
    options: [
      { id: "white", label: "White", value: "white", swatch: "#FFFFFF" },
      { id: "ivory", label: "Ivory", value: "ivory", swatch: "#F4EDE1" },
      { id: "black", label: "Black", value: "black", swatch: "#221B17" },
      { id: "beige", label: "Beige", value: "beige", swatch: "#D8C3A5" },
      { id: "gold", label: "Gold", value: "gold", swatch: "#C9A24B" },
      {
        id: "rose-gold",
        label: "Rose Gold",
        value: "rose-gold",
        swatch: "#B76E79",
      },
      { id: "olive", label: "Olive", value: "olive", swatch: "#6E7256" },
      { id: "wine", label: "Wine", value: "wine", swatch: "#5E2129" },
      { id: "pink", label: "Pink", value: "pink", swatch: "#E7ADB8" },
      { id: "blue", label: "Blue", value: "blue", swatch: "#3E5C76" },
      { id: "green", label: "Green", value: "green", swatch: "#3F5B45" },
      { id: "mustard", label: "Mustard", value: "mustard", swatch: "#C99A2E" },
    ],
  },
  {
    id: "fabric",
    title: "Fabric",
    type: "checkbox",
    options: [
      "Cotton",
      "Silk",
      "Linen",
      "Rayon",
      "Muslin",
      "Organza",
      "Georgette",
    ].map((f) => ({
      id: f.toLowerCase(),
      label: f,
      value: f.toLowerCase(),
      count: Math.floor(Math.random() * 200) + 20,
    })),
  },
  {
    id: "sleeve",
    title: "Sleeve",
    type: "checkbox",
    options: ["Half", "Full", "3/4", "Sleeveless"].map((s) => ({
      id: s,
      label: s,
      value: s,
    })),
  },
  {
    id: "neck",
    title: "Neck",
    type: "checkbox",
    options: ["Round", "V Neck", "Boat Neck", "Mandarin", "Square"].map(
      (n) => ({ id: n, label: n, value: n }),
    ),
  },
  {
    id: "occasion",
    title: "Occasion",
    type: "checkbox",
    options: [
      "Wedding",
      "Festive",
      "Office",
      "Party",
      "Vacation",
      "Daily Wear",
    ].map((o) => ({ id: o, label: o, value: o })),
  },
  {
    id: "pattern",
    title: "Pattern",
    type: "checkbox",
    options: ["Solid", "Printed", "Floral", "Embroidered", "Ethnic Motif"].map(
      (p) => ({ id: p, label: p, value: p }),
    ),
  },
  {
    id: "availability",
    title: "Availability",
    type: "toggle",
    options: [
      { id: "in-stock", label: "In Stock", value: "in-stock" },
      { id: "express", label: "Express Delivery", value: "express" },
      { id: "cod", label: "Cash on Delivery", value: "cod" },
    ],
  },
];

const CATEGORY_CHIPS = [
  "New",
  "Festive",
  "Office",
  "Casual",
  "Cotton",
  "Silk",
  "Designer",
  "Premium",
  "Best Seller",
  "Trending",
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "newest", label: "Newest" },
  { id: "popularity", label: "Popularity" },
  { id: "trending", label: "Trending" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "discount", label: "Discount" },
  { id: "rating", label: "Customer Rating" },
  { id: "editors", label: "Editor's Picks" },
];

const PRODUCTS = [
  {
    id: "p1",
    brand: "Vyraaa House",
    name: "Anahita Hand-Embroidered Kurti",
    img: "https://picsum.photos/seed/vyr1a/600/750",
    img2: "https://picsum.photos/seed/vyr1b/600/750",
    rating: 4.6,
    reviews: 128,
    price: 3499,
    mrp: 5999,
    delivery: "Jul 9",
    badges: ["New"],
  },
  {
    id: "p2",
    brand: "Roshni",
    name: "Ivory Muslin Ethnic Motif Kurti",
    img: "https://picsum.photos/seed/vyr2a/600/750",
    img2: "https://picsum.photos/seed/vyr2b/600/750",
    rating: 4.4,
    reviews: 76,
    price: 2199,
    mrp: 3999,
    delivery: "Jul 8",
    badges: ["Best Seller"],
  },
  {
    id: "p3",
    brand: "Vyraaa House",
    name: "Wine Silk Organza Co-ord Set",
    img: "https://picsum.photos/seed/vyr3a/600/750",
    img2: "https://picsum.photos/seed/vyr3b/600/750",
    rating: 4.8,
    reviews: 214,
    price: 6799,
    mrp: 9999,
    delivery: "Jul 10",
    badges: ["Premium", "Limited Stock"],
  },
  {
    id: "p4",
    brand: "Julee",
    name: "Rose Gold Georgette Anarkali",
    img: "https://picsum.photos/seed/vyr4a/600/750",
    img2: "https://picsum.photos/seed/vyr4b/600/750",
    rating: 4.3,
    reviews: 52,
    price: 4299,
    mrp: 6499,
    delivery: "Jul 7",
    badges: [],
  },
  {
    id: "p5",
    brand: "Monique",
    name: "Olive Linen Straight Kurti",
    img: "https://picsum.photos/seed/vyr5a/600/750",
    img2: "https://picsum.photos/seed/vyr5b/600/750",
    rating: 4.1,
    reviews: 34,
    price: 1899,
    mrp: 2999,
    delivery: "Jul 9",
    badges: ["Only Few Left"],
  },
  {
    id: "p6",
    brand: "Vyraaa House",
    name: "Beige Cotton Printed Kurti",
    img: "https://picsum.photos/seed/vyr6a/600/750",
    img2: "https://picsum.photos/seed/vyr6b/600/750",
    rating: 4.5,
    reviews: 190,
    price: 1599,
    mrp: 2599,
    delivery: "Jul 6",
    badges: ["Best Seller"],
  },
  {
    id: "p7",
    brand: "Anouk Rustic",
    name: "Mustard Floral Printed Tunic",
    img: "https://picsum.photos/seed/vyr7a/600/750",
    img2: "https://picsum.photos/seed/vyr7b/600/750",
    rating: 4.4,
    reviews: 402,
    price: 1381,
    mrp: 3299,
    delivery: "Jul 6",
    badges: ["New"],
  },
  {
    id: "p8",
    brand: "Vyraaa House",
    name: "Pink Embroidered Festive Kurti",
    img: "https://picsum.photos/seed/vyr8a/600/750",
    img2: "https://picsum.photos/seed/vyr8b/600/750",
    rating: 4.7,
    reviews: 98,
    price: 3899,
    mrp: 5499,
    delivery: "Jul 8",
    badges: ["Premium"],
  },
  {
    id: "p1",
    brand: "Vyraaa House",
    name: "Anahita Hand-Embroidered Kurti",
    img: "https://picsum.photos/seed/vyr1a/600/750",
    img2: "https://picsum.photos/seed/vyr1b/600/750",
    rating: 4.6,
    reviews: 128,
    price: 3499,
    mrp: 5999,
    delivery: "Jul 9",
    badges: ["New"],
  },
  {
    id: "p2",
    brand: "Roshni",
    name: "Ivory Muslin Ethnic Motif Kurti",
    img: "https://picsum.photos/seed/vyr2a/600/750",
    img2: "https://picsum.photos/seed/vyr2b/600/750",
    rating: 4.4,
    reviews: 76,
    price: 2199,
    mrp: 3999,
    delivery: "Jul 8",
    badges: ["Best Seller"],
  },
  {
    id: "p3",
    brand: "Vyraaa House",
    name: "Wine Silk Organza Co-ord Set",
    img: "https://picsum.photos/seed/vyr3a/600/750",
    img2: "https://picsum.photos/seed/vyr3b/600/750",
    rating: 4.8,
    reviews: 214,
    price: 6799,
    mrp: 9999,
    delivery: "Jul 10",
    badges: ["Premium", "Limited Stock"],
  },
  {
    id: "p4",
    brand: "Julee",
    name: "Rose Gold Georgette Anarkali",
    img: "https://picsum.photos/seed/vyr4a/600/750",
    img2: "https://picsum.photos/seed/vyr4b/600/750",
    rating: 4.3,
    reviews: 52,
    price: 4299,
    mrp: 6499,
    delivery: "Jul 7",
    badges: [],
  },
  {
    id: "p5",
    brand: "Monique",
    name: "Olive Linen Straight Kurti",
    img: "https://picsum.photos/seed/vyr5a/600/750",
    img2: "https://picsum.photos/seed/vyr5b/600/750",
    rating: 4.1,
    reviews: 34,
    price: 1899,
    mrp: 2999,
    delivery: "Jul 9",
    badges: ["Only Few Left"],
  },
  {
    id: "p6",
    brand: "Vyraaa House",
    name: "Beige Cotton Printed Kurti",
    img: "https://picsum.photos/seed/vyr6a/600/750",
    img2: "https://picsum.photos/seed/vyr6b/600/750",
    rating: 4.5,
    reviews: 190,
    price: 1599,
    mrp: 2599,
    delivery: "Jul 6",
    badges: ["Best Seller"],
  },
  {
    id: "p7",
    brand: "Anouk Rustic",
    name: "Mustard Floral Printed Tunic",
    img: "https://picsum.photos/seed/vyr7a/600/750",
    img2: "https://picsum.photos/seed/vyr7b/600/750",
    rating: 4.4,
    reviews: 402,
    price: 1381,
    mrp: 3299,
    delivery: "Jul 6",
    badges: ["New"],
  },
  {
    id: "p8",
    brand: "Vyraaa House",
    name: "Pink Embroidered Festive Kurti",
    img: "https://picsum.photos/seed/vyr8a/600/750",
    img2: "https://picsum.photos/seed/vyr8b/600/750",
    rating: 4.7,
    reviews: 98,
    price: 3899,
    mrp: 5499,
    delivery: "Jul 8",
    badges: ["Premium"],
  },
];

/* -------------------------------- Utilities -------------------------------- */
const money = (n) => `₹${n.toLocaleString("en-IN")}`;
const pct = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);

/* ------------------------------- Small atoms -------------------------------- */
function Badge({ children, tone = "dark" }) {
  const tones = {
    dark: { bg: C.dark, fg: "#fff" },
    rose: { bg: C.rose, fg: "#fff" },
    warn: { bg: C.warning, fg: "#3B302A" },
    outline: { bg: "transparent", fg: C.heading },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[10px] tracking-wide uppercase font-medium rounded-full"
      style={{
        background: t.bg,
        color: t.fg,
        border: tone === "outline" ? `1px solid ${C.border}` : "none",
      }}
    >
      {children}
    </span>
  );
}

function IconBtn({ children, onClick, label, badge }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative w-11 h-11 flex items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ color: C.heading, outlineColor: C.primary }}
      onMouseEnter={(e) => (e.currentTarget.style.background = C.surface)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {children}
      {badge ? (
        <span
          className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-semibold flex items-center justify-center"
          style={{ background: C.rose, color: "#fff" }}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

// /* --------------------------------- Header ----------------------------------- */
// function Header({ wishlistCount, cartCount, productCount, onOpenSearch }) {
//   return (
//     <header
//       className="sticky top-0 z-40 backdrop-blur-md"
//       style={{ background: "rgba(253,249,243,0.92)", borderBottom: `1px solid ${C.border}` }}
//     >
//       <div className="max-w-[1440px] mx-auto px-4 md:px-8">
//         <div className="h-16 md:h-20 flex items-center justify-between">
//           <div className="flex items-center gap-8">
//             <span
//               className="text-[22px] md:text-[26px] tracking-[0.18em]"
//               style={{ fontFamily: "'Playfair Display', serif", color: C.primaryDark, fontWeight: 600 }}
//             >
//               VYRAAA
//             </span>
//             <nav className="hidden lg:flex items-center gap-6 text-[13px]" style={{ color: C.body }}>
//               {["New In", "Kurtis", "Sets", "Sarees", "Sale"].map((n) => (
//                 <a key={n} href="#" className="hover:opacity-70 transition-opacity" style={{ color: n === "Kurtis" ? C.primary : C.body }}>
//                   {n}
//                 </a>
//               ))}
//             </nav>
//           </div>
//           <div className="flex items-center gap-1">
//             <IconBtn label="Search" onClick={onOpenSearch}><Search size={19} strokeWidth={1.6} /></IconBtn>
//             <IconBtn label="Wishlist" badge={wishlistCount || undefined}><Heart size={19} strokeWidth={1.6} /></IconBtn>
//             <IconBtn label="Cart" badge={cartCount || undefined}><ShoppingBag size={19} strokeWidth={1.6} /></IconBtn>
//             <IconBtn label="Account"><User size={19} strokeWidth={1.6} /></IconBtn>
//           </div>
//         </div>
//       </div>
//       <div className="max-w-[1440px] mx-auto px-4 md:px-8 pb-3 flex items-baseline gap-3">
//         <div className="flex items-center gap-1.5 text-[12px]" style={{ color: C.muted }}>
//           <span>Women</span>
//           <ChevronRight size={12} />
//           <span style={{ color: C.heading, fontWeight: 500 }}>Kurtis</span>
//         </div>
//         <span className="text-[12px]" style={{ color: C.muted }}>· {productCount.toLocaleString("en-IN")} Products</span>
//       </div>
//     </header>
//   );
// }

/* ----------------------------- Category Chips -------------------------------- */
function CategoryChips({ active, onSelect }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8">
      <div
        className="flex gap-2 overflow-x-auto py-3 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORY_CHIPS.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              onClick={() => onSelect(isActive ? null : c)}
              className="shrink-0 px-4 py-[7px] rounded-full text-[12.5px] font-medium transition-all duration-200"
              style={{
                background: isActive ? C.primary : C.surface,
                color: isActive ? "#fff" : C.body,
                border: `1px solid ${isActive ? C.primary : C.border}`,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}




function getPagination(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Beginning
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  // End
  if (current >= total - 3) {
    return [
      1,
      "...",
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total,
    ];
  }

  // Middle
  return [
    1,
    "...",
    current - 1,
    current,
    current + 1,
    "...",
    total,
  ];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-border px-6 py-5 sm:flex-row items-center  justify-center">
      {/* Info */}
      <p className="text-sm text-muted">
        Page{" "}
        <span className="font-semibold text-heading">{currentPage}</span>{" "}
        of{" "}
        <span className="font-semibold text-heading">{totalPages}</span>
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-1">
        {/* Previous */}
        <button
          type="button"
          aria-label="Previous Page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-3 w-3 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted transition-all duration-200 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "border border-border bg-white text-body hover:border-primary hover:text-primary hover:shadow-sm"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          aria-label="Next Page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted transition-all duration-200 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- Toolbar ------------------------------------ */
function Toolbar({
  sort,
  setSort,
  activeCount,
  onClearAll,
  onOpenSort,
  onOpenFilter,
  count,
  activeChips,
  onRemoveChip,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
   
      <div className="  max-w-[1440px] mx-auto px-8 pt-3 md:flex items-center justify-between gap-4 hidden ">
        <div className="flex items-center gap-3 flex-wrap min-h-[32px]">
          <span className="text-[12.5px]" style={{ color: C.muted }}>
            {count.toLocaleString("en-IN")} results
          </span>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => onRemoveChip(chip)}
              className="flex items-center gap-1.5 pl-3 pr-2 py-[5px] rounded-full text-[12px]"
              style={{
                background: C.card,
                color: C.heading,
                border: `1px solid ${C.border}`,
              }}
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          {activeCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-[12px] underline underline-offset-2"
              style={{ color: C.rose }}
            >
              Clear all
            </button>
          )}
        </div>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setSortOpen((s) => !s)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-colors"
            style={{
              border: `1px solid ${C.border}`,
              color: C.heading,
              background: sortOpen ? C.surface : "transparent",
            }}
          >
            <ArrowUpDown size={14} />
            Sort: {SORT_OPTIONS.find((s) => s.id === sort)?.label}
            <ChevronDown size={14} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg z-50"
                style={{ background: "#fff", border: `1px solid ${C.border}` }}
              >
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSort(o.id);
                      setSortOpen(false);
                    }}
                    className="w-full flex items-center justify-between text-left px-4 py-2.5 text-[13px] transition-colors"
                    style={{
                      color: sort === o.id ? C.primary : C.body,
                      background: sort === o.id ? C.surface : "transparent",
                    }}
                  >
                    {o.label}
                    {sort === o.id && <Check size={14} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
}

/* ---------------------------- Filter Section (generic) ------------------------ */
function Accordion({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span
          className="text-[13.5px] font-medium flex items-center gap-2"
          style={{ color: C.heading }}
        >
          {title}
          {count > 0 && (
            <span
              className="text-[10.5px] w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: C.rose, color: "#fff" }}
            >
              {count}
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} style={{ color: C.muted }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterSection({ section, value, onChange }) {
  const [search, setSearch] = useState("");
  const val =
    value ??
    (section.type === "range"
      ? [section.min, section.max]
      : section.type === "radio"
        ? null
        : []);
  const selectedCount =
    section.type === "range"
      ? 0
      : section.type === "radio"
        ? val
          ? 1
          : 0
        : val.length;

  const toggleMulti = (id) => {
    const next = val.includes(id) ? val.filter((v) => v !== id) : [...val, id];
    onChange(section.id, next);
  };

  const options = section.searchable
    ? section.options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : section.options;

  return (
    <Accordion
      title={section.title}
      count={selectedCount}
      defaultOpen={["category", "price"].includes(section.id)}
    >
      {section.searchable && (
        <div className="relative mb-3">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: C.muted }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${section.title.toLowerCase()}`}
            className="w-full pl-8 pr-3 py-2 text-[12.5px] rounded-lg outline-none"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: C.heading,
            }}
          />
        </div>
      )}

      {section.type === "radio" && (
        <div className="flex flex-col gap-2.5">
          {options.map((o) => (
            <label
              key={o.id}
              className="flex items-center justify-between cursor-pointer group"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: `1.5px solid ${val === o.id ? C.primary : C.border}`,
                  }}
                >
                  {val === o.id && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: C.primary }}
                    />
                  )}
                </span>
                <span className="text-[13px]" style={{ color: C.body }}>
                  {o.label}
                </span>
              </span>
              {o.count != null && (
                <span className="text-[11px]" style={{ color: C.muted }}>
                  {o.count}
                </span>
              )}
              <input
                type="radio"
                className="sr-only"
                checked={val === o.id}
                onChange={() => onChange(section.id, o.id)}
              />
            </label>
          ))}
        </div>
      )}

      {section.type === "checkbox" && (
        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {options.map((o) => (
            <label
              key={o.id}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-[5px] flex items-center justify-center transition-colors"
                  style={{
                    background: val.includes(o.id) ? C.primary : "transparent",
                    border: `1.5px solid ${val.includes(o.id) ? C.primary : C.border}`,
                  }}
                >
                  {val.includes(o.id) && (
                    <Check size={11} color="#fff" strokeWidth={3} />
                  )}
                </span>
                <span className="text-[13px]" style={{ color: C.body }}>
                  {o.label}
                </span>
              </span>
              {o.count != null && (
                <span className="text-[11px]" style={{ color: C.muted }}>
                  {o.count}
                </span>
              )}
              <input
                type="checkbox"
                className="sr-only"
                checked={val.includes(o.id)}
                onChange={() => toggleMulti(o.id)}
              />
            </label>
          ))}
        </div>
      )}

      {section.type === "toggle" && (
        <div className="flex flex-col gap-3">
          {options.map((o) => (
            <div key={o.id} className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: C.body }}>
                {o.label}
              </span>
              <button
                role="switch"
                aria-checked={val.includes(o.id)}
                onClick={() => toggleMulti(o.id)}
                className="w-9 h-5 rounded-full relative transition-colors"
                style={{
                  background: val.includes(o.id) ? C.primary : C.border,
                }}
              >
                <motion.span
                  className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow"
                  animate={{ left: val.includes(o.id) ? 18 : 2 }}
                  transition={{ duration: 0.18 }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {section.type === "size" && (
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.id}
              onClick={() => toggleMulti(o.id)}
              className="min-w-[40px] h-9 px-2 rounded-lg text-[12px] font-medium transition-colors"
              style={{
                background: val.includes(o.id) ? C.primaryDark : "transparent",
                color: val.includes(o.id) ? "#fff" : C.body,
                border: `1px solid ${val.includes(o.id) ? C.primaryDark : C.border}`,
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {section.type === "color" && (
        <div className="flex flex-wrap gap-3">
          {options.map((o) => {
            const active = val.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggleMulti(o.id)}
                aria-label={o.label}
                title={o.label}
                className="relative w-8 h-8 rounded-full flex items-center justify-center transition-transform"
                style={{
                  boxShadow: active
                    ? `0 0 0 2px #fff, 0 0 0 3.5px ${C.rose}`
                    : `0 0 0 1px ${C.border}`,
                  transform: active ? "scale(1.06)" : "scale(1)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: o.swatch,
                    border:
                      o.swatch === "#FFFFFF" ? `1px solid ${C.border}` : "none",
                  }}
                />
                {active && (
                  <Check
                    size={11}
                    strokeWidth={3}
                    className="absolute"
                    color={
                      [
                        "white",
                        "ivory",
                        "gold",
                        "beige",
                        "mustard",
                        "pink",
                      ].includes(o.value)
                        ? C.heading
                        : "#fff"
                    }
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {section.type === "range" && (
        <div>
          <div
            className="flex items-center justify-between text-[12.5px] mb-3"
            style={{ color: C.heading }}
          >
            <span>
              {section.unit}
              {val[0].toLocaleString("en-IN")}
            </span>
            <span>
              {section.unit}
              {val[1].toLocaleString("en-IN")}
              {val[1] === section.max ? "+" : ""}
            </span>
          </div>
          <input
            type="range"
            min={section.min}
            max={section.max}
            step={section.step}
            value={val[1]}
            onChange={(e) =>
              onChange(section.id, [val[0], Number(e.target.value)])
            }
            className="w-full accent-current"
            style={{ accentColor: C.primary }}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {section.quickValues.map((q) => (
              <button
                key={q}
                onClick={() => onChange(section.id, [q, section.max])}
                className="px-3 py-1.5 rounded-full text-[11.5px]"
                style={{
                  background: val[0] === q ? C.primary : C.surface,
                  color: val[0] === q ? "#fff" : C.body,
                  border: `1px solid ${val[0] === q ? C.primary : C.border}`,
                }}
              >
                {section.unit}
                {q}+
              </button>
            ))}
          </div>
        </div>
      )}
    </Accordion>
  );
}

function FilterList({ filterState, onChange }) {
  return (
    <div className="px-1">
      {FILTERS.map((section) => (
        <FilterSection
          key={section.id}
          section={section}
          value={filterState[section.id]}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

/* ------------------------------- Product Card --------------------------------- */
function ProductCard({ product, wished, onToggleWish }) {
  const [hover, setHover] = useState(false);
  const discount = pct(product.price, product.mrp);
  return (
    <motion.div
      className="group flex flex-col"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4 / 5", background: C.card }}
      >
        <img
          src={hover ? product.img2 : product.img}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-out"
          style={{ transform: hover ? "scale(1.045)" : "scale(1)" }}
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badges.map((b) => (
            <Badge
              key={b}
              tone={
                b === "Premium"
                  ? "rose"
                  : b === "Limited Stock" || b === "Only Few Left"
                    ? "warn"
                    : "dark"
              }
            >
              {b}
            </Badge>
          ))}
        </div>

        <button
          onClick={() => onToggleWish(product.id)}
          aria-label="Wishlist"
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(253,249,243,0.9)" }}
        >
          <Heart
            size={16}
            strokeWidth={1.8}
            fill={wished ? C.rose : "none"}
            color={wished ? C.rose : C.heading}
          />
        </button>

        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2.5 left-2.5 right-2.5 hidden md:flex gap-2"
            >
              <button
                className="flex-1 h-10 rounded-full text-[12px] font-medium flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                style={{ background: C.dark, color: "#fff" }}
              >
                <Plus size={13} /> Quick Add
              </button>
              <button
                aria-label="Quick view"
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(253,249,243,0.95)",
                  color: C.heading,
                }}
              >
                <Eye size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-3 flex flex-col gap-1">
        <span
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: C.muted }}
        >
          {product.brand}
        </span>
        <span
          className="text-[13.5px] leading-snug line-clamp-1"
          style={{ color: C.heading, fontFamily: "'Playfair Display', serif" }}
        >
          {product.name}
        </span>
        <div
          className="flex items-center gap-1.5 text-[11.5px]"
          style={{ color: C.muted }}
        >
          <span
            className="flex items-center gap-0.5"
            style={{ color: C.heading }}
          >
            <Star size={11} fill={C.warning} color={C.warning} />
            {product.rating}
          </span>
          <span>({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <span
            className="text-[15px] font-semibold"
            style={{ color: C.heading }}
          >
            {money(product.price)}
          </span>
          <span className="text-[12px] line-through" style={{ color: C.muted }}>
            {money(product.mrp)}
          </span>
          <span
            className="text-[12px] font-medium"
            style={{ color: C.success }}
          >
            {discount}% off
          </span>
        </div>
        <span className="text-[11px]" style={{ color: C.muted }}>
          Delivery by {product.delivery}
        </span>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-2xl animate-pulse"
        style={{ aspectRatio: "4/5", background: C.card }}
      />
      <div
        className="h-2.5 w-1/3 rounded animate-pulse"
        style={{ background: C.card }}
      />
      <div
        className="h-3 w-2/3 rounded animate-pulse"
        style={{ background: C.card }}
      />
      <div
        className="h-3 w-1/2 rounded animate-pulse"
        style={{ background: C.card }}
      />
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ background: C.card }}
      >
        <Sparkles size={24} color={C.primary} strokeWidth={1.5} />
      </div>
      <h3
        className="text-[18px] mb-1.5"
        style={{ fontFamily: "'Playfair Display', serif", color: C.heading }}
      >
        No pieces match just yet
      </h3>
      <p className="text-[13px] mb-6 max-w-xs" style={{ color: C.muted }}>
        Try adjusting or clearing your filters to see more of the collection.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="px-5 py-2.5 rounded-full text-[13px] font-medium"
          style={{ background: C.primary, color: "#fff" }}
        >
          Clear Filters
        </button>
        <button
          className="px-5 py-2.5 rounded-full text-[13px] font-medium"
          style={{ border: `1px solid ${C.border}`, color: C.heading }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

/* --------------------------- Mobile Sort Sheet & Filter Drawer ----------------- */
function SortSheet({ open, onClose, sort, setSort }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(59,48,42,0.4)" }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-6"
            style={{ background: C.bg }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: C.border }}
              />
            </div>
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <span
                className="text-[15px] font-medium"
                style={{
                  color: C.heading,
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Sort By
              </span>
              <button onClick={onClose}>
                <X size={18} color={C.muted} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {SORT_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSort(o.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-[14px]"
                  style={{
                    color: sort === o.id ? C.primary : C.body,
                    background: sort === o.id ? C.surface : "transparent",
                  }}
                >
                  {o.label}
                  {sort === o.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterDrawer({
  open,
  onClose,
  filterState,
  onChange,
  onClearAll,
  resultCount,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: C.bg }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${C.border}` }}
          >
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-[13px]"
              style={{ color: C.heading }}
            >
              <ChevronLeft size={18} /> Close
            </button>
            <span
              className="text-[15px]"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: C.heading,
              }}
            >
              Filters
            </span>
            <button
              onClick={onClearAll}
              className="text-[12.5px] underline"
              style={{ color: C.rose }}
            >
              Clear All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <FilterList filterState={filterState} onChange={onChange} />
          </div>
          <div className="p-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={onClose}
              className="w-full h-12 rounded-full text-[14px] font-medium"
              style={{ background: C.primary, color: "#fff" }}
            >
              Show {resultCount.toLocaleString("en-IN")} Results
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileBottomBar({ onSort, onFilter, activeCount }) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.border}`,
        boxShadow: "0 -4px 20px rgba(61,42,30,0.06)",
      }}
    >
      <button
        onClick={onSort}
        className="flex-1 flex items-center justify-center gap-2 py-4 text-[13px] font-medium"
        style={{ color: C.heading }}
      >
        <ArrowUpDown size={16} /> SORT
      </button>
      <div style={{ width: 1, background: C.border }} />
      <button
        onClick={onFilter}
        className="flex-1 relative flex items-center justify-center gap-2 py-4 text-[13px] font-medium"
        style={{ color: C.heading }}
      >
        <SlidersHorizontal size={16} /> FILTER
        {activeCount > 0 && (
          <span
            className="w-1.5 h-1.5 rounded-full absolute top-3.5 right-[38%]"
            style={{ background: C.rose }}
          />
        )}
      </button>
    </div>
  );
}

/* ---------------------------------- App --------------------------------------- */
export default function VyraaaPLP() {
  const [filterState, setFilterState] = useState({});
  const [sort, setSort] = useState("recommended");
  const [activeChip, setActiveChip] = useState(null);
  const [wished, setWished] = useState({});
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleFilterChange = useCallback((id, value) => {
    setLoading(true);
    setFilterState((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => setLoading(false), 350);
  }, []);

  const clearAll = () => {
    setFilterState({});
    setActiveChip(null);
  };

  const activeChips = useMemo(() => {
    const chips = [];
    FILTERS.forEach((s) => {
      const v = filterState[s.id];
      if (!v) return;
      if (s.type === "radio" && v) {
        const opt = s.options.find((o) => o.id === v);
        if (opt)
          chips.push({
            key: `${s.id}:${v}`,
            label: opt.label,
            sectionId: s.id,
            remove: null,
          });
      } else if (Array.isArray(v)) {
        if (s.type === "range") return; // shown separately if needed
        v.forEach((id) => {
          const opt = s.options.find((o) => o.id === id);
          if (opt)
            chips.push({
              key: `${s.id}:${id}`,
              label: opt.label,
              sectionId: s.id,
              remove: id,
            });
        });
      }
    });
    return chips;
  }, [filterState]);

  const removeChip = (chip) => {
    if (chip.remove === null) {
      setFilterState((prev) => {
        const n = { ...prev };
        delete n[chip.sectionId];
        return n;
      });
    } else {
      setFilterState((prev) => ({
        ...prev,
        [chip.sectionId]: prev[chip.sectionId].filter((v) => v !== chip.remove),
      }));
    }
  };

  const activeCount = activeChips.length;

  // Demo filtering: only category-radio and brand actually filter the small mock set,
  // everything else is fully wired for real API integration.
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    const brandSel = filterState.brand;
    if (brandSel && brandSel.length) {
      list = list.filter(
        (p) =>
          brandSel.includes(p.brand.toLowerCase().replace(/\s+/g, "-")) ||
          brandSel.some((b) => p.brand.toLowerCase().includes(b.split("-")[0])),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      list.sort((a, b) => pct(b.price, b.mrp) - pct(a.price, a.mrp));
    return list;
  }, [filterState, sort]);

  return (
    <div
      className="min-h-screen w-full pb-20 lg:pb-0"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        input[type="range"] { -webkit-appearance: none; height: 3px; border-radius: 999px; background: ${C.border}; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${C.primary}; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: pointer; }
        ::selection { background: ${C.primaryLight}; color: #fff; }
      `}</style>

      {/* <Header wishlistCount={Object.values(wished).filter(Boolean).length} cartCount={2} productCount={filtered.length} onOpenSearch={() => {}} /> */}
      <Navbar />
      {/* <CategoryChips active={activeChip} onSelect={setActiveChip} /> */}
      <Toolbar
        sort={sort}
        setSort={setSort}
        activeCount={activeCount}
        onClearAll={clearAll}
        onOpenSort={() => setSortSheetOpen(true)}
        onOpenFilter={() => setFilterDrawerOpen(true)}
        count={filtered.length}
        activeChips={activeChips}
        onRemoveChip={removeChip}
      />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex gap-8 py-3 md:py-5">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:block w-[268px] shrink-0 sticky self-start"
          style={{
            top: "80px",
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
          }}
        >
          <div className="flex items-center justify-between pb-2">
            <span
              className="text-[13px] font-semibold uppercase tracking-wide"
              style={{ color: C.heading }}
            >
              Filters
            </span>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-[12px] underline"
                style={{ color: C.rose }}
              >
                Clear all
              </button>
            )}
          </div>
          <FilterList filterState={filterState} onChange={handleFilterChange} />
        </aside>

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length ? (
              filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wished={!!wished[p.id]}
                  onToggleWish={(id) =>
                    setWished((w) => ({ ...w, [id]: !w[id] }))
                  }
                />
              ))
            ) : (
              <EmptyState onClear={clearAll} />
            )}
          </div>
          <Pagination
            currentPage={page}
            totalPages={8}
            onPageChange={setPage}
          />
        </main>
        {/* <Footer/ */}
      </div>
      <SuggestedProduct />
      <Footer />

      <MobileBottomBar
        onSort={() => setSortSheetOpen(true)}
        onFilter={() => setFilterDrawerOpen(true)}
        activeCount={activeCount}
      />
      <SortSheet
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        sort={sort}
        setSort={setSort}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterState={filterState}
        onChange={handleFilterChange}
        onClearAll={clearAll}
        resultCount={filtered.length}
      />
    </div>
  );
}
