import { OrderSummary } from "./OrderSummary";
import { CouponCard } from "./CouponCard";
import { PriceBreakdown } from "./PriceBreakdown";
import { SecureCheckout } from "./SecureCheckout";
import { dummyOrderItems, dummyPriceDetails } from "../data/dummyData";

/**
 * Sticky sidebar for desktop/tablet. On mobile, the parent page
 * instead renders a condensed sticky bottom bar and this component
 * is shown inline (non-sticky) above the form.
 */
export function CheckoutSidebar() {
  return (
    <aside className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_2px_24px_-8px_rgba(59,48,42,0.1)]">
      <OrderSummary items={dummyOrderItems} />
      <CouponCard />
      <PriceBreakdown details={dummyPriceDetails} />
      <div className="mt-6">
        <SecureCheckout />
      </div>
    </aside>
  );
}
