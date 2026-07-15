import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPagination } from "../utils";
import type { PaginationProps } from "../types";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPagination(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-4 border-t border-border px-6 py-5 sm:flex-row items-center justify-center">
      {/* Info */}
      <p className="text-sm text-muted">
        Page <span className="font-semibold text-admin-text">{currentPage}</span>{" "}
        of <span className="font-semibold text-admin-text">{totalPages}</span>
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-1">
        {/* Previous */}
        <button
          type="button"
          aria-label="Previous Page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-3 w-3 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted transition-all duration-200 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-muted"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex h-10 min-w-10 shrink-0 items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "border border-border bg-white text-body hover:border-primary hover:text-primary hover:shadow-sm"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          type="button"
          aria-label="Next Page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-muted transition-all duration-200 hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
