import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { TbCategoryPlus } from "react-icons/tb";
import type { Option, QuickAddValues } from "../types";
import { Select } from "../../../../components/ui/FormElements";

type TaxonomySectionProps = {
  register: UseFormRegister<QuickAddValues>;
  errors: FieldErrors<QuickAddValues>;
  categoryOptions: Option[];
  categoryLoading: boolean;
  selectedCategory: string;
  selectedSubcategory: string;
  subcategoryOptions: Option[];
  subcategoryLoading: boolean;
  subcategoryType: string;
  subcategoryTypeOptions: Option[];
  subcategoryTypeLoading: boolean;
  // typeOptions: Option[];
};

const TaxonomySection = ({
  register,
  errors,
  categoryOptions,
  categoryLoading,
  selectedCategory,
  selectedSubcategory,
  subcategoryOptions,
  subcategoryLoading,
   subcategoryType,
  subcategoryTypeOptions,
  subcategoryTypeLoading
}: TaxonomySectionProps) => {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <TbCategoryPlus className="text-primary text-xl" />
        <h3 className="text-lg text-heading font-heading font-semibold">
          Taxonomy Mapping
        </h3>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Select
          label="Category"
          required
          {...register("category")}
          error={errors.category?.message}
          options={categoryOptions}
          placeholder={
            categoryLoading ? "Loading categories..." : "Select category"
          }
          disabled={categoryLoading}
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
