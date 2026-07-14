
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { Button } from "../../../../components/ui/FormElements";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";
import AttributesTable from "./AttributesTable";
import type { AttributeEntry, DraftAttribute, Option } from "../types";
import usePropertyValueData from "../api/usePropertyValueData";

const emptyDraft: DraftAttribute = { property: "", value: "" };

type AttributeDraftFormValues = {
  property: string;
  value: string;
};

type AttributesSectionProps = {
  attributes: AttributeEntry[];
  setAttributes: (attributes: AttributeEntry[]) => void;
  // Pass the subcategory ID down from the parent instead of the options
  selectedSubcategoryId: string | number;
  propertyTypeOptions: Option[];
  addPropertyType: (propertyName: string, onSuccess?: (newProperty: any) => void) => void;
};

const AttributesSection = ({
  attributes,
  setAttributes,
  selectedSubcategoryId,
  propertyTypeOptions,
  addPropertyType,
}: AttributesSectionProps) => {
  const {
    control,
    watch,
    reset,
    setValue,
  } = useForm<AttributeDraftFormValues>({
    defaultValues: emptyDraft,
  });

  const draftAttr = watch();
  const { propertyValueOptions, addPropertyValue } = usePropertyValueData(draftAttr.property);

  useEffect(() => {
    reset(emptyDraft);
    // Uncomment the line below if you also want to clear the added attributes 
    // table when the subcategory changes so old data doesn't persist:
    // setAttributes([]);
  }, [selectedSubcategoryId, reset, setAttributes]);

  const addAttribute = () => {
    if (!draftAttr.property || !draftAttr.value) return;

    const property = propertyTypeOptions?.find(
      (item: Option) : boolean => item.value === draftAttr.property
    );
    const value = propertyValueOptions?.find(
      (item: Option) : boolean => item.value === draftAttr.value
    );

    // 1. Check if the PROPERTY already exists in the user's ATTRIBUTES list
    const existingIndex = attributes.findIndex(
      (attr: AttributeEntry) : boolean => attr.property === draftAttr.property
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

    reset(emptyDraft);
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
          <h3 className="text-lg  text-sm font-semibold tracking-tight  font-semibold">
            Product Specifications
          </h3>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-4 rounded-lg border border-primary-light bg-card p-4 sm:flex-row sm:items-end shadow-inner">
        <div className="flex-1">
          <Controller
            name="property"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="Property"
                disabled={!selectedSubcategoryId}
                options={propertyTypeOptions}
                placeholder={!selectedSubcategoryId ? "Select a subcategory first" : "Select property"}
                showAddButton
                addButtonText="Create new property"
                onAdd={(query: string) => {
                  addPropertyType(query, (newProperty) => {
                    setValue("property", newProperty._id);
                    setValue("value", "");
                  });
                }}
                onChange={(event) => {
                  field.onChange(event);
                  setValue("value", "");
                }}
              />
            )}
          />
        </div>
        
        <div className="flex-1">
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="Value"
                disabled={!draftAttr.property}
                options={propertyValueOptions}
                showAddButton
                addButtonText="Create new value"
                onAdd={(query: string) => {
                  addPropertyValue(query, draftAttr.property, (newValue) => {
                    setValue("value", newValue._id);
                  });
                }}
                placeholder={!draftAttr.property ? "Select a property first" : "Select value"}
              />
            )}
          />
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