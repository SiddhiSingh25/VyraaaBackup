import { Button } from "../../../../components/ui/FormElements";
import useSizeValueData from "../api/useSizeValueData";
import type { DraftVariant, Option } from "../types";

type VariantDraftFormProps = {
  draftVariant: DraftVariant;
  setDraftVariant: (draft: DraftVariant) => void;
  sizeOptions: Option[];
  sizeTypeSelected: any;
  onAdd: () => void;
  onCancel: () => void;
};

const VariantDraftForm = ({
  draftVariant,
  setDraftVariant,
  sizeOptions,
  sizeTypeSelected,
  onAdd,
  onCancel,
}: VariantDraftFormProps) => {
  // Updated validation: Only requires Size and a valid Price
  const isValid =
    sizeTypeSelected &&
    draftVariant.size.label !== "" &&
    Number(draftVariant.price) > 0;

  const { sizeValueOptions } = useSizeValueData(sizeTypeSelected);

  return (
    <div className="mb-6 rounded-xl border border-primary-light bg-card/80 p-5 shadow-sm transition-all">
      {/* Top Row: 2-Column Grid for main attributes */}
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Size Selection */}
        <div className="w-full">
          <label
            htmlFor="variant-size"
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
          >
            Size <span className="text-red-500">*</span>
          </label>
          <select
            id="variant-size"
            value={draftVariant.size.value}
            onChange={(e) => {
              const selected = sizeValueOptions.find(
                (option) => option.value === e.target.value,
              );

              if (selected) {
                setDraftVariant({
                  ...draftVariant,
                  size: {
                    value: selected.value,
                    label: selected.label,
                  },
                });
              }
            }}
            disabled={!sizeTypeSelected}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" disabled>
              Select Size
            </option>

            {sizeValueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {!sizeTypeSelected && (
            <p className="mt-1 text-[10px] text-red-500">
              Please select a size type first
            </p>
          )}
        </div>

        {/* Price Input */}
        <div className="w-full">
          <label
            htmlFor="variant-price"
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
          >
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            id="variant-price"
            type="number"
            min={0}
            value={draftVariant.price}
            onChange={(e) =>
              setDraftVariant({ ...draftVariant, price: e.target.value })
            }
            placeholder="0.00"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      {/* Bottom Row: Discounts, Toggles, and Actions */}
      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-border/70 bg-surface/50 p-4 md:flex-row md:items-end md:justify-between">
        {/* Left Side: Discount & Toggles */}
        <div className="flex flex-1 flex-wrap items-center gap-6">
          <div className="min-w-[140px] flex-1 md:max-w-[200px]">
            <label
              htmlFor="variant-discount"
              className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted"
            >
              Discount (₹)
            </label>
            <input
              id="variant-discount"
              type="number"
              min={0}
              value={draftVariant.discountPrice}
              onChange={(e) =>
                setDraftVariant({
                  ...draftVariant,
                  discountPrice: e.target.value,
                })
              }
              placeholder="Optional"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none transition-colors focus:border-primary"
            />
          </div>

          {/* Checkboxes grouped together */}
          <div className="flex gap-5 pb-1 md:pb-2">
            <label
              htmlFor="variant-available"
              className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-heading hover:text-primary transition-colors"
            >
              <input
                id="variant-available"
                type="checkbox"
                checked={draftVariant.isAvailable}
                onChange={(e) =>
                  setDraftVariant({
                    ...draftVariant,
                    isAvailable: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded accent-primary text-primary focus:ring-primary focus:ring-offset-1"
              />
              Available
            </label>

            <label
              htmlFor="variant-few-left"
              className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-heading hover:text-primary transition-colors"
            >
              <input
                id="variant-few-left"
                type="checkbox"
                checked={draftVariant.isFewLeft}
                onChange={(e) =>
                  setDraftVariant({
                    ...draftVariant,
                    isFewLeft: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded accent-primary text-primary focus:ring-primary focus:ring-offset-1"
              />
              Few Left
            </label>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex shrink-0 gap-3 pt-2 md:pt-0">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="px-5 py-2 text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onAdd}
            disabled={!isValid}
            className="px-5 py-2 text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
          >
            Add to Listing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VariantDraftForm;
