import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/FormElements";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";
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

type VariantDraftFormValues = {
  size: string;
};

const VariantDraftForm = ({
  draftVariant,
  setDraftVariant,
  sizeOptions,
  sizeTypeSelected,
  onAdd,
  onCancel,
}: VariantDraftFormProps) => {
  const { control, watch, reset, setValue } = useForm<VariantDraftFormValues>({
    defaultValues: { size: draftVariant.size.value || "" },
  });

  const selectedSize = watch("size");

  useEffect(() => {
    reset({ size: draftVariant.size.value || "" });
  }, [draftVariant.size.value, reset]);

  const isValid =
    sizeTypeSelected && selectedSize !== "" && Number(draftVariant.price) > 0;

  const { sizeValueOptions, addSizeValue } = useSizeValueData(sizeTypeSelected);

  const handleAddSize = (query: string) => {
    addSizeValue(query, (newSize) => {
      if (!newSize) return;
      setDraftVariant({
        ...draftVariant,
        size: {
          value: newSize._id,
          label: newSize.size,
        },
      });
      setValue("size", newSize._id);
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-primary-light bg-card/80 p-5 shadow-sm transition-all">
      {/* Top Row: 3-Column Grid for main attributes */}
      <div className="grid gap-5 sm:grid-cols-3">
        {/* Size Selection */}
        <div className="w-full">
          <Controller
            name="size"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="SIZE"
                disabled={!sizeTypeSelected}
                options={sizeValueOptions}
                placeholder={
                  !sizeTypeSelected ? "Select a size type first" : "Select size"
                }
                showAddButton
                addButtonText="Create new size"
                onAdd={handleAddSize}
                onChange={(event) => {
                  field.onChange(event);
                  const selected = sizeValueOptions.find(
                    (option) => option.value === event.target.value,
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
              />
            )}
          />
          {!sizeTypeSelected ? (
            <p className="mt-1 text-[10px] text-red-500">
              Please select a size type first
            </p>
          ) : !draftVariant.size.value ? (
            <p className="mt-1 text-[10px] text-red-500">
              Please select a size
            </p>
          ) : null}
        </div>

        {/* Price Input */}
        <div className="w-full">
          <label
            htmlFor="variant-price"
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted"
          >
            PRICE
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

        {/* Discount Input */}
        <div className="w-full">
          <label
            htmlFor="variant-discount"
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted"
          >
            DISCOUNT
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
      </div>

      <hr className="my-6 border-border/70" />

      {/* Bottom Row: Toggles and Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Side: Checkboxes */}
        <div className="flex gap-5">
          <label
            htmlFor="variant-available"
            className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
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
            className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
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

        {/* Right Side: Actions */}
        <div className="flex shrink-0 gap-3">
          {/* I kept the Cancel button as it's typically necessary for UX, even if omitted in the specific screenshot frame */}
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
