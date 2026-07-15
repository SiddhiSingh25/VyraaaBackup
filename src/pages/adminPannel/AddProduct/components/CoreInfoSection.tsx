import { Controller, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { FaTags } from "react-icons/fa6";
import { Input, TextArea } from "../../../../components/ui/FormElements";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";
import type { Option, QuickAddValues } from "../types";

type CoreInfoSectionProps = {
  register: UseFormRegister<QuickAddValues>;
  control: Control<QuickAddValues, any, any>;
  errors: FieldErrors<QuickAddValues>;
  colorFamilyOptions: Option[];
  selectedColorFamily: string;
  colorOptions: Option[];
  sizeTypeOptions: Option[];
  brandOptions: Option[];
  addColorFamily: (name?: string) => void;
  addSizeType: (name?: string) => void;
  addBrand: (name?: string) => void;
  addColor?: (name?: string) => void;
  selectedCategory: string;
};

const genderOptions = [
  { label: "Men", value: "Men" },
  { label: "Women", value: "Women" },
  { label: "Unisex", value: "Unisex" },
  { label: "Boys", value: "Boys" },
  { label: "Girls", value: "Girls" },
];

const ageRangeOptions = [
  { label: "0-2 Years", value: "0-2 Years" },
  { label: "3-5 Years", value: "3-5 Years" },
  { label: "6-8 Years", value: "6-8 Years" },
  { label: "9-12 Years", value: "9-12 Years" },
  { label: "13-18 Years", value: "13-18 Years" },
];

const CoreInfoSection = ({
  register,
  control,
  errors,
  colorFamilyOptions,
  selectedColorFamily,
  colorOptions,
  sizeTypeOptions,
  brandOptions,
  addColorFamily,
  addSizeType,
  addBrand,
  addColor,
  selectedCategory,
}: CoreInfoSectionProps) => {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <FaTags className="text-primary text-xl" />
        <h3 className="text-lg  text-sm font-semibold tracking-tight  font-semibold">
          Product Details
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        <Input
          label="Product Name"
          required
          placeholder="e.g. Classic Heavyweight Hoodie"
          {...register("name")}
          error={errors.name?.message}
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
          <Controller
            name="colorFamily"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="Color Family"
                required
                showAddButton
                addButtonText="Create new color family"
                onAdd={addColorFamily}
                error={errors.colorFamily?.message}
                options={colorFamilyOptions}
              />
            )}
          />
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="Specific Color"
                required
                disabled={!selectedColorFamily}
                error={errors.color?.message}
                options={colorOptions}
                showAddButton
                addButtonText="Create new color"
                onAdd={addColor}
                placeholder={
                  !selectedColorFamily
                    ? "Select a color family first"
                    : "Select color"
                }
              />
            )}
          />
          <Controller
            name="sizeType"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="Size Type"
                required
                showAddButton
                addButtonText="Create new size type"
                onAdd={addSizeType}
                error={errors.sizeType?.message}
                options={sizeTypeOptions}
              />
            )}
          />

          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                {...field}
                label="Brand"
                required
                disabled={!selectedCategory}
                showAddButton
                addButtonText="Create new brand"
                onAdd={addBrand}
                error={errors.brand?.message}
                options={brandOptions}
                placeholder={
                  !selectedCategory ? "Select a category first" : "Select brand"
                }
              />
            )}
          />
<Controller
  name="gender"
  control={control}
  render={({ field }) => (
    <SearchableSelect
      {...field}
      label="Gender"
      required
      error={errors.gender?.message}
      options={genderOptions}
    />
  )}
/>


<Controller
  name="ageRange"
  control={control}
  render={({ field }) => (
    <SearchableSelect
      {...field}
      label="Age Range"
      error={errors.ageRange?.message}
      options={ageRangeOptions}
    />
  )}
/>

        </div>
        <TextArea
          label="Description"
          required
          rows={4}
          placeholder="Short, compelling description..."
          {...register("description")}
          error={errors.description?.message}
        />
      </div>
    </section>
  );
};

export default CoreInfoSection;
