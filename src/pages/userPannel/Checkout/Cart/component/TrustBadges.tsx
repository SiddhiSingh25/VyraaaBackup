import { IconShield } from "./icons";

const paymentMarks = [
  "VISA",
  "Mastercard",
  "RuPay",
  "UPI",
  "Net Banking",
  "PayPal",
];

const TrustBadges = () => (
  <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-1.5 text-muted">
      <IconShield className="h-3.5 w-3.5" />
      <span className="font-body text-[11px] tracking-wide">256-bit SSL secured</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {paymentMarks.map((mark) => (
        <span
          key={mark}
          className="rounded border border-border bg-background px-2 py-1 font-body text-[10px] font-medium tracking-wide text-muted"
        >
          {mark}
        </span>
      ))}
    </div>
  </div>
);

export default TrustBadges;
