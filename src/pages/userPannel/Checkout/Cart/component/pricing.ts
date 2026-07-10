import type { CartItem, PriceDetails } from "./cart";

// Safely format an INR amount. If `value` is undefined/null or not a number,
// fall back to 0 to avoid runtime `toLocaleString` errors.
export const formatINR = (value?: number | null): string => {
  const v = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  return `₹${v.toLocaleString("en-IN")}`;
};

// Defensive discount calculation: if inputs are missing or invalid, return 0.
export const discountPercent = (mrp?: number | null, price?: number | null): number => {
  const m = typeof mrp === "number" && mrp > 0 ? mrp : 0;
  const p = typeof price === "number" && !Number.isNaN(price) ? price : 0;
  if (m <= 0) return 0;
  return Math.round(((m - p) / m) * 100);
};

export const computePriceDetails = (
  items: CartItem[],
  couponDiscount: number,
  donation: number
): PriceDetails => {
  const selected = items.filter((item) => item.selected);
  const totalMrp = selected.reduce((sum, i) => sum + i.mrp * i.qty, 0);
  const totalPrice = selected.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountOnMrp = totalMrp - totalPrice;
  const platformFee = 0;

  return {
    itemCount: selected.length,
    totalMrp,
    discountOnMrp,
    couponDiscount,
    platformFee,
    donation,
    totalAmount: totalMrp - discountOnMrp - couponDiscount + platformFee + donation,
  };
};
