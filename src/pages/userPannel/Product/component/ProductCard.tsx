import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
// import { money } from "../utils";
// import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useToast } from "@/hooks/useToast.hook";
import { useDispatch, useSelector } from "react-redux";
import usePostQuery from "@/hooks/postQuery.hook";
import { addToCart } from "../../../../redux/slices/cartSlice";
// ✅ add a wishlist slice mirroring cartSlice's shape — adjust path/action names to match yours
import { addToWishlist, removeFromWishlist } from "../../../../redux/slices/wishlistSlice";
import Modal from "@/components/tableComponents/Modal";

export const money = (n: number): string => `₹${n.toLocaleString("en-IN")}`;

export const C: any = {
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

export  function Badge({ children, tone = "dark" }: any) {
  const tones: any = {
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
}

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWishlistPending, setIsWishlistPending] = useState(false);

  const navigate = useNavigate();
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  // ✅ #1/#2: wishlist state now derived from Redux, not local — survives refresh,
  // and works whether the store hydrates it from an API call on app load or from
  // a persisted list. Replace `state.wishlist.items` with your actual slice shape.
  const wishlistItems: string[] = useSelector((state: any) => state.wishlist?.items ?? []);
  // const isWished = wishlistIds.includes(product._id);
  const isWished = wishlistItems.some(
  (item: any) => item.id === product._id
);
  console.log(isWished, "$$$$$$$")

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

  // ✅ #3: toggle add/remove instead of add-only
  // ✅ #4: dispatch to Redux only after API confirms success
const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();

  if (!isAuthenticated) {
    toast("warning", "Please login to add items to wishlist");
    navigate("/auth/login");
    return;
  }

  // already wished — do nothing, no remove call
  if (isWished) return;

  if (isWishlistPending) return;
  setIsWishlistPending(true);

  const url = apiUrls.WishList.add + product._id;

  getQuery({
  url,
  onSuccess: (res: any) => {
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
    toast("success", res.message || "Added to wishlist!");
  },
  onFail: (err: any) => {
    toast("error", err.message);
  },
  onFinally: () => setIsWishlistPending(false),
});
};

  // ✅ #1 (cart bug fix): this function now ONLY calls the API — no modal logic here.
  // ✅ #4: validates a size is actually selected before firing the request.
  // ✅ #5: rejects if the chosen entry is unavailable.
  // ✅ #6: entry.amount / entry.markupPrice / entry.skuCode / entry.size._id are the
  //        single source of truth for both the API payload and the Redux update.
  const submitAddToCart = (entryIndex: number | null) => {
    console.log("clicked")
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

    postQuery({
      url: apiUrls.Cart.add,
      postData: {
        productId: product._id,
        size: entry.size._id,
        skuCode: entry.skuCode,
        quantity: 1,
      },
      onSuccess: (res: any) => {
        // ✅ #8: Redux only updated on confirmed success
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
        toast("success", res.message);
        // ✅ #7: close modal, reset size, stop loading — in that order after Redux sync
        setIsModalOpen(false);
        setSelectedSize(null);
      },
      onFail: (res: any) => {
        // ✅ #9: no Redux dispatch on failure
        toast("error", res?.data?.message || "Failed to add item to cart");
      },
      onFinally: () => setIsSubmitting(false),
    });
  };

  // ✅ #10: no available sizes → never open the modal, just tell the user
  // ✅ #2 (multi-size rule): modal opens for user to pick; API isn't called until they do
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("click on bt")

    if (!isAuthenticated) {
      toast("warning", "Please login to add items to cart");
      navigate("/auth/login");
      return;
    }

    if (!hasStock) {
      toast("error", "This product is currently out of stock");
      return;
    }

    if (isSingleSize) {
      submitAddToCart(priceList.indexOf(displayEntry));
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <motion.div
        className="group flex flex-col cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate({ pathname: `/productDetails/${product._id}` })}
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#F2E8DD]" style={{ aspectRatio: "4 / 5" }}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[400ms] ease-out"
            style={{ transform: hover ? "scale(1.045)" : "scale(1)" }}
          />

          {badge && (
            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
              <Badge tone={badge === "Out of Stock" ? "rose" : "warn"}>{badge}</Badge>
            </div>
          )}

          <button
            onClick={handleWishlist}
            disabled={isWishlistPending}
            aria-label="Wishlist"
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10 disabled:opacity-60"
            style={{ background: "rgba(253,249,243,0.9)" }}
          >
            {/* <Heart
              size={16}
              strokeWidth={1.8}
              // fill-red-500 text-red-500
              fill={isWished ? "fill-red-500 text-red-500 " : "none"}
              color={isWished ? "#B76E79" : "#3B302A"}
            /> */}
            <Heart
  size={16}
  strokeWidth={1.8}
  className={isWished ? "fill-red-500 text-red-500" : "fill-none text-[#3B302A]"}
/>
          </button>

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
                  className="flex-1 h-10 rounded-full text-[12px] font-medium flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] bg-[#3D2A1E] text-white"
                >
                  <Plus size={13} /> Add to Cart
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-3 flex flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wide uppercase text-[#84746E]">
            {product.brand?.brand}
          </span>
          <span className="text-[13.5px] leading-snug line-clamp-1 text-[#3B302A] font-serif">
            {product.title}
          </span>
          {product.averageRating === 0 ? "" :  <div className="flex items-center gap-1.5 text-[11.5px] text-[#84746E]">
            <span className="flex items-center gap-0.5 text-[#3B302A]">
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              {product.averageRating ?? product.rating}
            </span>
          </div> }
         
          {displayEntry && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[15px] font-semibold text-[#3B302A]">
                {money(displayEntry.amount)}
              </span>
              {displayEntry.markupPrice > displayEntry.amount && (
                <>
                  <span className="text-[12px] line-through text-[#84746E]">
                    {money(displayEntry.markupPrice)}
                  </span>
                  <span className="text-[12px] font-medium text-[#4CAF50]">
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
              className={`px-5 py-2 rounded font-medium text-[12px] uppercase tracking-wider text-white transition-colors ${
                selectedSize === null || isSubmitting
                  ? "bg-[#835240]/55 cursor-not-allowed"
                  : "bg-[#835240] hover:bg-[#51291a]"
              }`}
            >
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
                className={`w-10 h-10 rounded-full border text-[12.5px] transition-all duration-200 font-semibold ${
                  !entry.isAvailable
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