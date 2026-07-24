import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { CartItem } from "./cart";
import { discountPercent, formatINR } from "./pricing";
import { IconClock, IconClose } from "./icons";
import { apiUrls } from "../../../../../apis";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../../../../redux/slices/cartSlice";
import useGetQuery from "../../../../../hooks/getQuery.hook";
import usePostQuery from "@/hooks/postQuery.hook";
import { useToast } from "@/hooks/useToast.hook";
import { useNavigate } from "react-router-dom";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onMoveToWishlist: (id: string) => void;
  onQtyChange: (cartItemId: string, qty: number) => void;
  onRefreshCart: () => void;
}

const CartItemCard = ({
  item,
  onRemove,
  onQtyChange,
}: CartItemCardProps) => {
  const pct = discountPercent(item.mrp, item.price);
  const dispatch = useDispatch();
  const { getQuery } = useGetQuery();
  const { postQuery } = usePostQuery();
  const toast = useToast();
  const navigate = useNavigate()

  // Availability Flags
  const isAvailable = item.isAvailable !== false;
  const isFewLeft = item.isFewLeft === true;

  // ==========================================
  // DEBOUNCE LOGIC
  // ==========================================
  const [localQty, setLocalQty] = useState(item.qty);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state if the global/redux item.qty updates externally
  useEffect(() => {
    setLocalQty(item.qty);
  }, [item.qty]);

  const handleQtyChange = (newQty: number) => {
    //  Instantly update the UI so it feels responsive
    setLocalQty(newQty);

    //  Clear any existing pending API calls
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    //  Wait 500ms before sending the final amount to the API & Redux
    timerRef.current = setTimeout(() => {
      updateCart(newQty);
    }, 500);
  };
  // ==========================================

  const updateCart = (newQty: number) => {
    const targetId = item?.cartItemId || item.id;
    onQtyChange(targetId, newQty);
    postQuery({
      url: apiUrls.Cart.update,
      postData: {
        itemId: targetId,
        quantity: newQty,
      },
      onSuccess: (res: any) => {
        // toast("success", "Quantity updated");
        // onRefreshCart();
      },
      onFail: (res: any) => {
        console.log(res?.data);
        // toast("error", "Failed to update quantity");
      },
    });
  };

  // ADDED EVENT PARAMETER HERE
  const handleRemoveCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stops the click from triggering the parent's navigate

    const targetId = item?.cartItemId || item?.id;
    dispatch(removeFromCart(targetId));
    getQuery({
      url: apiUrls.Cart.remove + item?.cartItemId,
      onSuccess: (res: any) => {
        // toast("success", res.message);
        // onRefreshCart();
      },
      onFail: (res: any) => {
        console.log(res?.data);
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={() => navigate(`/productDetails/${item?.id}`)}
      className={`relative cursor-pointer rounded-lg border border-border bg-background p-4 sm:p-5 ${!isAvailable ? "opacity-60 bg-gray-50" : ""}`}
    >
      <button
        type="button"
        onClick={handleRemoveCart} // Uses the updated handler above
        aria-label={`Remove ${item.name}`}
        className="absolute right-4 top-4 text-muted transition-colors hover:text-error"
      >
        <IconClose className="h-4 w-4" />
      </button>

      <div className="flex gap-4 sm:gap-5">
        <div className="relative flex flex-shrink-0 items-start gap-2.5">
          <img
            src={item.image}
            alt={item.name}
            className={`h-24 w-20 rounded-md object-cover sm:h-28 sm:w-24 ${!isAvailable ? "grayscale" : ""}`}
          />
          {!isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-heading text-base text-admin-text sm:text-lg font-semibold">
            {item.brand}
          </h3>
          <p className="mt-0.5 truncate font-body text-sm text-body">
            {item.name}
          </p>

          {/* Stock Status Labels */}
          {!isAvailable ? (
            <p className="mt-1 font-body text-xs font-bold text-red-500">Currently Unavailable</p>
          ) : isFewLeft ? (
            <p className="mt-1 font-body text-xs font-bold text-orange-500">Hurry! Only a few left.</p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded border border-border bg-surface px-3 py-1.5 font-body text-xs font-medium text-heading">
              Size: {item.size}
            </div>

            {/* Only show quantity counter if item is available */}
            {isAvailable && (
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-1">
                <button
                  type="button"
                  disabled={localQty <= 1}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleQtyChange(localQty - 1);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded bg-background text-heading transition-colors hover:bg-border disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-4 text-center font-body text-xs font-medium text-heading">
                  {localQty}
                </span>
                <button
                  type="button"
                  disabled={localQty >= (item.maxQty || 10)}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleQtyChange(localQty + 1);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded bg-background text-heading transition-colors hover:bg-border disabled:opacity-50"
                >
                  +
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-lg text-admin-text font-bold">
              {formatINR(item.price)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;