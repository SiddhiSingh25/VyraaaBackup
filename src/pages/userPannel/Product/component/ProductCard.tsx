import { Heart, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const ProductCard = ({ product }: any) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const handleWishlist = () => {
    console.log("Hel;lo");
    setIsWishlisted(true);
  };
  return (
    <Link to="/productDeatils">
      <div className="group transition-all duration-500 ease-out hover:-translate-y-1 bg-gray-50 shadow rounded-xl">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] group-hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.18)] transition-shadow duration-500">
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
          <button
            onClick={handleWishlist}
            aria-label={
              isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-90 transition-transform duration-150"
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
              strokeWidth={2}
            />
          </button>

          {/* Soft ivory scrim reveal */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <div className="bg-[#FAF6F0]/95 backdrop-blur-sm border-t border-[#D4B896]/40">
              <button className="w-full py-3 sm:py-3.5 text-[10px] sm:text-[11px] font-medium tracking-[0.28em] uppercase text-heading hover:text-[#B08D57] transition-colors duration-300">
                Discover
              </button>
            </div>
          </div>
        </div>

        <div className="px-0.5 sm:px-2 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-px bg-[#B08D57]" />
            <p className="text-[9px] sm:text-[10px] font-medium tracking-[0.32em] uppercase text-[#B08D57]">
              Pantaloons
            </p>
          </div>

          <h4 className="font-heading text-heading text-lg sm:text-xl font-semibold leading-snug tracking-[0.01em] line-clamp-2">
            {product.name}
          </h4>
          <div className="flex items-center justify-between mt-2 sm:mt-1">
            <p className="text-sm sm:text-[15px] font-semibold text-gray-900">
              {typeof product.price === "number"
                ? `₹${product.price}`
                : product.price}
            </p>

            <button
              aria-label="Add to bag"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-dark/90 hover:bg-dark flex items-center justify-center shrink-0 active:scale-90 transition-all duration-150"
            >
              <HiOutlineShoppingBag
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
