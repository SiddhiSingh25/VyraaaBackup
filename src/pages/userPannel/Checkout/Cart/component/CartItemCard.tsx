import { motion } from "motion/react";
import type { CartItem } from "./cart";
import { discountPercent, formatINR } from "./pricing";
import { IconClock, IconClose } from "./icons";
import usePostQuery from "../../../../../hooks/postQuery.hook";
import { apiUrls } from "../../../../../apis";
import useGetQuery from "../../../../../hooks/getQuery.hook";
import { useToast } from "../../../../../hooks/useToast.hook";
import { useDispatch } from "react-redux";


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
  onQtyChange,
  onRefreshCart,
}: CartItemCardProps) => {
  const pct = discountPercent(item.mrp, item.price);
  const { postQuery } = usePostQuery();
  const { getQuery } = useGetQuery();
  const { toast } = useToast();

    const dispatch = useDispatch();

  const updateCart = (data: Number) => {
    postQuery({
      url: apiUrls.Cart.update,
      postData: {
        itemId: item.id,
        quantity: data,
      },
      onSuccess: (res: any) => {
      // dispatch(updateQuantity({item : item.id, quantity: data }));
        toast("success", res.message);
        onRefreshCart();
      },
      onFail: (res: any) => {
        console.log(res?.data);
      },
    });
  };

  const onMoveToWishlist = ()=>{
    console.log("dgnjhg")
  }

  const removeCart = () => {
    getQuery({
      url: apiUrls.Cart.remove + item.id,
      onSuccess: (res: any) => {
        //  dispatch(removeFromCart(item.id));
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
      {/* Remove */}
      <button
        type="button"
        onClick={() => removeCart()}
        aria-label={`Remove ${item.name}`}
        className="absolute right-4 top-4 text-muted transition-colors hover:text-error"
      >
        <IconClose className="h-4 w-4" />
      </button>

      <div className="flex gap-4 sm:gap-5">
        {/* Select + image */}
        <div className="flex flex-shrink-0 items-start gap-2.5">
          {/* <input
            type="checkbox"
            checked={item.selected}
            onChange={() => onToggleSelect(item.id)}
            className="mt-1 h-4 w-4 accent-primary"
            aria-label={`Select ${item.name}`}
          /> */}
          <img
            src={item.image}
            alt={item.name}
            className="h-24 w-20 rounded-md object-cover sm:h-28 sm:w-24"
          />
        </div>

        {/* Details */}
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

          {/* Size (Static) / Qty selector */}
          <div className="mt-3 flex flex-wrap items-center gap-2.5">

            {/* Directly showing the size instead of a dropdown */}
            <div className="flex items-center rounded border border-border bg-surface px-3 py-1.5 font-body text-xs font-medium text-heading">
              Size: {item.size}
            </div>

            <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-1">
              {/* Decrease Button */}
              <button
                type="button"
                disabled={item.qty <= 1}
                onClick={() => {
                  const newQty = item.qty - 1;
                  updateCart(newQty);
                  console.log(`Updating ${item.name} (ID: ${item.id}) to Quantity: ${newQty}`);
                  onQtyChange(item.id, newQty);
                }}
                className="flex h-6 w-6 items-center justify-center rounded bg-background text-heading transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                -
              </button>

              {/* Quantity Display */}
              <span className="w-4 text-center font-body text-xs font-medium text-heading">
                {item.qty}
              </span>

              {/* Increase Button */}
              <button
                type="button"
                disabled={item.qty >= item.maxQty}
                onClick={() => {
                  const newQty = item.qty + 1;
                  updateCart(newQty);
                  console.log(`Updating ${item.name} (ID: ${item.id}) to Quantity: ${newQty}`);
                  onQtyChange(item.id, newQty);
                }}
                className="flex h-6 w-6 items-center justify-center rounded bg-background text-heading transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-lg text-admin-text">
              {formatINR(item.price)}
            </span>
            <span className="font-body text-sm text-muted line-through">
              {formatINR(item.mrp)}
            </span>
            <span className="font-body text-sm font-medium text-success">
              {pct}% OFFs
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