import { Plus, Check } from "lucide-react";
import type { GiftProduct } from "../../types";

type Props = {
  product: GiftProduct;
  disabled: boolean;
  onAdd: () => void;
};

const GiftSearchCard = ({ product, disabled, onAdd }: Props) => {
  const resolvedBrand = typeof product.brand === "string"
    ? product.brand
    : product.brand?.brand;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
      {/* Added fallback image handling */}
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.title || "Product"}
        className="h-16 w-16 rounded-lg object-cover"
      />

      <div className="flex-1">
        <h4 className="font-medium">{product.title}</h4>
        {/* Safely display brand */}
        <p className="text-sm text-muted-foreground">
          {resolvedBrand || "Generic Brand"}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onAdd}
        className={`rounded-lg px-4 py-2 text-white transition-colors ${
          disabled ? "bg-green-500 opacity-80" : "bg-primary hover:bg-primary-dark"
        }`}
      >
        {disabled ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  );
};

export default GiftSearchCard;