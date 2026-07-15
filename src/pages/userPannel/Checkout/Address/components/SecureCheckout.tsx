import { ShieldCheck, Lock, RotateCcw, Truck } from "lucide-react";

const BADGES = [
  { icon: Lock, label: "SSL Encrypted Payments" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Truck, label: "Trusted Delivery" },
];

export function SecureCheckout() {
  return (
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
  );
}
