import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ChevronDown } from "lucide-react";
import PaymentMethodSidebar from "./components/PaymentMethodSidebar";
import PaymentMethodCard from "./components/PaymentMethodCard";
import CreditCardForm from "./components/CreditCardForm";
import UPISection from "./components/UPISection";
import WalletSection from "./components/WalletSection";
import NetBankingSection from "./components/NetBankingSection";
import EMISection from "./components/EMISection";
import CODSection from "./components/CODSection";
import GiftCardSection from "./components/GiftCardSection";
import OrderSummary from "./components/OrderSummary";
import PriceBreakdown from "./components/PriceBreakdown";
import CouponCard from "./components/CouponCard";
import TrustCard from "./components/TrustCard";
import StickyCheckoutBar from "./components/StickyCheckoutBar";

import {
  paymentCategories,
  offers,
  cardBrands,
  upiApps,
  wallets,
  banks,
  emiPlans,
  products,
  priceBreakdown,
  address,
} from "./data/dummyData";
import type { PaymentCategoryId } from "./types";

import "./styles/theme.css";
import Navbar from "../../../../components/Header/Navbar";
import Footer from "../../../../components/Footer/Footer";
export default function Payment() {
  const [activeCategory, setActiveCategory] = useState<PaymentCategoryId>("recommended");
  const [selectedOption, setSelectedOption] = useState<string>("cod-recommended");
  const [isProcessing, setIsProcessing] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<PaymentCategoryId | null>(
    "recommended"
  );

  const handleProceed = () => {
    setIsProcessing(true);
    window.setTimeout(() => setIsProcessing(false), 1800);
  };

  const renderCategoryContent = (categoryId: PaymentCategoryId) => {
    switch (categoryId) {
      case "recommended":
        return (
          <div className="space-y-3">
            <PaymentMethodCard
              title="UPI — Google Pay"
              description="Fast, secure, and free. No extra charges."
              recommended
              selected={selectedOption === "rec-upi"}
              onSelect={() => setSelectedOption("rec-upi")}
              logo={<span className="font-body text-[10px] font-bold text-primary">GP</span>}
            />
            <PaymentMethodCard
              title="Credit / Debit Card"
              description="Visa, Mastercard, RuPay & Amex accepted"
              selected={selectedOption === "rec-card"}
              onSelect={() => setSelectedOption("rec-card")}
              logo={<span className="font-body text-[9px] font-bold text-primary">VISA</span>}
            />
            <PaymentMethodCard
              title="Cash on Delivery"
              description="Pay when your order is delivered"
              selected={selectedOption === "cod-recommended"}
              onSelect={() => setSelectedOption("cod-recommended")}
            />
          </div>
        );
      case "upi":
        return <UPISection apps={upiApps} />;
      case "card":
        return (
          <div>
            <PaymentMethodCard
              title="Credit / Debit Card"
              description="Visa · Mastercard · RuPay · American Express supported"
              selected
              onSelect={() => {}}
            />
            <CreditCardForm brands={cardBrands} />
          </div>
        );
      case "wallets":
        return <WalletSection wallets={wallets} />;
      case "netbanking":
        return <NetBankingSection banks={banks} />;
      case "emi":
        return <EMISection plans={emiPlans} />;
      case "cod":
        return <CODSection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar/> */}

      {/* <CheckoutProgress currentStep={2} /> */}

      <main className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 lg:pb-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-[32px] leading-tight text-heading sm:text-[38px]">
            Choose Payment Method
          </h1>
          <p className="mt-1.5 font-body text-[14px] text-muted">
            Complete your purchase securely.
          </p>
        </div>

        {/* <OfferCarousel offers={offers} /> */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
          {/* Left: Payment Methods (70%) */}
          <div className="lg:col-span-7">
            {/* Desktop / Tablet: sidebar + content */}
            <div className="hidden gap-6 sm:grid sm:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
              <PaymentMethodSidebar
                categories={paymentCategories}
                activeId={activeCategory}
                onSelect={setActiveCategory}
              />

              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {renderCategoryContent(activeCategory)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: expandable accordions */}
            <div className="space-y-2.5 sm:hidden">
              {paymentCategories.map((cat) => {
                const isOpen = openMobileAccordion === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="overflow-hidden rounded-2xl border border-border bg-surface"
                  >
                    <button
                      onClick={() => setOpenMobileAccordion(isOpen ? null : cat.id)}
                      className="flex w-full items-center justify-between px-4 py-4"
                    >
                      <span className="font-body text-[14px] font-semibold text-heading">
                        {cat.label}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">{renderCategoryContent(cat.id)}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <GiftCardSection />
            </div>
          </div>

          {/* Right: Sticky Order Summary (30%) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-6  shrink-0 sticky self-start" >
            <div className="space-y-5 ">
              <OrderSummary products={products} address={address} />
              <PriceBreakdown breakdown={priceBreakdown} />
              <CouponCard />
              <TrustCard />

              {/* Desktop CTA */}
              <button
                onClick={handleProceed}
                disabled={isProcessing}
                className="vyraaa-card-shadow-lifted hidden w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-body text-[15px] font-semibold text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 lg:flex"
              >
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                Proceed to Review →
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <StickyCheckoutBar
        total={priceBreakdown.total}
        onProceed={handleProceed}
        loading={isProcessing}
      />

      {/* <Footer/> */}
    </div>
  );
}
