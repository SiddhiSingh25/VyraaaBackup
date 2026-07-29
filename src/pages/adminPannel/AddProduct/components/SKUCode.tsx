import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { MdQrCode2 } from "react-icons/md";
import type { QuickAddValues } from "../types";

type Props = {
  register: UseFormRegister<QuickAddValues>;
  errors: FieldErrors<QuickAddValues>;
};

const SkuSection = ({ register, errors }: Props) => {
  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
        <MdQrCode2 className="text-primary text-xl" />
        <h3 className="text-sm font-semibold tracking-tight">
          SKU Information
        </h3>
      </div>

      <div className="w-full">
        <label className="mb-2 block text-sm font-medium">
          SKU Code <span className="text-red-700">*</span>
        </label>

        <input
          {...register("sku")}
          type="text"
          placeholder="e.g. A123BGH"
          className={`w-full rounded-lg border px-4 py-2 outline-none transition ${
            errors.sku ? "border-red-500" : "border-border focus:border-primary"
          }`}
        />

        {errors.sku && (
          <p className="mt-1 text-sm text-red-500">{errors.sku.message}</p>
        )}
      </div>
    </section>
  );
};

export default SkuSection;
