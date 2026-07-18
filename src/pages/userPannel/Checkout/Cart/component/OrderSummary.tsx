import { motion } from "motion/react";
import CouponBar from "./CouponBar";
import DonationCard from "./DonationCard";
import type { PriceDetails } from "./cart";
import { formatINR } from "./pricing";
import { Link } from 'react-router-dom';
import React from "react"; // Added React import for React.ReactNode

interface OrderSummaryProps {
  itemCount: number; // Changed from Number to number
  totalMrp: number;  // Changed from Number to number
  discountOnMrp: number; // Changed from Number to number
  totalAmount: number; // Changed from Number to number
  details: PriceDetails;
  couponApplied: boolean;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onDonationChange: (amount: number) => void;
  onPlaceOrder: () => void;
}

interface RowProps {
  label: React.ReactNode;
  value: string;
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
  onApplyCoupon,
  onRemoveCoupon,
  onDonationChange,
  onPlaceOrder,
}: OrderSummaryProps) => {
  return (
    <aside className="w-full rounded-lg border border-border bg-surface p-5 sm:p-6">
      {/* <CouponBar
        applied={couponApplied}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
      /> */}

      {/* <DonationCard onChange={onDonationChange} /> */}

      <div className="space-y-2.5 py-4">
        <p className="font-body text-xs font-semibold tracking-[0.15em] text-muted">
          PRICE DETAILS ({itemCount}{" "}
          {itemCount === 1 ? "ITEM" : "ITEMS"})
        </p>

        <Row label="Total MRP" value={formatINR(totalMrp)} />
        <Row
          label={
            <>
              Discount on MRP{" "}
              <span className="cursor-pointer text-primary">Know More</span>
            </>
          }
          value={`- ${formatINR(discountOnMrp)}`}
          valueClassName="text-success"
        />
        <Row
          label="Coupon Discount"
          value={
            couponApplied ? `- ${formatINR(details.couponDiscount)}` : "Apply Coupon"
          }
          valueClassName={couponApplied ? "text-success" : "text-primary"}
        />
        <Row
          label={
            <>
              Platform Fee <span className="text-primary">Know More</span>
            </>
          }
          value={details.platformFee === 0 ? "FREE" : formatINR(details.platformFee)}
          valueClassName="text-success"
        />
        {details.donation > 0 && (
          <Row label="Donation" value={formatINR(details.donation)} />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="font-heading text-base text-heading">Total Amount</span>
        <span className="font-heading text-lg text-heading">
          {formatINR(totalAmount)}
        </span>
      </div>

      <p className="mt-3 font-body text-xs leading-relaxed text-muted">
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
      
      {/* <Link to="/checkout/address"> */}
        <motion.button
          type="button"
          onClick={onPlaceOrder}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full rounded-md bg-primary py-3.5 font-body text-sm font-semibold tracking-[0.15em] text-background shadow-sm transition-colors hover:bg-primary-dark"
        >
          PLACE ORDER
        </motion.button>
      {/* </Link> */}
    </aside>
  );
};

export default OrderSummary;