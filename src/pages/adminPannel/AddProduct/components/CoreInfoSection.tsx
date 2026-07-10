import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FaTags } from "react-icons/fa6";
import {
  Input,
  Select,
  TextArea,
} from "../../../../components/ui/FormElements";
import type { Option, QuickAddValues } from "../types";

type CoreInfoSectionProps = {
  register: UseFormRegister<QuickAddValues>;
  errors: FieldErrors<QuickAddValues>;
  colorFamilyOptions: Option[];
  selectedColorFamily: string;
  colorOptions: Option[];
  sizeTypeOptions: Option[];
   brandOptions : Option[];
};

const CoreInfoSection = ({
  register,
  errors,
  colorFamilyOptions,
  selectedColorFamily,
  colorOptions,
  sizeTypeOptions,
  brandOptions
  // sizeTypeValueOptions,
}: CoreInfoSectionProps) => {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <FaTags className="text-primary text-xl" />
        <h3 className="text-lg text-admin-text font-heading font-semibold">
          Core Information
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
          <Select
            label="Color Family"
            required
            {...register("colorFamily")}
            error={errors.colorFamily?.message}
            options={colorFamilyOptions}
          />
          <Select
            label="Specific Color"
            required
            disabled={!selectedColorFamily}
            {...register("color")}
            error={errors.color?.message}
            options={colorOptions}
            placeholder={
              !selectedColorFamily
                ? "Select a color family first"
                : "Select color"
            }
          />
          <Select
            label="Size Type"
            required
            {...register("sizeType")}
            error={errors.sizeType?.message}
            options={sizeTypeOptions}
          />

          <Select
            label="Brand"
            required
            {...register("brand")}
            error={errors.brand?.message}
            options={brandOptions}
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
