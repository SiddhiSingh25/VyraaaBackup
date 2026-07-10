import { motion } from "motion/react";

import CouponBar from "./CouponBar";
import DonationCard from "./DonationCard";
import type { PriceDetails } from "./cart";
import { formatINR } from "./pricing";
import {Link} from 'react-router-dom';

interface OrderSummaryProps {
  details: PriceDetails;
  couponApplied: boolean;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  onDonationChange: (amount: number) => void;
  onPlaceOrder: () => void;
}

const Row = ({
  label,
  value,
  valueClassName = "text-admin-text",
  sub,
}: {
  label: React.ReactNode;
  value: string;
  valueClassName?: string;
  sub?: boolean;
}) => (
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
  details,
  couponApplied,
  onApplyCoupon,
  onRemoveCoupon,
  onDonationChange,
  onPlaceOrder,
}: OrderSummaryProps) => {
  return (
    <aside className="w-full rounded-lg border border-border bg-surface p-5 sm:p-6">
      <CouponBar
        applied={couponApplied}
        onApply={onApplyCoupon}
        onRemove={onRemoveCoupon}
      />

      <DonationCard onChange={onDonationChange} />

      <div className="space-y-2.5 py-4">
        <p className="font-body text-xs font-semibold tracking-[0.15em] text-muted">
          PRICE DETAILS ({details.itemCount}{" "}
          {details.itemCount === 1 ? "ITEM" : "ITEMS"})
        </p>

        <Row label="Total MRP" value={formatINR(details.totalMrp)} />
        <Row
          label={
            <>
              Discount on MRP{" "}
              <span className="cursor-pointer text-primary">Know More</span>
            </>
          }
          value={`- ${formatINR(details.discountOnMrp)}`}
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
        <span className="font-heading text-base text-admin-text">Total Amount</span>
        <span className="font-heading text-lg text-admin-text">
          {formatINR(details.totalAmount)}
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
      <Link to="/checkout/address">
      <motion.button
        type="button"
        onClick={onPlaceOrder}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full rounded-md bg-primary py-3.5 font-body text-sm font-semibold tracking-[0.15em] text-background shadow-sm transition-colors hover:bg-primary-dark"
      >
        PLACE ORDER
      </motion.button>
      </Link>
    </aside>
  );
};

export default OrderSummary;
