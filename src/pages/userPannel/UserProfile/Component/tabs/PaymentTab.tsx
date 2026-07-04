import type { PaymentMethod } from "../account";

interface PaymentTabProps {
  methods: PaymentMethod[];
  onAddNew: () => void;
}

export function PaymentTab({ methods, onAddNew }: PaymentTabProps) {
  return (
    <div className="flex flex-col gap-4">
      {methods.map((pm) => (
        <div
          key={pm.id}
          className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary-light transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-9 rounded-md bg-dark text-background flex items-center justify-center text-[10px] font-semibold tracking-wide shrink-0">
              {pm.brand.slice(0, 4).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-heading">
                &bull;&bull;&bull;&bull; {pm.last4}
              </p>
              <p className="text-xs text-muted mt-0.5">Expires {pm.expiry}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {pm.isDefault && (
              <span className="text-xs font-medium text-primary-dark bg-card px-2.5 py-1 rounded-full">
                Default
              </span>
            )}
            <button
              type="button"
              className="text-xs font-medium text-error border border-border rounded-lg px-3 py-1.5 hover:bg-card transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddNew}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-muted hover:border-primary-light hover:text-primary transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
        <span className="text-sm font-medium">Add new payment method</span>
      </button>

      <p className="text-xs text-muted flex items-center gap-1.5 mt-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="5" y="11" width="14" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
        Payments are encrypted and stored securely.
      </p>
    </div>
  );
}
