import { motion } from "motion/react";
import type { CartItem } from "./cart";
import { discountPercent, formatINR } from "./pricing";
import { IconClock, IconClose } from "./icons";
import usePostQuery from "../../../../../hooks/postQuery.hook";
import { apiUrls } from "../../../../../apis";
import useGetQuery from "../../../../../hooks/getQuery.hook";
import { useToast } from "../../../../../hooks/useToast.hook";
import { useDispatch } from "react-redux";
import {
  removeFromCart, clearCart
} from "../../../../../redux/slices/cartSlice";

interface CartItemCardProps {
  item: CartItem;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveToWishlist: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onRefreshCart: () => void;
}

const CartItemCard = ({
  item,
  onToggleSelect,
  onRemove,
  onMoveToWishlist,
  onQtyChange,
  onRefreshCart,
}: CartItemCardProps) => {
  // Now relies on dynamically updating MRP and Price from Redux
  const pct = discountPercent(item.mrp, item.price);

  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const updateCart = (newQty: number) => {
    // 1. Instantly update UI for snappy feedback
    onQtyChange(item?.cartItemId || item?.id, newQty);

    // 2. Sync to Backend silently
    postQuery({
      url: apiUrls.Cart.update,
      postData: {
        itemId: item.id,
        quantity: newQty,
      },
      onSuccess: (res: any) => {
        toast("success", "Quantity updated");
        onRefreshCart();
      },
      onFail: (res: any) => {
        console.log(res?.data);
        toast("error", "Failed to update quantity");
      },
    });
  };

  const removeCart = () => {
    // Instantly hide it from UI
    dispatch(removeFromCart(item?.cartItemId || item?.id));

    getQuery({
      url: apiUrls.Cart.remove + item?.cartItemId,
      onSuccess: (res: any) => {
        toast("success", res.message);
        onRefreshCart();
      },
      onFail: (res: any) => {
        console.log(res?.data);
      },
    });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative rounded-lg border border-border bg-background p-4 sm:p-5"
    >
      <button
        type="button"
        onClick={() => removeCart()}
        aria-label={`Remove ${item.name}`}
        className="absolute right-4 top-4 text-muted transition-colors hover:text-error"
      >
        <IconClose className="h-4 w-4" />
      </button>

      <div className="flex gap-4 sm:gap-5">
        <div className="flex flex-shrink-0 items-start gap-2.5">
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-20 rounded-md object-cover sm:h-28 sm:w-24"
          />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <h3 className="font-heading text-base text-admin-text sm:text-lg">
            {item.brand}
          </h3>
          <p className="mt-0.5 truncate font-body text-sm text-body">
            {item.name}
          </p>
          <p className="mt-0.5 font-body text-xs text-muted">
            Sold by: {item.soldBy}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded border border-border bg-surface px-3 py-1.5 font-body text-xs font-medium text-heading">
              Size: {item.size}
            </div>

            <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-1">
              <button
                type="button"
                disabled={item.qty <= 1}
                onClick={() => updateCart(item.qty - 1)}
                className="flex h-6 w-6 items-center justify-center rounded bg-background text-heading transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
              >
                -
              </button>

              <span className="w-4 text-center font-body text-xs font-medium text-heading">
                {item.qty}
              </span>

              <button
                type="button"
                disabled={item.qty >= item.maxQty}
                onClick={() => updateCart(item.qty + 1)}
                className="flex h-6 w-6 items-center justify-center rounded bg-background text-heading transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Because Redux updates these, the UI will instantly reflect the math */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-lg text-admin-text">
              {formatINR(item.price)}
            </span>
            <span className="font-body text-sm text-muted line-through">
              {formatINR(item.mrp)}
            </span>
            <span className="font-body text-sm font-medium text-success">
              {pct}% OFF
            </span>
          </div>

          <p className="mt-2 flex items-center gap-1 font-body text-xs text-muted">
            <IconClock className="h-3.5 w-3.5" />
            {item.returnDays} days return available
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs font-semibold tracking-wide">
        <button
          type="button"
          onClick={removeCart}
          className="text-body transition-colors hover:text-error"
        >
          REMOVE
        </button>
        <span className="h-3.5 w-px bg-border" />
        <button
          type="button"
          onClick={() => onMoveToWishlist(item.id)}
          className="text-body transition-colors hover:text-primary"
        >
          MOVE TO WISHLIST
        </button>
      </div>
    </motion.div>
  );
};

export default CartItemCard;