// import { Heart } from "lucide-react";
// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { HiOutlineShoppingBag } from "react-icons/hi2";
// import useGetQuery from "../../../../hooks/getQuery.hook";
// import { apiUrls } from "../../../../apis";
// import { useToast } from "../../../../hooks/useToast.hook";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
// import usePostQuery from "@/hooks/postQuery.hook";
// import { addToCart } from "../../../../redux/slices/cartSlice";
// import Modal from "@/components/tableComponents/Modal";

// const SectionLabel = ({ children, action }: any) => (
//   <div className="flex items-center justify-between mb-2">
//     <p className="text-[11px] tracking-[0.14em] uppercase text-[#3b302a] font-medium">{children}</p>
//     {action}
//   </div>
// );

// const ProductCard = ({ product }: any) => {
//   const { getQuery } = useGetQuery();
//   const { postQuery } = usePostQuery();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { isAuthenticated } = useAppSelector((state: any) => state.auth);
//   const wishlistItems = useAppSelector((state: any) => state.wishlist.items || []);
//   const isWishlisted = wishlistItems.some((item: any) => item.id === product._id);

//   const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [isSubmitting, setIsSubmitting] = React.useState(false);


//   const handleWishlist = (e: React.MouseEvent) => {

//     console.log(e, "jv")
//     e.preventDefault();
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       toast("info", "Please log in to add items to your wishlist");
//       navigate("/auth/login");
//       return;
//     }


//     getQuery({


//       url: apiUrls.WishList.add + product?._id,
//       onSuccess: (res: any) => {

//         dispatch(addToWishlist({
//           id: product._id,
//           brand: getBrandName(product.brand),
//           name: product.name || product.title,
//           image: product.img || product.image,
//           price: typeof product.price === 'number' ? product.price : parseFloat(product.price?.[0]?.amount?.toString().replace(/[^\d\.]/g, '') || product.price?.toString().replace(/[^\d\.]/g, '') || '0'),
//           stockStatus: "in-stock"
//         }));

//         toast("success", res.message || "Added to wishlist");
//       },
//       onFail: (error: any) => {
//         console.error(error);
//         toast("error", error.response?.data?.message || "Already Added");
//       },
//     });
//   };

//   const getBrandName = (brand: any) => {
//     if (!brand) return "Vyraa";
//     if (typeof brand === "string") return brand;
//     if (typeof brand === "object" && brand.brand) return brand.brand;
//     return "Vyraa";
//   };

//   const getDisplayPrice = () => {
//     if (Array.isArray(product.price) && product.price.length > 0) {
//       return `₹${product.price[0].amount}`;
//     }
//     if (typeof product.price === "number") {
//       return `₹${product.price}`;
//     }
//     return product.price || "N/A";
//   };

//   const handleAddToCartClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       toast("warning", "Please login to add items to cart");
//       navigate("/auth/login");
//       return;
//     }

//     // Check if there is a price list array with size options
//     if (Array.isArray(product.price) && product.price.length > 0) {
//       setIsModalOpen(true);
//     } else {
//       // Fallback if there is no sizing details
//       toast("error", "No sizing information available for this product");
//     }
//   };

//   const executeAddToCart = () => {

//     if (selectedSize === null) {
//       toast("warning", "Please select a size first");
//       return;
//     }

//     const currentPriceObj = product.price[selectedSize];

//     if (!currentPriceObj?.isAvailable) {
//       toast("error", "Selected size is not available");
//       return;
//     }


//     setIsSubmitting(true);

//     postQuery({
//       url: apiUrls.Cart.add,
//       postData: {
//         "productId": product._id || product.id,
//         "size": product.price[selectedSize].size._id,
//         "quantity": 1
//       },
//       onSuccess: (res: any) => {
//         toast("success", res.message || "Added to cart successfully");
//         dispatch(
//           addToCart({
//             id: product._id || product.id,
//             brand: getBrandName(product.brand),
//             name: product.title || product.name,
//             image: product.image || product.img || product.thumbnail || "",
//             quantity: 1,
//             qty: 1,
//             size: currentPriceObj?.size?.size || "",
//             price: currentPriceObj?.amount || 0,
//             mrp: currentPriceObj?.markupPrice || 0,
//           })
//         );
//         setIsModalOpen(false);
//         setIsSubmitting(false);
//       },
//       onFail: (res: any) => {
//         console.log(res?.data?.message, "=====error section");
//         toast("error", res?.data?.message || "Failed to add item to cart");
//         setIsSubmitting(false);
//       },
//     });

//     setIsSubmitting(false);
//   };

//   return (
//     <>
//       <Link to={`/productDetails/${product.id || product._id}`}>
//         <div className="group transition-all duration-500 ease-out hover:-translate-y-1 bg-gray-50 shadow rounded-xl">
//           <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] group-hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-500">
//             <img
//               src={product.img || product.image}
//               alt={product.name || product.title}
//               loading="lazy"
//               className="w-full h-full object-cover absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
//             />
//             <button
//               onClick={handleWishlist}
//               aria-label={
//                 isWishlisted ? "Remove from wishlist" : "Add to wishlist"
//               }
//               className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-90 transition-transform duration-150"
//             >
//               <Heart
//                 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
//                   }`}
//                 strokeWidth={2}
//               />
//             </button>

