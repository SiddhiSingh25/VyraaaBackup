import { Trash2 } from "lucide-react";
import type { GiftItem } from "../../types";

type Props = {
  gift: GiftItem;
  onDelete: () => void;
  onQuantityChange: (qty: number) => void;
  onSizeChange: (size: string) => void;
};

const GiftCard = ({
  gift,
  onDelete,
  onQuantityChange,
  onSizeChange,
}: Props) => {
  console.log(gift, "======")
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4 items-center">
      <img
        src={gift.productDetails?.image || "https://via.placeholder.com/150"}
        alt={gift.productDetails?.title || "Gift"}
        className="h-20 w-20 rounded-lg object-cover border border-border"
      />

      <div className="flex-1">
        <h4 className="font-semibold text-sm">
          {gift.productDetails?.title || "Unknown Product"}
        </h4>

        <p className="text-xs text-muted-foreground mb-3">
          {gift.productDetails?.brand || "Generic Brand"}
        </p>

        <div className="flex gap-4">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              value={gift.quantity || 1}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="w-20 rounded-md border border-border p-1.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
              Size
            </label>
            <select
              value={gift.size || ""}
              onChange={(e) => onSizeChange(e.target.value)}
              className="w-24 rounded-md border border-border p-1.5 text-sm outline-none focus:border-primary bg-transparent"
            >
              {/* Added safe array checking before map */}
              {gift.productDetails?.sizes?.length ? (
                gift.productDetails.sizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))
              ) : (
                <option value="">N/A</option>
              )}
            </select>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 hover:bg-red-100 rounded-lg"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default GiftCard;