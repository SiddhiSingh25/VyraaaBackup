import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ShieldCheck, Shield, Truck, RefreshCcw } from "lucide-react";
import useGetQuery from "@/hooks/getQuery.hook"; // Adjust path if needed
import { apiUrls } from "@/apis"; // Adjust path if needed

// Utility for formatting currency
function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const BADGES = [
  { icon: Shield, label: "Genuine Products" },
  { icon: Truck, label: "Fast & Free Delivery" },
  { icon: RefreshCcw, label: "Easy Returns & Exchanges" },
];

export function CheckoutSidebar(props: any) {
  const fromProp = props.from;

  // 1. Get items from Redux purely for rendering the visual list 
  const items = useSelector((state: any) => state.cart.items || []);

  // 2. Local state to hold the EXACT totals calculated by your backend API
  const [totals, setTotals] = useState({
    itemCount: 0,
    totalMrp: 0,
    totalAmount: 0,
    discountOnMrp: 0,
  });

  const { getQuery } = useGetQuery();

  // 3. Fetch exact math from the database to prevent Redux calculation bugs
  useEffect(() => {
    // Only fetch totals if we are supposed to show them (based on your fromProp logic)
    if (fromProp !== "cart") {
      setTotals({ itemCount: 0, totalMrp: 0, totalAmount: 0, discountOnMrp: 0 });
      return;
    }

    getQuery({
      url: apiUrls.Cart.getByUserId,
      onSuccess: (res: any) => {
        if (res.data) {
          // Map the exact JSON fields from your API response
          setTotals({
            itemCount: res.data.totalItems || 0,
            totalMrp: res.data.cartTotalMarkupPrice || 0,
            totalAmount: res.data.cartTotalAmount || 0,
            discountOnMrp: res.data.cartTotalDiscount || 0,
          });
        }
      },
      onFail: (err: any) => {
        console.error("Failed to fetch cart totals for sidebar:", err);
      },
    });
  }, [fromProp]);

  // 4. Dynamically generate the rows using the API's totals
  const rows = [
    { label: "Total MRP", value: formatINR(totals.totalMrp) },
    { label: "Discount", value: `- ${formatINR(totals.discountOnMrp)}` },
    { label: "Delivery Charges", value: "FREE" },
  ];

  return (
    <aside className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_2px_24px_-8px_rgba(59,48,42,0.1)]">
      <div>
        <h2 className="font-heading text-lg text-admin-text">Order Summary</h2>
        <p className="mt-1 text-xs text-muted">
          {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
        </p>

        {/* --- CART ITEMS LIST (Uses Redux for fast UI mapping) --- */}
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
      </div>

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

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-heading text-base text-admin-text">Total</span>
          <span className="font-heading text-lg text-admin-text">
            {formatINR(totals.totalAmount)}
          </span>
        </div>
      </div>

      {/* --- TRUST BADGES --- */}
      <div className="mt-6">
        <div className="rounded-2xl bg-surface p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" strokeWidth={1.75} />
            <p className="text-sm font-medium text-admin-text">100% Secure Checkout</p>
          </div>
          <ul className="mt-3 space-y-2">
            {BADGES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-xs text-muted">
                <Icon size={13} strokeWidth={1.75} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}