/* ------------------------------------------------------------------ */
/* Wishlist Card                                                     */
/* ------------------------------------------------------------------ */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { StockStatus, WishlistProduct } from "./types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { apiUrls } from "../../../../apis";
import { useToast } from "../../../../hooks/useToast.hook";

/* ------------------------------------------------------------------ */
/* Star rating & Utilities                                           */
/* ------------------------------------------------------------------ */

const formatINR = (value: number) =>
  `₹${value.toLocaleString("en-IN")}`;

const discountPercent = (price: number, original: number | null) => {
  if (!original || original <= price) return null;
  return Math.round(((original - price) / original) * 100);
};

/* ------------------------------------------------------------------ */
/* Stock status pill                                                 */
/* ------------------------------------------------------------------ */

function StockStatusLabel({ status }: { status: StockStatus }) {
  if (status === "out-of-stock") {
    return <p className="text-xs font-medium text-error">Out of stock</p>;
  }
  if (status === "low-stock") {
    return <p className="text-xs font-medium text-warning">Only a few left</p>;
  }
  return <p className="text-xs font-medium text-success">In stock</p>;
}

function WishlistCard({
  product,
  onRemove,
  onAddToBag,
  onBuyNow,
  onNotifyMe,
}: {
  product: WishlistProduct;
  onRemove: (id: string) => void;
  onAddToBag: (id: string) => void;
  onBuyNow: (id: string) => void;
  onNotifyMe: (id: string) => void;
}) {
  const { getQuery } = useGetQuery()
  const { toast } = useToast();
  const navigate = useNavigate();
  const discount = discountPercent(product.price, product.originalPrice);
  const isOut = product.stockStatus === "out-of-stock";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      // Updated onClick logic here
      onClick={() => navigate({ pathname: `/productDeatils/${product?.id}` })}
      className="group cursor-pointer rounded-xl border border-border bg-surface overflow-hidden shadow-[0_1px_3px_rgba(59,48,42,0.06)] hover:shadow-[0_18px_40px_-16px_rgba(59,48,42,0.25)] transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative aspect-square h-64 w-full overflow-hidden bg-card">
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className={`h-full w-full object-cover transition-transform duration-400 ease-out group-hover:scale-[1.025] ${isOut ? "grayscale-35 opacity-80" : ""
            }`}
        />

        {/* Remove button */}
        <button
          type="button"
          aria-label="Remove from wishlist"
          onClick={(e) => {
            e.stopPropagation();
            getQuery({
              url: apiUrls.WishList.remove + product?.id,
              onSuccess: (res: any) => {
                toast("success", res.message);
              },
              onFail: (res: any) => {
                console.error("Failed to fetch wishlist:", res);
              },
            });
            onRemove(product.id);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-body opacity-100 backdrop-blur-sm transition-all duration-300 hover:bg-background hover:text-error group-hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="my-1 flex flex-col gap-1 p-2">
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
    </motion.article >
  );
}

export default WishlistCard;