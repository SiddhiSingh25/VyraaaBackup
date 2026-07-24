import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, AlertCircle, TrendingDown } from "lucide-react";
// import { money } from "../utils";
// import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useToast } from "@/hooks/useToast.hook";
import { useDispatch, useSelector } from "react-redux";
import usePostQuery from "@/hooks/postQuery.hook";
import { addToCart } from "../../../../redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../../../redux/slices/wishlistSlice";
import Modal from "@/components/tableComponents/Modal";

export const money = (n: number): string => `₹${n.toLocaleString("en-IN")} `;

export function Badge({ children, tone = "dark", icon }: any) {
  const tones: any = {
    dark: { bg: "var(--color-dark)", fg: "#fff" },
    rose: { bg: "var(--color-rose-gold)", fg: "#fff" },
    warn: { bg: "var(--color-warning)", fg: "#3B302A" },
    outline: { bg: "transparent", fg: "var(--color-heading)" },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-[4px] text-[10px] tracking-wide uppercase font-semibold rounded-full shadow-sm backdrop-blur-sm"
      style={{
        background: t.bg,
        color: t.fg,
        border: tone === "outline" ? "1px solid var(--color-border)" : "none",
      }}
    >
      {icon}
      {children}
    </span>
  );
}

interface PriceEntry {
  _id: string;
  size: { _id: string; size: string };
  amount: number;
  markupPrice: number;
  discount: number;
  isAvailable: boolean;
  isFewLeft: boolean;
  skuCode: string;
}

