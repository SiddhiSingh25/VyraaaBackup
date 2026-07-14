import { useState, useEffect } from "react";
import { IoAdd, IoColorPaletteOutline, IoRemove, IoRemoveCircleOutline } from "react-icons/io5";
import { Button } from "../../../../components/ui/FormElements";
import VariantDraftForm from "./VariantDraftForm";
import VariantsTable from "./VariantsTable";
import type { DraftVariant, Option, VariantEntry } from "../types";
import { RxCross2 } from "react-icons/rx";

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
  variants: VariantEntry[];
  setVariants: (variants: VariantEntry[]) => void;
  sizeOptions: Option[];
  sizeTypeSelected: any;
  errorMessage?: string;
};

const VariantsSection = ({
  variants,
  setVariants,
  sizeOptions,
  sizeTypeSelected,
  errorMessage,
}: VariantsSectionProps) => {
  const [showDraft, setShowDraft] = useState(false);
  const [draftVariant, setDraftVariant] = useState<DraftVariant>(emptyDraftVariant);

  useEffect(() => {
    setDraftVariant(emptyDraftVariant);
    setShowDraft(false);
  }, [sizeTypeSelected]);

  const addVariant = () => {
    // draftVariant.size should hold the 'value' from your select options
    const newVariant: VariantEntry = {
      size: draftVariant.size, 
      price: Number(draftVariant.price),
      discountPrice: draftVariant.discountPrice
        ? Number(draftVariant.discountPrice)
        : undefined,
      isAvailable: draftVariant.isAvailable,
      isFewLeft: draftVariant.isFewLeft,
    };

    // Check if this size variant already exists
    const existingIndex = variants.findIndex(
      (v) => v.size.value === draftVariant.size.value
    );

    if (existingIndex !== -1) {
      // Update the existing variant instead of adding a duplicate
      const updatedVariants = [...variants];
      updatedVariants[existingIndex] = newVariant;
      setVariants(updatedVariants);
    } else {
      // Add as a completely new variant
      setVariants([...variants, newVariant]);
    }

    setDraftVariant(emptyDraftVariant);
    setShowDraft(false);
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

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm font-medium ">Add SKU variants</p>
          <p className="text-sm text-muted">
            Create one or more size-based entries for this product.
          </p>
        </div>
        <Button type="button" variant="icon" onClick={() => setShowDraft(!showDraft)}>
          <span className="material-symbols-outlined">
            {showDraft ? <RxCross2/> : <IoAdd/> }
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
      />
    </section>
  );
};

export default VariantsSection;

