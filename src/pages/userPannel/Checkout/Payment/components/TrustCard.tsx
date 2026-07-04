import { ShieldCheck, Lock, RotateCcw, Truck, Headset } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "100% Secure Payments" },
  { icon: Lock, label: "SSL Encrypted" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Truck, label: "Trusted Delivery" },
  { icon: Headset, label: "24×7 Customer Support" },
];

export default function TrustCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="grid grid-cols-1 gap-3">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
            <span className="font-body text-[12.5px] text-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
