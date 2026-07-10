import { MdOutlineDeleteSweep } from "react-icons/md";
import type { Option, VariantEntry } from "../types";

type VariantsTableProps = {
  variants: VariantEntry[];
  onRemove: (index: number) => void;
  sizeOptions : Option[];
};

const VariantsTable = ({ variants, onRemove }: VariantsTableProps) => {
  if (variants.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-6 border border-dashed border-border rounded-lg bg-card/50">
        No variants yet — add your first size to start selling.
      </p>
    );
  }

  console.log(variants, "88888888888888")

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface/70">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-card text-admin-text border-b border-border font-heading">
          <tr>
            <th className="px-5 py-3 font-semibold">Size</th>
            <th className="px-5 py-3 font-semibold">Price</th>
            <th className="px-5 py-3 font-semibold">Discount</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {variants.map((variant, index) => (
            <tr key={index} className="hover:bg-card/40 transition-colors text-body">
              <td className="px-5 py-4 font-medium">{variant.size.label}</td>
              <td className="px-5 py-4">₹{variant.price}</td>
   
              <td className="px-5 py-4 text-muted">
                {variant.discountPrice ? `₹${variant.discountPrice}` : "-"}
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      variant.isAvailable ? "bg-success" : "bg-error"
                    }`}
                  />
                  {variant.isFewLeft && (
                    <span className="rounded-md bg-warning/20 px-2 py-0.5 text-[10px] font-bold text-warning uppercase tracking-wider">
                      Few Left
                    </span>
                  )}
                </div>
              </td>
     
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantsTable;
