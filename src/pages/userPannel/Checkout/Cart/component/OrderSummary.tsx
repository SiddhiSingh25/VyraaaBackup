import { motion } from "motion/react";
import type { PriceDetails } from "./cart";
import { formatINR } from "./pricing";
import React from "react";
import { useSelector } from "react-redux";

interface OrderSummaryProps {
  itemCount: number;
  totalMrp: number;
  discountOnMrp: number;
  totalAmount: number;
  details: PriceDetails;
  couponApplied: boolean;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onDonationChange: (amount: number) => void;
  onPlaceOrder: () => void;
}

interface RowProps {
  label: React.ReactNode;
  value: string | React.ReactNode;
  valueClassName?: string;
  sub?: boolean;
}

const Row = ({
  label,
  value,
  valueClassName = "text-admin-text",
  sub,
}: RowProps) => (
  <div
    className={[
      "flex items-center justify-between font-body",
      sub ? "text-sm" : "text-sm",
    ].join(" ")}
  >
    <span className="text-body">{label}</span>
    <span className={`font-medium ${valueClassName}`}>{value}</span>
  </div>
);

const OrderSummary = ({
  itemCount,
  totalMrp,
  discountOnMrp,
  totalAmount,
  details,
  couponApplied,
  onPlaceOrder,
}: OrderSummaryProps) => {
  // 1. Grab items from Redux to check availability
  const items = useSelector((state: any) => state.cart.items || []);

  // 2. Check if ANY item in the cart is unavailable
  const hasOutOfStockItems = items.some((item: any) => item.isAvailable === false);

  return (
    <aside className="w-full rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="space-y-2.5 py-4">
        <p className="font-body text-xs font-semibold tracking-[0.15em] text-muted">
          PRICE DETAILS ({itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"})
        </p>

        <Row label="Total MRP" value={formatINR(totalMrp)} />
        <Row
          label={
            <>
              Discount on MRP{" "}
              <span className="cursor-pointer text-primary text-[10px] ml-1">Know More</span>
            </>
          }
          value={`- ${formatINR(discountOnMrp)}`}
          valueClassName="text-success"
        />
        <Row
          label="Coupon Discount"
          value={
            couponApplied ? `- ${formatINR(details?.couponDiscount || 0)}` : "Apply Coupon"
          }
          valueClassName={couponApplied ? "text-success" : "text-primary cursor-pointer"}
        />
        <Row
          label={
            <>
              Platform Fee <span className="text-primary text-[10px] ml-1">Know More</span>
            </>
          }
          value={!details?.platformFee ? "FREE" : formatINR(details.platformFee)}
          valueClassName="text-success"
        />
        {details?.donation > 0 && (
          <Row label="Donation" value={formatINR(details.donation)} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
        <span className="font-heading text-base text-heading font-semibold">Total Amount</span>
        <span className="font-heading text-lg text-heading font-bold">
          {formatINR(totalAmount)}
        </span>
      </div>

      <p className="mt-4 font-body text-[11px] leading-relaxed text-muted">
        By placing the order, you agree to Vyraaa's{" "}
        <span className="cursor-pointer text-primary underline underline-offset-2">
          Terms of Use
        </span>{" "}
        and{" "}
        <span className="cursor-pointer text-primary underline underline-offset-2">
          Privacy Policy
        </span>
        .
      </p>

      {/* 3. Disable button if out of stock */}
      <motion.button
        type="button"
        onClick={hasOutOfStockItems ? undefined : onPlaceOrder}
        whileHover={!hasOutOfStockItems ? { scale: 1.01 } : undefined}
        whileTap={!hasOutOfStockItems ? { scale: 0.98 } : undefined}
        className={`mt-5 w-full rounded-md py-3.5 font-body text-sm font-semibold tracking-[0.15em] text-background shadow-sm transition-colors ${hasOutOfStockItems
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary-dark"
          }`}
      >
        {hasOutOfStockItems ? "ITEM OUT OF STOCK" : "PLACE ORDER"}
      </motion.button>
    </aside>
  );
};

export default OrderSummary;