import { Link } from "react-router-dom";
import type { NavColumn } from "./navData";

interface MegaMenuProps {
  columns: NavColumn[];
}

export default function MegaMenu({ columns }: MegaMenuProps) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[520px]
        opacity-0 invisible translate-y-1 pointer-events-none
        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto
        transition-all duration-300 ease-out"
    >
      <div
        className="bg-background/98 backdrop-blur-xl border border-border/60 rounded-2xl
          shadow-[0_24px_48px_-16px_rgba(0,0,0,0.16)] px-8 py-7 grid grid-cols-2 gap-8"
      >
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-heading  mb-4">
              {col.title}
            </p>
            <div className="flex flex-col gap-3">
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[13px] text-heading/80 hover:text-primary-dark transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
