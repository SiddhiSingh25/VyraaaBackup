import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Shield, Truck, RefreshCcw } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")} `;
}

const BADGES = [
  { icon: Shield, label: "Genuine Products" },
  { icon: Truck, label: "Fast & Free Delivery" },
  { icon: RefreshCcw, label: "Easy Returns & Exchanges" },
];

interface CheckoutSidebarProps {
  from: string;
  productId?: string;
  size?: string; // size ID sent from product details page
  quantity?: number;
  selectedAddressId?: string | null;
  totalPrice?: number;
  onTotalChange?: (total: number) => void;
}

// ==========================================
// SHIMMER SKELETON COMPONENT
// ==========================================
const SidebarShimmer = () => (
  <div className="animate-pulse">
    {/* Title Shimmer */}
    <div className="h-6 w-32 bg-border/40 rounded mb-2"></div>
    <div className="h-3 w-16 bg-border/40 rounded mb-5"></div>

    {/* Items List Shimmer */}
    <div className="space-y-5">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-20 w-16 shrink-0 rounded-lg bg-border/40"></div>
          <div className="flex flex-1 flex-col justify-between py-1">
            <div>
              <div className="h-4 w-3/4 bg-border/40 rounded mb-2.5"></div>
              <div className="h-3 w-1/2 bg-border/40 rounded"></div>
            </div>
            <div className="h-4 w-1/4 bg-border/40 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Price Breakdown Shimmer */}
    <div className="border-t border-border pt-5 mt-5 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="h-4 w-24 bg-border/40 rounded"></div>
          <div className="h-4 w-16 bg-border/40 rounded"></div>
        </div>
      ))}
    </div>

    {/* Total Row Shimmer */}
    <div className="mt-4 flex items-center justify-between border-y border-border py-4">
      <div className="h-5 w-12 bg-border/40 rounded"></div>
      <div className="h-6 w-24 bg-border/40 rounded"></div>
    </div>

    {/* Button Shimmer */}
    <div className="mt-5 h-[44px] w-full rounded-xl bg-border/40"></div>
  </div>
);
// ==========================================

export default function CheckoutSidebar({
  from,
  productId,
  size,
  quantity = 1,
  selectedAddressId,
  totalPrice,
  onTotalChange,
}: CheckoutSidebarProps) {
  const [items, setItems] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    itemCount: 0,
    totalMrp: 0,
    totalAmount: 0,
    discountOnMrp: 0,
  });

  const cartReduxItems = useSelector((state: any) => state.cart.items || []);

  // Destructured `loading` state directly from your custom hook
  const { getQuery, loading } = useGetQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (from === "cart") {
      // 1. Fetch Cart Data
      getQuery({
        url: apiUrls.Cart.getByUserId,
        onSuccess: (res: any) => {
          if (res.data) {
            setItems(cartReduxItems.length > 0 ? cartReduxItems : res.data.items || []);
            const nextTotals = {
              itemCount: res.data.totalItems || 0,
              totalMrp: res.data.cartTotalMarkupPrice || 0,
              totalAmount: res.data.cartTotalAmount || 0,
              discountOnMrp: res.data.cartTotalDiscount || 0,
            };
            setTotals(nextTotals);
            onTotalChange?.(nextTotals.totalAmount);
          }
        },
        onFail: (err: any) => {
          console.error("Failed to fetch cart totals:", err);
        },
      });
    } else if (from === "product" && productId) {
      // 2. Fetch Single Product Data for "Buy Now" flow
      getQuery({
        url: `${apiUrls.Product.getById}${productId} `,
        onSuccess: (res: any) => {
          if (res.data) {
            const product = res.data;

            // Match the provided size ID with product.price array
            const matchedPriceObj = product.price.find(
              (p: any) => String(p.size._id) === String(size) || String(p._id) === String(size)
            );

            const unitAmount = matchedPriceObj ? matchedPriceObj.amount : product.price?.[0]?.amount || 0;
            const unitMarkup = matchedPriceObj ? matchedPriceObj.markupPrice : product.price?.[0]?.markupPrice || unitAmount;
            const itemQty = quantity || 1;

            const totalMrpCalc = unitMarkup * itemQty;
            const totalAmountCalc = unitAmount * itemQty;
            const discountCalc = totalMrpCalc - totalAmountCalc;

            // Format single item to match display list structure
            const singleFormattedItem = {
              id: product._id,
              name: product.title,
              image: product.image,
              color: product.color,
              brand: product.brand,
              size: matchedPriceObj ? matchedPriceObj.size.size : "Standard",
              quantity: itemQty,
              price: totalAmountCalc,
            };

            setItems([singleFormattedItem]);
            const nextTotals = {
              itemCount: itemQty,
              totalMrp: totalMrpCalc,
              totalAmount: totalAmountCalc,
              discountOnMrp: discountCalc > 0 ? discountCalc : 0,
            };
            setTotals(nextTotals);
            onTotalChange?.(nextTotals.totalAmount);
          }
        },
        onFail: (err: any) => {
          console.error("Failed to fetch product for checkout:", err);
        },
      });
    }
  }, [from, productId, size, quantity]);

  const rows = [
    { label: "Total MRP", value: formatINR(totals.totalMrp) },
    { label: "Discount", value: `- ${formatINR(totals.discountOnMrp)} ` },
    { label: "Delivery Charges", value: "FREE" },
  ];

  return (
    <aside className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_2px_24px_-8px_rgba(59,48,42,0.1)]">
      {loading ? (
        <SidebarShimmer />
      ) : (
        <div>
          <h2 className="font-heading text-lg text-admin-text">Order Summary</h2>
          <p className="mt-1 text-xs text-muted">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
          </p>

          {/* --- ITEMS LIST --- */}
          <ul className="mt-5 space-y-5">
            {items.map((item: any) => (
              <li key={item.cartItemId || item.id} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-admin-text line-clamp-1">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.color || item.brand} · Size: {item.size} · Qty: {item.quantity || item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-admin-text">
                    {formatINR(item.price || item.basePrice || 0)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* --- PRICE BREAKDOWN --- */}
          <div className="border-t border-border pt-5 mt-5">
            <div className="space-y-2.5">
              {rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted">{row.label}</span>
                  <span className={row.label === "Discount" ? "text-success font-medium" : "text-body font-medium"}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-y border-border py-4">
              <span className="font-heading text-base text-admin-text">Total</span>
              <span className="font-heading text-lg text-admin-text">
                {formatINR(totals.totalAmount)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!selectedAddressId) {
                  alert("Please select an address first!");
                  return;
                }
                navigate(`/checkout/payment`, {
                  state: {
                    from,
                    selectedAddressId,
                    productId,
                    size,
                    totalPrice: totalPrice ?? totals.totalAmount,
                  },
                });
              }}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Go to Payment
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}