import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Smartphone, CreditCard, Banknote, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearCart } from "../../../../redux/slices/cartSlice";

import "./styles/theme.css";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";
import { useDispatch } from "react-redux";

// 1. Strict typing for the three allowed payment modes
export type PaymentMode = "COD" | "Card" | "UPI";

// 2. Configuration for the 3 direct options
const paymentMethods = [
  {
    id: "UPI",
    label: "UPI",
    description: "Pay via Google Pay, PhonePe, Paytm",
    icon: Smartphone,
    badge: "Popular"
  },
  {
    id: "Card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, RuPay, Amex",
    icon: CreditCard
  },
  {
    id: "COD",
    label: "Cash on Delivery",
    description: "Pay when your order is delivered",
    icon: Banknote
  },
] as const;

export default function Payment() {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // New state for modal

  const { postQuery } = usePostQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract necessary fields from location state, including product details if coming from Buy Now
  const {
    from,
    selectedAddressId,
    productId,
    size,
    quantity,
    totalPrice
  } = location?.state || {};

  // Handle the payment logic when the button is clicked
  const handleProceed = () => {
    setIsProcessing(true);

    if (from === "cart") {
      // --- Cart Checkout Flow ---
      postQuery({
        url: apiUrls.Cart.order,
        postData: {
          shippingAddress: selectedAddressId,
          paymentMethod: paymentMode
        },
        onSuccess: (res: any) => {
          setIsProcessing(false);
          dispatch(clearCart());
          setShowSuccessModal(true); // Show modal instead of immediate redirect
        },
        onFail: (err: any) => {
          setIsProcessing(false);
          console.error("Cart order failed:", err);
        },
      });
    } else if (from === "product") {
      // --- Single Item / Buy Now Flow ---
      postQuery({
        url: apiUrls.Orders.createOrder,
        postData: {
          productId: productId,
          size: size,
          quantity: quantity || 1,
          shippingAddress: selectedAddressId,
          paymentMethod: paymentMode
        },
        onSuccess: (res: any) => {
          setIsProcessing(false);
          setShowSuccessModal(true); // Show modal instead of immediate redirect
        },
        onFail: (err: any) => {
          setIsProcessing(false);
          console.error("Single item order failed:", err);
        },
      });
    } else {
      setIsProcessing(false);
      console.error("Unknown checkout source path.");
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-8 sm:px-8 lg:pb-16">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-[32px] leading-tight text-admin-text sm:text-[38px]">
            Choose Payment Method
          </h1>
          <p className="mt-1.5 font-body text-[14px] text-muted">
            Complete your purchase securely.
          </p>
        </div>

        <div className="space-y-6">
          {/* Direct Selection Cards */}
          <div className="flex flex-col gap-4">
            {paymentMethods.map((method: any) => {
              const Icon = method.icon;
              const isSelected = paymentMode === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMode(method.id as PaymentMode)}
                  className={`relative flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-surface hover:border-primary/40"
                    }`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${isSelected ? "bg-primary text-background" : "bg-surface-dark text-muted"
                      }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-body text-[16px] font-semibold ${isSelected ? "text-primary" : "text-heading"}`}>
                        {method.label}
                      </h3>
                      {method?.badge && (
                        <span className="rounded-full bg-rose-gold/15 px-2.5 py-0.5 font-body text-[10px] font-bold text-[#835240]">
                          {method?.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-body text-[13.5px] text-muted">
                      {method.description}
                    </p>
                  </div>

                  {/* Radio / Check Indicator */}
                  <div className="shrink-0">
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </motion.div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-border" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="mt-8 pt-4">
            <button
              type="button"
              onClick={handleProceed}
              disabled={isProcessing}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-body text-[16px] font-semibold text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:pointer-events-none disabled:opacity-75"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                `Make Payment • ₹${totalPrice?.toLocaleString("en-IN") || "0"}`
              )}
            </button>
          </div>
        </div>
      </main>

      {/* --- Success Modal Overlay --- */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm rounded-3xl bg-surface p-8 text-center shadow-2xl"
            >
              {/* Success Icon */}
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              {/* Content */}
              <h2 className="mb-2 font-heading text-[24px] font-bold text-heading">
                Order Successful!
              </h2>
              <p className="mb-8 font-body text-[14px] text-muted leading-relaxed">
                Thank you for your purchase. Your order has been placed successfully.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/profile", { replace: true })}
                  className="w-full rounded-xl bg-primary py-3.5 font-body text-[15px] font-semibold text-background transition-all hover:bg-primary-dark"
                >
                  View Details
                </button>

                <button
                  onClick={() => navigate("/", { replace: true })}
                  className="w-full rounded-xl border border-border bg-transparent py-3.5 font-body text-[15px] font-semibold text-heading transition-all hover:bg-gray-50"
                >
                  Go to Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}