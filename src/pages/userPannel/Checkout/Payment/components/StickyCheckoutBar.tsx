import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface StickyCheckoutBarProps {
  total: number;
  onProceed: () => void;
  loading?: boolean;
  ctaLabel?: string;
}

export default function StickyCheckoutBar({
  total,
  onProceed,
  loading,
  ctaLabel = "Proceed to Review",
}: StickyCheckoutBarProps) {
  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-border bg-background/95 px-5 py-3.5 backdrop-blur-sm lg:hidden"
      style={{ boxShadow: "0 -8px 24px -12px rgba(59,48,42,0.18)" }}
    >
      <div>
        <p className="font-body text-[11px] text-muted">Total Amount</p>
        <p className="font-heading text-[19px] text-admin-text">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>
      <button
        onClick={onProceed}
        disabled={loading}
        className="flex flex-1 max-w-[220px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-body text-[14px] font-semibold text-background shadow-sm transition-transform active:scale-[0.98]"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {ctaLabel} →
      </button>
    </motion.div>
  );
}
