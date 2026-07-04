import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconTag } from "./icons";

interface CouponBarProps {
  applied: boolean;
  onApply: (code: string) => void;
  onRemove: () => void;
}

const CouponBar = ({ applied, onApply, onRemove }: CouponBarProps) => {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border pb-4">
      <p className="mb-2 font-body text-xs font-semibold tracking-[0.15em] text-muted">
        COUPONS
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-body text-sm text-heading">
          <IconTag className="h-4 w-4 text-primary" />
          <span>{applied ? "VYRAAA10 applied" : "Apply Coupons"}</span>
        </div>
        <button
          type="button"
          onClick={() => (applied ? onRemove() : setOpen((o) => !o))}
          className="rounded border border-primary px-4 py-1.5 font-body text-xs font-semibold tracking-wide text-primary transition-colors hover:bg-primary hover:text-background"
        >
          {applied ? "REMOVE" : "APPLY"}
        </button>
      </div>

      <AnimatePresence>
        {open && !applied && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 rounded border border-border bg-background px-3 py-2 font-body text-sm text-heading placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  if (code.trim()) {
                    onApply(code.trim());
                    setOpen(false);
                  }
                }}
                className="rounded bg-primary px-4 py-2 font-body text-xs font-semibold tracking-wide text-background transition-colors hover:bg-primary-dark"
              >
                APPLY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponBar;
