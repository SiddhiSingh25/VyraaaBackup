import { PackageCheck, Truck, IndianRupee } from "lucide-react";

export default function CODSection() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <PackageCheck className="h-5 w-5 text-primary" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-heading text-[19px] text-admin-text">
            Cash on Delivery Available
          </p>
          <p className="mt-1 font-body text-[13.5px] leading-relaxed text-muted">
            Pay in cash when your order arrives at your doorstep. Please keep exact
            change ready to help our delivery partner serve you faster.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5">
          <IndianRupee className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <div>
            <p className="font-body text-[12px] text-muted">Additional Handling Fee</p>
            <p className="font-body text-[14px] font-semibold text-admin-text">₹49</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5">
          <Truck className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <div>
            <p className="font-body text-[12px] text-muted">Estimated Delivery</p>
            <p className="font-body text-[14px] font-semibold text-admin-text">3–5 Days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
