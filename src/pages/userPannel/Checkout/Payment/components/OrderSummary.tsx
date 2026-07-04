import { MapPin } from "lucide-react";
import type { Address, Product } from "../types";

interface OrderSummaryProps {
  products: Product[];
  address: Address;
  onChangeAddress?: () => void;
}

export default function OrderSummary({ products, address, onChangeAddress }: OrderSummaryProps) {
  return (
    <div className=" space-y-5">
      {/* Delivery Address */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-body text-[13.5px] font-semibold text-heading">
                {address.name}
              </p>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-[10px] font-semibold text-primary">
                {address.type}
              </span>
            </div>
            <p className="mt-0.5 font-body text-[12.5px] leading-snug text-muted">
              {address.line1}, {address.line2}, {address.city}, {address.state} –{" "}
              {address.pincode}
            </p>
            <p className="font-body text-[12.5px] text-muted">{address.phone}</p>
          </div>
        </div>
        <button
          onClick={onChangeAddress}
          className="mt-3 w-full rounded-lg border border-border py-2 font-body text-[12.5px] font-medium text-primary transition-colors hover:bg-card"
        >
          Change Address
        </button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-16 shrink-0 rounded-lg border border-border object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-body text-[13px] font-medium leading-snug text-heading">
                {product.name}
              </p>
              <p className="mt-1 font-body text-[11.5px] text-muted">
                {product.color} · Size {product.size} · Qty {product.qty}
              </p>
              <p className="mt-1 font-body text-[13px] font-semibold text-heading">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