interface Product {
  _id: string;
  title: string;
  image: string;
  subImages?: string[];
  rating: number;
  averageRating: number;
  brand: { _id: string; brand: string };
  price: PriceEntry[];
  category?: any;
  subCategory?: any;
}

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for debouncing the wishlist and cart buttons
  const wishlistDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const wishlistItems: string[] = useSelector((state: any) => state.wishlist?.items ?? []);
  const isWished = wishlistItems.some((item: any) => item.id === product._id);
  const priceList = product.price ?? [];
  const availableSizes = priceList.filter((p) => p.isAvailable);
  const hasStock = availableSizes.length > 0;
  const hasFewLeft = availableSizes.some((p) => p.isFewLeft);
  const isSingleSize = priceList.length === 1;

  const displayEntry =
    availableSizes.length > 0
      ? availableSizes.reduce((min, p) => (p.amount < min.amount ? p : min), availableSizes[0])
      : priceList[0];

  const badge = !hasStock ? "Out of Stock" : hasFewLeft ? "Limited Stock" : null;

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast("warning", "Please login to add items to wishlist");
      navigate("/auth/login");
      return;
    }

    // --- DEBOUNCE LOGIC ---
    // Clear the previous timer if the user clicks again rapidly
    if (wishlistDebounceTimer.current) {
      clearTimeout(wishlistDebounceTimer.current);
    }

    // Set a new timer. The action will only run after 400ms of no clicking.
    wishlistDebounceTimer.current = setTimeout(() => {
      if (isWished) {
        // OPTIMISTIC REMOVE
        dispatch(removeFromWishlist(product._id));
        toast("success", "Removed from Wishlist successfully");

        getQuery({
          url: apiUrls.WishList.remove + product._id,
          onSuccess: (res: any) => { },
          onFail: (res: any) => {
            console.error("Failed to remove from wishlist:", res);
          },
        });
      } else {
        // OPTIMISTIC ADD
        dispatch(
          addToWishlist({
            id: product._id,
            brand: product.brand?.brand ?? "",
            name: product.title,
            image: product.image,
            rating: product.averageRating ?? product.rating ?? 0,
            price: displayEntry?.amount ?? 0,
            originalPrice: displayEntry?.markupPrice ?? null,
            stockStatus: hasStock ? "in-stock" : "out-of-stock",
            reviewCount: 0,
            badge,
          })
        );
        toast("success", "Added to wishlist!");

        const url = apiUrls.WishList.add + product._id;
        getQuery({
          url,
          onSuccess: (res: any) => { },
          onFail: (err: any) => {
            toast("error", err.message);
          },
        });
      }
    }, 400); // 400ms delay
  };

  const submitAddToCart = (entryIndex: number | null) => {
    if (entryIndex === null) {
      toast("warning", "Please select a size first");
      return;
    }

    const entry = priceList[entryIndex];
    if (!entry?.isAvailable) {
      toast("error", "Selected size is not available");
      return;
    }

    setIsSubmitting(true);

    dispatch(
      addToCart({
        id: product._id,
        brand: product.brand?.brand ?? "",
        name: product.title,
        image: product.image,
        quantity: 1,
        qty: 1,
        size: entry.size.size,
        skuCode: entry.skuCode,
        price: entry.amount,
        mrp: entry.markupPrice,
      })
    );
    setIsModalOpen(false);
    toast("success", "Item added to cart successfully");
    postQuery({
      url: apiUrls.Cart.add,
      postData: {
        productId: product._id,
        size: entry.size._id,
        skuCode: entry.skuCode,
        quantity: 1,
      },
      onSuccess: (res: any) => {
        setSelectedSize(null);
      },
      onFail: (res: any) => {
        // toast("error", res?.data?.message || "Failed to add item to cart");
      },
      onFinally: () => setIsSubmitting(false),

    });
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast("warning", "Please login to add items to cart");
      navigate("/auth/login");
      return;
    }

    if (!hasStock) {
      toast("error", "This product is currently out of stock");
      return;
    }

    if (cartDebounceTimer.current) {
      clearTimeout(cartDebounceTimer.current);
    }

    cartDebounceTimer.current = setTimeout(() => {
      cartDebounceTimer.current = null;

      if (isSingleSize) {
        submitAddToCart(priceList.indexOf(displayEntry));
        return;
      }

      setIsModalOpen(true);
    }, 300);
  };

  return (
    <>
      <motion.div
        className="group flex flex-col cursor-pointer select-none"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate(`/productDetails/${product?._id}`)}
      >
        {/* Image */}
        <div
          className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#F2E8DD] ring-1 ring-[#E6D9CF]/70
             aspect-[3/4] sm:aspect-[4/5] lg:aspect-square"
        >
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ transform: hover ? "scale(1.05)" : "scale(1)" }}
          />

          {/* subtle bottom gradient for legibility of hover CTA */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to top, rgba(61,42,30,0.35), transparent)" }}
          />

          {badge && (
            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1.5 z-10">
              <Badge
                tone={badge === "Out of Stock" ? "rose" : "warn"}
                icon={<AlertCircle size={11} strokeWidth={2.2} />}
              >
                {badge}
              </Badge>
            </div>
          )}

          <motion.button
            onClick={handleWishlist}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            whileTap={{ scale: 0.85 }}
            // Removed the disabled property and the disabled:opacity-60 class so it never turns transparent
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors z-10 shadow-sm"
            style={{ background: "rgba(253,249,243,0.92)", backdropFilter: "blur(4px)" }}
          >
            <Heart
              size={15}
              strokeWidth={1.8}
              className={
                isWished
                  ? "fill-red-500 text-red-500"
                  : "fill-none text-[#3B302A]"
              }
            />
          </motion.button>

          {/* Discount ribbon */}
          {displayEntry && displayEntry.markupPrice > displayEntry.amount && (
            <div className="absolute bottom-2 left-2 sm:bottom-2.5 sm:left-2.5 z-10 md:group-hover:opacity-0 transition-opacity duration-200">
              <span
                className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold tracking-wide text-white shadow-sm bg-success"
              >
                <TrendingDown size={11} strokeWidth={2.4} />
                {displayEntry.discount}% off
              </span>
            </div>
          )}

          {/* Desktop hover CTA */}
          <AnimatePresence>
            {hover && hasStock && (
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-2.5 left-2.5 right-2.5 hidden md:flex gap-2 z-10"
              >
                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-10 rounded-full text-[12px] font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98] text-white shadow-md bg-dark"
                >
                  <ShoppingBag size={14} strokeWidth={2} /> Add to Cart
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile/tablet: no hover, so give a persistent compact icon button */}
          {hasStock && (
            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="md:hidden absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center z-10 text-white shadow-md active:scale-90 transition-transform bg-dark"
            >
              <ShoppingBag size={15} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="pt-2.5 sm:pt-3 flex flex-col gap-1">
          <span className="text-[10.5px] sm:text-[11px] font-semibold tracking-wide uppercase text-[#84746E] truncate">
            {product.brand?.brand}
          </span>

          <span className="text-[13px] sm:text-[13.5px] leading-snug line-clamp-1 text-[#3B302A] font-serif">
            {product.title}
          </span>

          {product.averageRating !== 0 && (
            <div className="flex items-center gap-1 text-[11px] sm:text-[11.5px] text-[#84746E]">
              <span className="flex items-center gap-0.5 text-[#3B302A] font-medium">
                <Star size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
                {product.averageRating ?? product.rating}
              </span>
            </div>
          )}

          {displayEntry && (
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 pt-0.5">
              <span className="text-[14px] sm:text-[15px] font-semibold text-[#3B302A]">
                {money(displayEntry.amount)}
              </span>
              {displayEntry.markupPrice > displayEntry.amount && (
                <>
                  <span className="text-[11px] sm:text-[12px] line-through text-[#84746E]">
                    {money(displayEntry.markupPrice)}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-medium text-[#4CAF50]">
                    {displayEntry.discount}% off
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSize(null);
        }}
        title="Select Size"
        description="Choose a size to add this item to your cart"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedSize(null);
              }}
              type="button"
              className="px-4 py-2 border border-gray-300 rounded font-medium text-[12px] uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => submitAddToCart(selectedSize)}
              disabled={selectedSize === null || isSubmitting}
              type="button"
              className={`px-5 py-2 rounded font-medium text-[12px] uppercase tracking-wider text-white transition-colors flex items-center gap-1.5 ${selectedSize === null || isSubmitting
                ? "bg-[#835240]/55 cursor-not-allowed"
                : "bg-[#835240] hover:bg-[#51291a]"
                }`}
            >
              <ShoppingBag size={13} />
              {isSubmitting ? "Adding..." : "Add to bag"}
            </button>
          </div>
        }
      >
        <div className="mt-2 text-left">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={product.image}
              alt={product.title}
              className="w-16 h-20 object-cover rounded border"
            />
            <div>
              <p className="text-[11px] tracking-wider uppercase text-[#b76e79] font-medium">
                {product.brand?.brand}
              </p>
              <h3 className="text-sm font-semibold line-clamp-1">{product.title}</h3>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {selectedSize !== null
                  ? money(priceList[selectedSize].amount)
                  : money(displayEntry?.amount ?? 0)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {priceList.map((entry, index) => (
              <button
                key={entry._id}
                type="button"
                disabled={!entry.isAvailable}
                onClick={() => setSelectedSize(index)}
                className={`w-10 h-10 rounded-full border text-[12.5px] transition-all duration-200 font-semibold ${!entry.isAvailable
                  ? "border-[#e6d9cf] text-[#c9bfb6] cursor-not-allowed line-through bg-gray-50/50"
                  : selectedSize === index
                    ? "bg-[#835240] border-[#835240] text-[#fdf9f3] scale-105 shadow-sm"
                    : "border-[#e6d9cf] text-[#3b302a] hover:border-[#835240] hover:text-[#835240]"
                  }`}
              >
                {entry.size.size}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}