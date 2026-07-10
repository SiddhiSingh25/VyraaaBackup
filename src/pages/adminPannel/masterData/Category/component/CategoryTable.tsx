import React from "react";
import { 
  Pencil, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown 
} from "lucide-react";
import type { Category } from "./types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const COLUMNS = [
  "Sr. No.",
  "Category",
  "Actions",
];

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {

  return (
    // Added h-[100vh] to strict the height to the viewport.
    <div className="w-full h-[80vh] bg-surface rounded-xl border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col font-admin-text">
      
      {/* --- Top Search Bar --- */}
      {/* Added shrink-0 so the header doesn't get squished */}
      <div className="p-5 shrink-0">
        <div className="relative w-full max-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-muted" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-background text-body placeholder-muted"
          />
        </div>
      </div>

      {/* --- Responsive Table Container --- */}
      {/* flex-1 lets it fill the middle space, min-h-0 is required for flex scrolling, overflow-auto adds X and Y scrollbars when needed */}
      <div className="flex-1 min-h-0 overflow-auto w-full scrollbar-thin">
        <table className="w-full min-w-[820px] border-collapse text-left relative">
          
          {/* Table Header */}
          {/* Added sticky top-0 and z-10 so headers stay visible when scrolling Y axis */}
          <thead className="bg-surface sticky top-0 z-10">
            <tr className="border-b-2 border-primary border-t border-border shadow-sm">
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  className={`whitespace-nowrap py-3.5 px-4 text-sm font-medium text-primary bg-surface
                  ${col === "Actions" ? "text-right pr-6" : "text-left"} 
                  ${i === 0 ? "text-center" : ""}
                  ${i !== COLUMNS.length - 1 ? "border-r border-border/60" : ""}
                  `}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="py-12 text-center text-sm text-muted bg-background"
                >
                  No categories found. Try a different search or add a new category.
                </td>
              </tr>
            )}

            {categories.map((cat, idx) => (
              <tr
                key={cat.id}
                className={`border-b border-border/60 last:border-b-0 hover:bg-card/40 transition-colors ${
                  idx % 2 === 0 ? "bg-surface" : "bg-background"
                }`}
              >
                {/* Sr No. */}
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-muted font-medium">
                  {cat.srNo ?? idx + 1}
                </td>

                {/* Category Name */}
                <td className="whitespace-nowrap px-4 py-3.5 text-sm text-heading font-medium">
                  {cat.categoryName}
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex items-center justify-end gap-2.5 pr-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(cat)}
                      aria-label={`Edit ${cat.categoryName}`}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-border bg-background text-muted hover:bg-card hover:text-primary transition-colors shadow-sm"
                    >
                      <Pencil size={14} />
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(cat)}
                      aria-label={`Delete ${cat.categoryName}`}
                      className="flex h-[30px] w-[30px] items-center justify-center rounded-md border border-error/20 bg-error/5 text-error hover:bg-error/10 transition-colors shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Footer --- */}
      {/* Added shrink-0 to prevent the footer from squishing */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border bg-surface gap-4 shrink-0">
        {/* Entry text */}
        <div className="text-sm text-muted">
          Showing <span className="font-medium text-heading">1</span> to{" "}
          <span className="font-medium text-heading">{categories.length}</span> of{" "}
          <span className="font-medium text-heading">{categories.length}</span> entries
        </div>

        {/* Center pagination numbers */}
        <div className="flex items-center gap-1.5">
          <button className="flex h-7 w-7 items-center justify-center rounded bg-background border border-border text-muted hover:bg-card disabled:opacity-50 transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded bg-primary text-background text-sm font-medium hover:bg-primary-dark shadow-sm transition-colors">
            1
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded bg-background border border-border text-muted hover:bg-card disabled:opacity-50 transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Rows per page selector */}
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>Rows:</span>
          <div className="relative">
            <select className="appearance-none bg-background border border-border text-body py-1 pl-2.5 pr-7 rounded-md focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm text-sm">
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
          </div>
        </div>
      </div>
      
    </div>
  );
}