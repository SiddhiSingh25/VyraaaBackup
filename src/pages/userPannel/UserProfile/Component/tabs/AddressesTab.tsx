import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import type { Address } from "../account";

interface AddressesTabProps {
  addresses: Address[];
  onAddNew: () => void;
}

export function AddressesTab({
  addresses,
  onAddNew,
}: AddressesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <MapPin size={16} className="text-muted-foreground" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-heading">
                  {addr.fullName}
                </h3>

                <p className="text-xs text-muted">
                  {addr.label}
                </p>
              </div>
            </div>

            {addr.isDefault && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary whitespace-nowrap">
                Default
              </span>
            )}
          </div>

          {/* Address */}
          <div className="mt-3 text-sm leading-5 text-body">
            <p>
              {addr.line1}
              {addr.line2 && `, ${addr.line2}`}
            </p>

            <p>
              {addr.city}, {addr.state} {addr.pincode}
            </p>

            <p>{addr.phone}</p>
          </div>

          {/* Actions */}
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-heading transition-colors hover:bg-muted"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 size={14} />
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add Address */}
      <button
        type="button"
        onClick={onAddNew}
        className="flex min-h-[170px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface transition-colors hover:border-primary hover:bg-primary/5"
      >
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Plus size={18} className="text-primary" />
        </div>

        <h3 className="text-sm font-semibold text-heading">
          Add Address
        </h3>

        <p className="mt-1 text-xs text-muted">
          Save a new delivery address
        </p>
      </button>
    </div>
  );
}