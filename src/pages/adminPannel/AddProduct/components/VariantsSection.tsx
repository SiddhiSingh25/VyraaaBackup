import { useState, useEffect } from "react";
import {
  IoAdd,
  IoColorPaletteOutline,
  IoRemove,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import { Button } from "../../../../components/ui/FormElements";
import VariantDraftForm from "./VariantDraftForm";
import VariantsTable from "./VariantsTable";
import type { DraftVariant, Option, VariantEntry } from "../types";
import { RxCross2 } from "react-icons/rx";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { QuickAddValues } from "../types";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";

const emptyDraftVariant: DraftVariant = {
  size: {},
  price: "",
  stock: "",
  sku: "",
  discountPrice: "",
  isAvailable: true,
  isFewLeft: false,
};

type VariantsSectionProps = {
  control: Control<QuickAddValues>;
  errors: FieldErrors<QuickAddValues>;
  variants: VariantEntry[];
  setVariants: (variants: VariantEntry[]) => void;
  sizeTypeOptions: Option[];
  sizeOptions: Option[];
  sizeTypeSelected: string;
  addSizeType: (name?: string) => void;
  errorMessage?: string;
};

const VariantsSection = ({
  control,
  errors,
  variants,
  setVariants,
  sizeTypeOptions,
  sizeOptions,
  sizeTypeSelected,
  addSizeType,
  errorMessage,
}: VariantsSectionProps) => {
  const [showDraft, setShowDraft] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftVariant, setDraftVariant] =
    useState<DraftVariant>(emptyDraftVariant);

  useEffect(() => {
    setDraftVariant(emptyDraftVariant);
    setShowDraft(false);
  }, [sizeTypeSelected]);

  const addVariant = () => {
    const newVariant: VariantEntry = {
      size: draftVariant.size,
      sku: draftVariant.sku.trim(),
      price: Number(draftVariant.price),
      discountPrice: draftVariant.discountPrice
        ? Number(draftVariant.discountPrice)
        : undefined,
      isAvailable: draftVariant.isAvailable,
      isFewLeft: draftVariant.isFewLeft,
    };

    // Prevent duplicate SKUs
    const duplicateSku = variants.some(
      (v, i) => i !== editingIndex && v.sku === newVariant.sku,
    );

    if (duplicateSku) {
      alert("SKU already exists.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...variants];
      updated[editingIndex] = newVariant;
      setVariants(updated);

      setEditingIndex(null);
    } else {
      setVariants([...variants, newVariant]);
    }

    setDraftVariant(emptyDraftVariant);
    setShowDraft(false);
  };

  const editVariant = (index: number) => {
    setDraftVariant({
      ...variants[index],
      price: variants[index].price.toString(),
      stock: "",
      discountPrice: variants[index].discountPrice?.toString() ?? "",
    });

    setEditingIndex(index);
    setShowDraft(true);
  };

  const removeVariant = (index: number) => {
    const next = [...variants];
    next.splice(index, 1);
    setVariants(next);
  };

  const cancelDraft = () => {
    setDraftVariant(emptyDraftVariant);
    setShowDraft(false);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <IoColorPaletteOutline className="text-xl text-primary" />
        <h3 className="text-sm font-semibold tracking-tight  ">
          Inventory & Pricing
        </h3>
      </div>
      <div className="mb-6">
        <Controller
          name="sizeType"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              {...field}
              label="Size Type"
              required
              options={sizeTypeOptions}
              error={errors.sizeType?.message}
              showAddButton
              addButtonText="Create new size type"
              onAdd={addSizeType}
            />
          )}
        />
        <Controller
          name="appendSizeType"
          control={control}
          render={({ field }) => (
            <div className="mt-3 flex items-start gap-3">
              <input
                id="appendSizeType"
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="mt-1"
              />

              <label htmlFor="appendSizeType" className="text-sm">
                Append Size Type to Variant
                <p className="text-xs text-muted mt-1">
                  By enabling this, your variants will be stored as
                  <strong> 3 ml</strong>, <strong>5 g</strong>,
                  <strong>250 ml</strong>, etc.
                </p>
              </label>
            </div>
          )}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm font-medium "> Add Product Variants</p>
          <p className="text-sm text-muted mt-1">
            Add one or more size variants with their price, discount, and stock
            availability.
          </p>
        </div>

        <Button
          type="button"
          variant="icon"
          onClick={() => setShowDraft(!showDraft)}
        >
          <span className="material-symbols-outlined">
            {showDraft ? <RxCross2 /> : <IoAdd />}
          </span>
        </Button>
      </div>

      {errorMessage && variants.length === 0 && (
        <p className="mb-4 text-sm text-error">{errorMessage}</p>
      )}

      {showDraft && (
        <VariantDraftForm
          draftVariant={draftVariant}
          setDraftVariant={setDraftVariant}
          sizeOptions={sizeOptions}
          sizeTypeSelected={sizeTypeSelected}
          onAdd={addVariant}
          onCancel={cancelDraft}
        />
      )}

      {/* Passed sizeOptions here so the table can render the label */}
      <VariantsTable
        variants={variants}
        onRemove={removeVariant}
        sizeOptions={sizeOptions}
        onEdit={editVariant}
      />
    </section>
  );
};

export default VariantsSection;
