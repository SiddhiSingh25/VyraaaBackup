import type { PriceBreakdown as PriceBreakdownType } from "../types";

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
}

function Row({
  label,
  value,
  isDiscount,
  isFree,
}: {
  label: string;
  value: number;
  isDiscount?: boolean;
  isFree?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-[13.5px] text-body">{label}</span>
      <span
        className={`font-body text-[13.5px] font-medium ${
          isDiscount ? "text-success" : "text-heading"
        }`}
      >
        {isFree ? "FREE" : `${isDiscount ? "−" : ""}₹${value.toLocaleString("en-IN")}`}
      </span>
    </div>
  );
}

export default function PriceBreakdown({ breakdown }: PriceBreakdownProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-4 font-body text-[12px] font-semibold uppercase tracking-widest text-muted">
        Price Details
      </p>

      <div className="space-y-2.5">
        <Row label="Subtotal" value={breakdown.subtotal} />
        <Row label="Discount" value={breakdown.discount} isDiscount />
        <Row label="Shipping" value={breakdown.shipping} isFree={breakdown.shipping === 0} />
        <Row label="Platform Fee" value={breakdown.platformFee} />
        <Row label="Tax" value={breakdown.tax} />
      </div>

      <div className="my-4 h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-[17px] text-heading">Total Amount</span>
        <span className="font-heading text-[22px] text-heading">
          ₹{breakdown.total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
