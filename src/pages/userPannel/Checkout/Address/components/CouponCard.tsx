import { useState } from "react";
import { Tag, Check } from "lucide-react";

export function CouponCard() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    setApplied(true);
  };

  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-center gap-2 text-sm font-medium text-admin-text">
        <Tag size={15} className="text-primary" strokeWidth={1.75} />
        Apply Coupon
      </div>

      {applied ? (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-surface px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm text-success">
            <Check size={15} strokeWidth={2.5} />
            <span>&ldquo;{code.toUpperCase()}&rdquo; applied</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setApplied(false);
              setCode("");
            }}
            className="text-xs font-medium text-muted underline underline-offset-2 hover:text-primary"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mt-3 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-admin-text outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleApply}
            className="shrink-0 rounded-xl border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
