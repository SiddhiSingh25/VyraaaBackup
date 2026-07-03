import type { CartItem, PriceDetails } from "../types/cart";

export const formatINR = (value: number): string =>
  `₹${value.toLocaleString("en-IN")}`;

export const discountPercent = (mrp: number, price: number): number =>
  Math.round(((mrp - price) / mrp) * 100);

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
