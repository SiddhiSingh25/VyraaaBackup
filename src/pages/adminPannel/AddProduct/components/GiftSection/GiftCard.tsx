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
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <img
        src={gift.productDetails.image}
        alt={gift.productDetails.title}
        className="h-24 w-24 rounded-lg object-cover"
      />

      <div className="flex-1">
        <h4 className="font-semibold">{gift.productDetails.title}</h4>

        <p className="text-sm text-muted-foreground">
          {gift.productDetails.brand}
        </p>

        <div className="mt-4 flex gap-5">
          <div>
            <label className="mb-1 block text-xs">Quantity</label>

            <input
              type="number"
              min={1}
              value={gift.quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              className="w-24 rounded-lg border border-border p-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs">Size</label>

            <select
              value={gift.size}
              onChange={(e) => onSizeChange(e.target.value)}
              className="rounded-lg border border-border p-2"
            >
              {gift.productDetails.sizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button type="button" onClick={onDelete} className="text-red-500">
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default GiftCard;
