import { type FieldErrors, Controller, type Control } from "react-hook-form";
import { TbCategoryPlus } from "react-icons/tb";
import type { Option, QuickAddValues } from "../types";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";

type TaxonomySectionProps = {
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
  addSubCategory: (subcategory?: string) => void;
  getCategoryLoading: boolean;
  // typeOptions: Option[];
};

const TaxonomySection = ({
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
  addSubCategory,
  subcategoryTypeOptions,
  subcategoryTypeLoading,
}: TaxonomySectionProps) => {

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <TbCategoryPlus className="text-primary text-xl" />
        <h3 className="text-lg text-admin-text font-heading font-semibold">
          Category
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

        <Controller
          name="subcategory"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              {...field}
              label="Subcategory"
              required
              disabled={!selectedCategory || subcategoryLoading}
              error={errors.subcategory?.message}
              options={subcategoryOptions}
              showAddButton
              addButtonText="Create new subcategory"
              onAdd={addSubCategory}
              placeholder={
                !selectedCategory
                  ? "Select a category first"
                  : subcategoryLoading
                    ? "Loading subcategories..."
                    : "Select subcategory"
              }
            />
          )}
        />
        <Controller
          name="subcategoryType"
          control={control}
          render={({ field }) => (
            <SearchableSelect
              {...field}
              label="Subcategory Type"
              required
              disabled={!selectedSubcategory}
              error={errors.subcategoryType?.message}
              options={subcategoryTypeOptions}
              placeholder={
                !selectedSubcategory
                  ? "Select a category first"
                  : subcategoryTypeLoading
                    ? "Loading types..."
                    : "Select type"
              }
            />
          )}
        />
      </div>
    </section>
  );
};

export default TaxonomySection;
