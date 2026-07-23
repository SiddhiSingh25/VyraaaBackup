import { Plus, Check } from "lucide-react";
import type { GiftProduct } from "../../types";

type Props = {
  product: GiftProduct;
  disabled: boolean;
  onAdd: () => void;
};

const GiftSearchCard = ({ product, disabled, onAdd }: Props) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
      <img
        src={product.image}
        alt={product.title}
        className="h-16 w-16 rounded-lg object-cover"
      />

      <div className="flex-1">
        <h4 className="font-medium">{product.title}</h4>
        <p className="text-sm text-muted-foreground">{product.brand?.brand}</p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onAdd}
        className="rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50"
      >
        {disabled ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  );
};

export default GiftSearchCard;
