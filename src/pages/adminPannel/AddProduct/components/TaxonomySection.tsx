import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { TbCategoryPlus } from "react-icons/tb";
import type { Option, QuickAddValues } from "../types";
import { Select } from "../../../../components/ui/FormElements";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";
import { Controller, type Control } from "react-hook-form";

type TaxonomySectionProps = {
  register: UseFormRegister<QuickAddValues>;
  control: Control<QuickAddValues>;
  errors: FieldErrors<QuickAddValues>;
  categoryOptions: Option[];
  selectedCategory: string;
  selectedSubcategory: string;
  subcategoryOptions: Option[];
  subcategoryLoading: boolean;
  subcategoryType: string;
  subcategoryTypeOptions: Option[];
  subcategoryTypeLoading: boolean;
  addCategory: (category?: string) => void;
  getCategoryLoading: boolean;
  // typeOptions: Option[];
};

const TaxonomySection = ({
  register,
  control,
  errors,
  categoryOptions,
  getCategoryLoading,
  selectedCategory,
  selectedSubcategory,
  subcategoryOptions,
  subcategoryLoading,
  subcategoryType,
  addCategory,
  subcategoryTypeOptions,
  subcategoryTypeLoading,
}: TaxonomySectionProps) => {
  console.log(
    "hhfdf",
    selectedCategory,
    selectedSubcategory,
    getCategoryLoading,
  );
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <TbCategoryPlus className="text-primary text-xl" />
        <h3 className="text-lg text-admin-text font-heading font-semibold">
          Taxonomy Mapping
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              {...field}
              label="Category"
              required
              showAddButton
              addButtonText="Create new category"
              onAdd={addCategory}
              error={errors.category?.message}
              options={categoryOptions}
              placeholder="Select category"
            />
          )}
        />

        <Select
          label="Subcategory"
          required
          disabled={!selectedCategory || subcategoryLoading}
          {...register("subcategory")}
          error={errors.subcategory?.message}
          options={subcategoryOptions}
          placeholder={
            !selectedCategory
              ? "Select a category first"
              : subcategoryLoading
                ? "Loading subcategories..."
                : "Select subcategory"
          }
        />
        <Select
          label="Subcategory Type"
          required
          disabled={!selectedSubcategory}
          {...register("subcategoryType")}
          error={errors.subcategoryType?.message}
          options={subcategoryTypeOptions}
          placeholder={
            !subcategoryType
              ? "Select a subcategory first"
              : subcategoryType
                ? "Loading types..."
                : "Select type"
          }
        />
      </div>
    </section>
  );
};

export default TaxonomySection;
