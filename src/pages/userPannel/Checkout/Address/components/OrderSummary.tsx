import type { OrderItem } from "../types/address";

interface OrderSummaryProps {
  items: OrderItem[];
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <div>
      <h2 className="font-heading text-lg text-heading">Order Summary</h2>
      <p className="mt-1 text-xs text-muted">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      <ul className="mt-5 space-y-5">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-heading">{item.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {item.color} · Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium text-heading">
                {formatINR(item.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
