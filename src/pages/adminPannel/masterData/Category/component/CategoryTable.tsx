import React from "react";
import {
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { Category } from "./types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const COLUMNS = ["Sr. No.", "Image", "Category", "Actions"];

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="w-full h-[80vh] bg-surface rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col font-admin-text">
      {/* Search */}
      {/* <div className="p-5 shrink-0">
        <div className="relative w-full max-w-60">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted" />
          </div>

          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-background text-body placeholder-muted"
          />
        </div>
      </div> */}

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto w-full scrollbar-thin">
        <table className="w-full min-w-225 border-collapse">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b-2 border-primary ">
              {COLUMNS.map((column, index) => (
                <th
                  key={column}
                  className={`py-3.5 px-4 text-sm font-medium text-primary bg-surface
                    ${
                      column === "Actions"
                        ? "text-right pr-6"
                        : column === "Sr. No."
                          ? "text-center"
                          : "text-left"
                    }
                    ${
                      index !== COLUMNS.length - 1
                        ? "border-r border-border/60"
                        : ""
                    }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-12 text-center text-sm text-muted"
                >
                  No categories found.
                </td>
              </tr>
            )}

            {categories.map((cat, index) => (
              <tr
                key={cat.id}
                className={`border-b border-border/60 hover:bg-card/40 transition-colors ${
                  index % 2 === 0 ? "bg-surface" : "bg-background"
                }`}
              >
                {/* Sr No */}
                <td className="px-4 py-3 text-sm text-center text-muted">
                  {cat.srNo ?? index + 1}
                </td>

                {/* Image */}
                <td className="px-4 py-3">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.categoryName}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg border bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                      No Image
                    </div>
                  )}
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-sm font-medium text-heading">
                  {cat.categoryName}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background hover:bg-card transition"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => onDelete(cat)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border bg-surface gap-4">
        <div className="text-sm text-muted">
          Showing <span className="font-medium text-heading">1</span> to{" "}
          <span className="font-medium text-heading">{categories.length}</span>{" "}
          of{" "}
          <span className="font-medium text-heading">{categories.length}</span>{" "}
          entries
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-7 w-7 items-center justify-center rounded border border-border hover:bg-card">
            <ChevronLeft size={14} />
          </button>

          <button className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white">
            1
          </button>

          <button className="flex h-7 w-7 items-center justify-center rounded border border-border hover:bg-card">
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Rows:</span>

          <div className="relative">
            <select className="appearance-none border border-border rounded-md py-1 pl-3 pr-8 bg-background">
              <option>50</option>
              <option>100</option>
            </select>

            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
