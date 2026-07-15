import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { NavColumn } from "./navData";

interface MegaMenuProps {
  columns: NavColumn[];
}

export default function MegaMenu({ columns }: MegaMenuProps) {
  return (
    <div
      className="
        absolute left-1/2 top-full z-50
        -translate-x-1/2 pt-3

        w-fit
        min-w-[260px]
        max-w-[420px]

        opacity-0 invisible translate-y-2 scale-[0.98]
        pointer-events-none

        group-hover:opacity-100
        group-hover:visible
        group-hover:translate-y-0
        group-hover:scale-100
        group-hover:pointer-events-auto

        transition-all duration-300 ease-out
      "
    >
      <div
        className="
          rounded-2xl
          border border-border/60
          bg-background/95
          backdrop-blur-xl

          shadow-[0_16px_40px_rgba(0,0,0,0.08)]

          px-6 py-5
        "
      >
        <div
          className={`grid gap-x-8 ${
            columns.length > 1 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {columns.map((col) => (
            <div key={col.title}>
              {/* Heading */}
              <div className="mb-2">
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-admin-text">
                  {col.title}
                </p>

                <div className="mt-1 h-px w-8 bg-primary/30 rounded-full" />
              </div>

              {/* Links */}
              <div className="space-y-0.5">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="
                      group/item
                      flex items-center justify-between

                      rounded-md
                      px-2 py-1.5

                      text-[14px]
                      text-admin-text/80

                      transition-all duration-200

                      hover:bg-primary/5
                      hover:text-primary-dark
                    "
                  >
                    <span className="transition-transform duration-200 group-hover/item:translate-x-1">
                      {link.label}
                    </span>

                    <ChevronRight
                      size={14}
                      className="
                        text-primary

                        opacity-0
                        translate-x-[-4px]

                        transition-all duration-200

                        group-hover/item:opacity-100
                        group-hover/item:translate-x-0
                      "
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}