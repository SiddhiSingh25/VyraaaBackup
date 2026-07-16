import type { PriceDetails } from "../types/address";

interface PriceBreakdownProps {
  details: PriceDetails;
}

function formatINR(amount: number) {
  if (amount === 0) return "Free";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function PriceBreakdown({ details }: PriceBreakdownProps) {
  const rows: { label: string; value: string; muted?: boolean }[] = [
    { label: "Subtotal", value: formatINR(details.subtotal) },
    { label: "Shipping", value: formatINR(details.shipping), muted: true },
    { label: "Discount", value: `− ${formatINR(details.discount)}` },
    { label: "Tax", value: formatINR(details.tax), muted: true },
  ];

  return (
    <div className="border-t border-border pt-5">
      <div className="space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-muted">{row.label}</span>
            <span className={row.label === "Discount" ? "text-success" : "text-body"}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-heading text-base text-admin-text">Total</span>
        <span className="font-heading text-lg text-admin-text">
          {formatINR(details.total)}
        </span>
      </div>
    </div>
  );
}
