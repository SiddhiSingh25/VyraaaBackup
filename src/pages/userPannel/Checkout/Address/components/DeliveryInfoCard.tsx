import { Package } from "lucide-react";

export function DeliveryInfoCard() {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-surface px-5 py-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card text-primary">
        <Package size={17} strokeWidth={1.75} />
      </span>
      <p className="text-sm leading-relaxed text-body">
        Orders will be delivered between{" "}
        <span className="font-medium text-heading">9 AM – 8 PM</span>. Please
        ensure someone is available to receive the package.
      </p>
    </div>
  );
}
