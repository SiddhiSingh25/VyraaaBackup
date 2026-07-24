import { MdOutlineDeleteSweep } from "react-icons/md";
import type { Option, VariantEntry } from "../types";
import { FiEdit2 } from "react-icons/fi";

type VariantsTableProps = {
  variants: VariantEntry[];
  onRemove: (index: number) => void;
  sizeOptions: Option[];
  onEdit: (index: number) => void;
};

const VariantsTable = ({ variants, onRemove, onEdit }: VariantsTableProps) => {
  if (variants.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-6 border border-dashed border-border rounded-lg bg-card/50">
        No variants yet — add your first size to start selling.
      </p>
    );
  }

  console.log(variants, "88888888888888");

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface/70">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-card  border-b border-border text-sm font-semibold tracking-tight ">
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
            <tr
              key={index}
              className="hover:bg-card/40 transition-colors text-body"
            >
              <td className="px-5 py-4 font-medium">{variant.size.label}</td>
              <td className="px-5 py-4">₹{variant.price}</td>

              <td className="px-5 py-4 text-muted">
                {variant.discountPrice ? `%${variant.discountPrice}` : "-"}
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
              <td className="px-5 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  className="rounded-md p-2 hover:bg-primary/10 text-primary"
                >
                  <FiEdit2 />
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete Variant"
                >
                  <MdOutlineDeleteSweep size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantsTable;
