import { Controller, type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { FaTags } from "react-icons/fa6";
import { Input, TextArea } from "../../../../components/ui/FormElements";
import { SearchableSelect } from "../../../../components/SearchableDropdown/SearchableDropdown";
import type { Option, QuickAddValues } from "../types";

type CoreInfoSectionProps = {
  register: UseFormRegister<QuickAddValues>;
  control: Control<QuickAddValues>;
  errors: FieldErrors<QuickAddValues>;
  colorFamilyOptions: Option[];
  selectedColorFamily: string;
  colorOptions: Option[];
  sizeTypeOptions: Option[];
  brandOptions: Option[];
  addColorFamily: (name?: string) => void;
  addSizeType: (name?: string) => void;
  addBrand: (name?: string) => void;
};

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
}: CoreInfoSectionProps) => {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <FaTags className="text-primary text-xl" />
        <h3 className="text-lg text-admin-text font-heading font-semibold">
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
                showAddButton
                addButtonText="Create new brand"
                onAdd={addBrand}
                error={errors.brand?.message}
                options={brandOptions}
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
