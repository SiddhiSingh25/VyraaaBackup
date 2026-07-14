import { MdOutlineDeleteSweep } from "react-icons/md";
import type { AttributeEntry } from "../types";

type AttributesTableProps = {
  attributes: AttributeEntry[];
  onRemove: (index: number) => void;
};

const AttributesTable = ({ attributes, onRemove }: AttributesTableProps) => {
  if (attributes.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-6 border border-dashed border-border rounded-lg bg-card/50">
        No attributes assigned — add fabric, fit, or care details buyers care about.
      </p>
    );
  }

  console.log(attributes, "666666666666666666666666666")

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-card  text-sm font-semibold tracking-tight  border-b border-border">
          <tr>
            <th className="px-4 py-3 font-semibold">Property</th>
            <th className="px-4 py-3 font-semibold">Value</th>
            <th className="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {attributes.map((attr, index) => (
            <tr key={index} className="hover:bg-card/40 transition">
              <td className="px-4 py-3 font-medium ">{attr.propertyLabel}</td>
              <td className="px-4 py-3 text-muted">{attr.valueLabel}</td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove attribute ${attr.property}`}
                  className="text-muted hover:text-error transition"
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

export default AttributesTable;
