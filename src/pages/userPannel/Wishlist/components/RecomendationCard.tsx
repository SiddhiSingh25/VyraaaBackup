import {  motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { RecommendedProduct } from "./types";

const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

const discountPercent = (price: number, original: number | null) => {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
};


function RecommendedCard({ product }: { product: RecommendedProduct }) {
  const navigate = useNavigate();
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => navigate(`/product/details/${product.id}`)}
      className="w-[220px] flex-shrink-0 cursor-pointer sm:w-[240px]"
    >
      <div className="relative aspect-square w-64 w-full overflow-hidden rounded-2xl bg-card">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <p className="font-heading text-sm text-admin-text">{product.brand}</p>
        <p className="text-xs text-muted">{product.name}</p>
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-medium text-admin-text">{formatINR(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
          {discount && (
            <span className="text-xs font-medium text-success">{discount}% off</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default RecommendedCard