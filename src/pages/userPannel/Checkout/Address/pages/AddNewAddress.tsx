import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {Link} from 'react-router-dom';

// These already exist in the codebase — do not recreate them.


import { AddressForm } from "../components/AddressForm";
import { CheckoutSidebar } from "../components/CheckoutSidebar";
import { dummyPriceDetails } from "../data/dummyData";
import type { AddressFormData } from "../types/address";

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AddNewAddress() {
  const [savedAddress, setSavedAddress] = useState<AddressFormData | null>(null);

  const handleSave = (address: AddressFormData) => {
    setSavedAddress(address);
    // No backend — address lives in component state for this demo.
    window.setTimeout(() => setSavedAddress(null), 3200);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background font-body">

    

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6 sm:pb-16"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <AddressForm onSave={handleSave} onCancel={handleCancel} />

          {/* Sidebar: sticky on large screens, static stacked on smaller ones */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <CheckoutSidebar />
          </div>
        </div>
      </motion.main>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted">Total</p>
            <p className="font-heading text-base text-heading">
              {formatINR(dummyPriceDetails.total)}
            </p>
          </div>
          <Link to="/checkout/payment">
            <button
            type="button"
            onClick={() => document.querySelector("form")?.requestSubmit()}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white"
          >
            Save Address
          </button></Link>
        
        </div>
      </div>

      <AnimatePresence>
        {savedAddress && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-dark px-5 py-3 text-sm text-white shadow-lg sm:bottom-8"
          >
            <CheckCircle2 size={16} className="text-success" />
            Address saved successfully
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
