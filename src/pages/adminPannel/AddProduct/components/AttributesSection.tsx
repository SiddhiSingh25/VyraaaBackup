
import { useState, useEffect } from "react";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { Button } from "../../../../components/ui/FormElements";
import AttributesTable from "./AttributesTable";
import type { AttributeEntry, DraftAttribute, Option } from "../types";
import usePropertyTypeData from "../api/usePropertyTypeData";
import usePropertyValueData from "../api/usePropertyValueData";

const emptyDraft: DraftAttribute = { property: "", value: "" };

type AttributesSectionProps = {
  attributes: AttributeEntry[];
  setAttributes: (attributes: AttributeEntry[]) => void;
  // Pass the subcategory ID down from the parent instead of the options
  selectedSubcategoryId: string | number; 
  propertyTypeOptions : any
};

const AttributesSection = ({
  attributes,
  setAttributes,
  selectedSubcategoryId,
  propertyTypeOptions
}: any) => {
  const [draftAttr, setDraftAttr] = useState<DraftAttribute>(emptyDraft);

  // 1. Automatically re-fetches when selectedSubcategoryId changes
  // const { propertyTypeOptions } = usePropertyTypeData(selectedSubcategoryId);
  
  // 2. Automatically re-fetches when draftAttr.property changes
  const { propertyValueOptions } = usePropertyValueData(draftAttr.property);

  // 3. Reset the draft state (and optionally the table) when subcategory changes
  useEffect(() => {
    setDraftAttr(emptyDraft);
    // Uncomment the line below if you also want to clear the added attributes 
    // table when the subcategory changes so old data doesn't persist:
    // setAttributes([]); 
  }, [selectedSubcategoryId, setAttributes]);

const addAttribute = () => {
    if (!draftAttr.property || !draftAttr.value) return;

    const property = propertyTypeOptions?.find(
      (item) => item.value === draftAttr.property
    );
    const value = propertyValueOptions?.find(
      (item) => item.value === draftAttr.value
    );

    // 1. Check if the PROPERTY already exists in the user's ATTRIBUTES list
    const existingIndex = attributes.findIndex(
      (attr) => attr.property === draftAttr.property
    );

    if (existingIndex !== -1) {
      // 2. Update the existing property with the new value
      const updatedAttributes = [...attributes];
      updatedAttributes[existingIndex] = {
        ...updatedAttributes[existingIndex],
        value: draftAttr.value,
        valueLabel: value?.label ?? "",
      };
      setAttributes(updatedAttributes);
    } else {
      // 3. Add as a brand new attribute
      setAttributes([
        ...attributes,
        {
          property: draftAttr.property,
          propertyLabel: property?.label ?? "",
          value: draftAttr.value,
          valueLabel: value?.label ?? "",
        },
      ]);
    }

    setDraftAttr(emptyDraft);
  };

  const removeAttribute = (index: number) => {
    const next = [...attributes];
    next.splice(index, 1);
    setAttributes(next);
  };

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <FaArrowsTurnRight className="text-primary text-xl" />
          <h3 className="text-lg text-admin-text font-heading font-semibold">
            Attributes
          </h3>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 rounded-lg border border-primary-light bg-card p-4 sm:flex-row sm:items-end shadow-inner">
        <div className="flex-1">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            Property
          </label>
          <select
            value={draftAttr.property}
            onChange={(e) => setDraftAttr({ property: e.target.value, value: "" })}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary"
          >
            <option value="" disabled>
              Select
            </option>
            {/* Optional chaining ensures it won't crash if data is still fetching */}
            {propertyTypeOptions?.map((prop) => (
              <option key={prop.value} value={prop.value}>
                {prop.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            Value
          </label>
          <select
            value={draftAttr.value}
            onChange={(e) => setDraftAttr({ ...draftAttr, value: e.target.value })}
            disabled={!draftAttr.property}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50"
          >
            <option value="" disabled>
              Select
            </option>
            {propertyValueOptions?.map((val) => (
              <option key={val.value} value={val.value}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
        
        <Button
          type="button"
          variant="primary"
          onClick={addAttribute}
          disabled={!draftAttr.property || !draftAttr.value}
          className="px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </Button>
      </div>

      <AttributesTable attributes={attributes} onRemove={removeAttribute} />
    </section>
  );
};

export default AttributesSection;