//             {/* Soft ivory scrim reveal */}
//             <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
//               <div className="bg-[#FAF6F0]/95 backdrop-blur-sm border-t border-[#D4B896]/40">
//                 <button className="w-full py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase text-admin-text hover:text-[#B08D57] transition-colors duration-300">
//                   View Product
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="px-0.5 sm:px-2 pb-2">
//             <div className="flex items-center gap-2 mb-2">
//               <span className="w-3 h-px bg-[#B08D57]" />
//               <p className="text-[9px] sm:text-[10px] font-medium tracking-[0.32em] uppercase text-[#B08D57]">
//                 {getBrandName(product.brand)}
//               </p>
//             </div>

//             <h4 className="font-heading text-admin-text text-lg sm:text-xl font-semibold leading-snug tracking-[0.01em] line-clamp-2">
//               {product.name || product.title}
//             </h4>
//             <div className="flex items-center justify-between mt-2 sm:mt-1">
//               <p className="text-sm sm:text-[15px] font-semibold text-gray-900">
//                 {getDisplayPrice()}
//               </p>

//               <button
//                 onClick={handleAddToCartClick}
//                 aria-label="Add to bag"
//                 className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-dark/90 hover:bg-dark flex items-center justify-center shrink-0 active:scale-90 transition-all duration-150"
//               >
//                 <HiOutlineShoppingBag
//                   className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
//                   strokeWidth={2}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>
//       </Link>

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedSize(null);
//         }}
//         title="Select Size"
//         description="Choose a size to add this item to your cart"
//         footer={
//           <div className="flex gap-3 w-full justify-end">
//             <button
//               onClick={() => {
//                 setIsModalOpen(false);
//                 setSelectedSize(null);
//               }}
//               type="button"
//               className="px-4 py-2 border border-gray-300 rounded font-medium text-[12px] uppercase tracking-wider text-admin-text hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={executeAddToCart}
//               disabled={selectedSize === null || isSubmitting}
//               type="button"
//               className={`px-5 py-2 rounded font-medium text-[12px] uppercase tracking-wider text-white transition-colors ${selectedSize === null || isSubmitting
//                 ? "bg-[#835240]/55 cursor-not-allowed"
//                 : "bg-[#835240] hover:bg-[#51291a]"
//                 }`}
//             >
//               {isSubmitting ? "Adding..." : "Add to bag"}
//             </button>
//           </div>
//         }
//       >
//         <div className="mt-2 text-left">
//           <div className="flex items-center gap-4 mb-6">
//             <img
//               src={product.img || product.image || ""}
//               alt={product.name || product.title}
//               className="w-16 h-20 object-cover rounded border"
//             />
//             <div>
//               <p className="text-[11px] tracking-wider uppercase text-[#b76e79] font-medium">
//                 {getBrandName(product.brand)}
//               </p>
//               <h3 className="text-sm font-semibold text-admin-text line-clamp-1">
//                 {product.name || product.title}
//               </h3>
//               <p className="text-sm font-bold text-gray-900 mt-1">
//                 {selectedSize !== null && product.price?.[selectedSize]
//                   ? `₹${product.price[selectedSize].amount}`
//                   : getDisplayPrice()}
//               </p>
//             </div>
//           </div>

//           <SectionLabel>Select Size</SectionLabel>
//           <div className="flex flex-wrap gap-2 mt-2">
//             {Array.isArray(product?.price) &&
//               product.price.map((size: any, index: number) => (
//                 <button
//                   key={index}
//                   type="button"
//                   disabled={!size.isAvailable}
//                   onClick={() => setSelectedSize(index)}
//                   className={`w-10 h-10 rounded-full border text-[12.5px] transition-all duration-200 font-semibold ${!size.isAvailable
//                     ? "border-[#e6d9cf] text-[#c9bfb6] cursor-not-allowed line-through bg-gray-50/50"
//                     : selectedSize === index
//                       ? "bg-[#835240] border-[#835240] text-[#fdf9f3] scale-105 shadow-sm"
//                       : "border-[#e6d9cf] text-[#3b302a] hover:border-[#835240] hover:text-[#835240]"
//                     }`}
//                 >
//                   {size.size?.size}
//                 </button>
//               ))}
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default ProductCard;
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
            src={hover && product.subImages?.[0] ? product.subImages[0] : product.image}
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
            <Heart
              size={16}
              strokeWidth={1.8}
              fill={isWished ? "#B76E79" : "none"}
              color={isWished ? "#B76E79" : "#3B302A"}
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
          <div className="flex items-center gap-1.5 text-[11.5px] text-[#84746E]">
            <span className="flex items-center gap-0.5 text-[#3B302A]">
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              {product.averageRating ?? product.rating}
            </span>
          </div>
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