import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import { money, pct } from "../utils";
import Badge from "./Badge";
import type { Product } from "../types";
import { useNavigate } from "react-router-dom";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useToast } from "@/hooks/useToast.hook";
import { useDispatch, useSelector } from "react-redux";
import usePostQuery from "@/hooks/postQuery.hook";
import { addToCart } from "../../../../redux/slices/cartSlice";
import Modal from "@/components/tableComponents/Modal";

// 1. Fixed TS Error: Extended the Product type to include the size properties 
// you are trying to access in the handleAddToCart function.
export interface ProductCardProps {
  product: Product & { size?: string; sizeName?: string; id?: string };
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const [hover, setHover] = useState(false);

  // console.log(prod)

  // 2. Added state to track wishlist success for highlighting
  const [isWished, setIsWished] = useState(false);

  const discount = pct(product.price, product.mrp);
  const navigate = useNavigate();
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const { toast } = useToast();
  const dispatch = useDispatch();

  // Fixed TS Error: Added 'any' or your RootState type to the state parameter

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>, data: string | undefined) => {
    e.stopPropagation();

    if (!data) return;

    getQuery({
      url: apiUrls.WishList.add + data,
      onSuccess: (res: any) => {
        // 3. Highlight the icon upon success
        setIsWished(true);
        toast("success", "Added to wishlist!");
      },
      onFail: (err: any) => {
        toast("error", "Failed to add to wishlist.");
      },
    });
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast("warning", "Please login to add items to cart");
      navigate("/auth/login");
      return;
    }



    if (selectedSize === null) {
      toast("warning", "Please select a size first");
      return;
    }

    const currentPriceObj = product.price[selectedSize];

    if (!currentPriceObj?.isAvailable) {
      toast("error", "Selected size is not available");
      return;
    }


    setIsSubmitting(true);

    postQuery({
      url: apiUrls.Cart.add,
      postData: {
        productId: product?.id,
        size: product?.size,
        quantity: 1
      },
      onSuccess: (res: any) => {
        toast("success", res.message);
        dispatch(
          addToCart({
            id: product.id,
            brand: product.brand,
            name: product.name,
            image: product.img || product?.img2 || "",
            quantity: 1,
            qty: 1,
            size: product?.sizeName || "",
            price: product?.price || 0,
            mrp: product?.mrp || 0,
          })
        );
      },
      onFail: (res: any) => {
        toast("error", res?.data?.message || "Failed to add item to cart");
      },
    });
  };

  const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <>
      <motion.div
        className="group flex flex-col cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => navigate({ pathname: `/productDetails/${product?.id}` })}
      >
        <div
          className="relative overflow-hidden rounded-2xl bg-[#F2E8DD]"
          style={{ aspectRatio: "4 / 5" }}
        >
          <img
            src={hover && product.img2 ? product.img2 : product.img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[400ms] ease-out"
            style={{ transform: hover ? "scale(1.045)" : "scale(1)" }}
          />

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {/* Added safe mapping '?' in case badges array is undefined */}
            {product.badges?.map((b) => (
              <Badge
                key={b}
                tone={
                  b === "Not Available"
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

          {/* WISHLIST BUTTON */}
          <button
            onClick={(e) => handleWishlist(e, product.id)}
            aria-label="Wishlist"
            className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10"
            style={{ background: "rgba(253,249,243,0.9)" }}
          >
            <Heart
              size={16}
              strokeWidth={1.8}
              // 4. Update the fill and color properties based on isWished state
              fill={isWished ? "#B76E79" : "none"}
              color={isWished ? "#B76E79" : "#3B302A"}
            />
          </button>

          <AnimatePresence>
            {hover && (
              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-2.5 left-2.5 right-2.5 hidden md:flex gap-2 z-10"
              >
                {/* ADD TO CART BUTTON */}
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
          <span
            className="text-[11px] font-semibold tracking-wide uppercase text-[#84746E]"
          >
            {product.brand}
          </span>
          <span
            className="text-[13.5px] leading-snug line-clamp-1 text-[#3B302A] font-serif"
          >
            {product.name}
          </span>
          <div
            className="flex items-center gap-1.5 text-[11.5px] text-[#84746E]"
          >
            <span
              className="flex items-center gap-0.5 text-[#3B302A]"
            >
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              {product.rating}
            </span>
            <span>({product.reviews})</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span
              className="text-[15px] font-semibold text-[#3B302A]"
            >
              {money(product.price)}
            </span>
            <span className="text-[12px] line-through text-[#84746E]">
              {money(product.mrp)}
            </span>
            <span
              className="text-[12px] font-medium text-[#4CAF50]"
            >
              {discount}% off
            </span>
          </div>
        </div>
      </motion.div>

      {/* <Modal
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
              className="px-4 py-2 border border-gray-300 rounded font-medium text-[12px] uppercase tracking-wider text-admin-text hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              disabled={selectedSize === null || isSubmitting}
              type="button"
              className={`px-5 py-2 rounded font-medium text-[12px] uppercase tracking-wider text-white transition-colors ${selectedSize === null || isSubmitting
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
              src={product.img || product.image || ""}
              alt={product.name || product.title}
              className="w-16 h-20 object-cover rounded border"
            />
            <div>
              <p className="text-[11px] tracking-wider uppercase text-[#b76e79] font-medium">
                Vyraaa
              </p>
              <h3 className="text-sm font-semibold text-admin-text line-clamp-1">
                {product.name || product.title}
              </h3>
              <p className="text-sm font-bold text-gray-900 mt-1">
                {selectedSize !== null && product.price?.[selectedSize]
                  ? `₹${product.price[selectedSize].amount}`
                  : getDisplayPrice()}
              </p>
            </div>
          </div>

          <SectionLabel>Select Size</SectionLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(product?.price) &&
              product.price.map((size: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  disabled={!size.isAvailable}
                  onClick={() => setSelectedSize(index)}
                  className={`w-10 h-10 rounded-full border text-[12.5px] transition-all duration-200 font-semibold ${!size.isAvailable
                    ? "border-[#e6d9cf] text-[#c9bfb6] cursor-not-allowed line-through bg-gray-50/50"
                    : selectedSize === index
                      ? "bg-[#835240] border-[#835240] text-[#fdf9f3] scale-105 shadow-sm"
                      : "border-[#e6d9cf] text-[#3b302a] hover:border-[#835240] hover:text-[#835240]"
                    }`}
                >
                  {size.size?.size}
                </button>
              ))}
          </div>
        </div>
      </Modal> */}
    </>
  );
}