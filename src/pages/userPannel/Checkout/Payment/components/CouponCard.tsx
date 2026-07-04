import { useState } from "react";
import { Tag, CheckCircle2 } from "lucide-react";

export default function CouponCard() {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    setApplied(true);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" strokeWidth={1.75} />
        <span className="font-body text-[13.5px] font-semibold text-heading">
          Apply Coupon
        </span>
      </div>

      {applied ? (
        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3.5 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span className="font-body text-[13px] font-medium text-success">
            “{code.toUpperCase()}” applied successfully
          </span>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 font-body text-[13px] text-heading outline-none transition-colors focus:border-primary"
          />
          <button
            onClick={handleApply}
            disabled={!code.trim()}
            className="rounded-xl border border-primary px-4 py-2.5 font-body text-[12.5px] font-semibold text-primary transition-opacity disabled:opacity-40"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
