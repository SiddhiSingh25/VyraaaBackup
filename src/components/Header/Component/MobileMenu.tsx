import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronDown, Search, Heart, ShoppingBag, User } from "lucide-react";
import type { NavLink } from "./navData";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-[100] bg-heading/30 backdrop-blur-sm transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 left-0 z-[110] h-full w-[86%] max-w-[360px] bg-background
          shadow-[8px_0_40px_-10px_rgba(0,0,0,0.25)] transition-transform duration-[350ms] ease-out
          flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border/60 shrink-0">
          <img
            src="/logo.png"
            alt="VYRAAA"
            className="h-16 mt-1 w-auto object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-admin-text/70 hover:text-primary-dark transition-colors duration-200"
          >
            <X size={20} strokeWidth={1.6} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {links.map((link) => {
            const hasChildren = !!link.columns?.length;
            const isOpen = expanded === link.label;
            return (
              <div key={link.label} className="border-b border-border/40">
                <div className="flex items-center justify-between">
                  <Link
                    to={link.to}
                    state={link.state}
                    onClick={() => !hasChildren && onClose()}
                    className="flex-1 py-4 px-5 text-[13px] font-medium tracking-[0.12em] uppercase text-admin-text/90"
                  >
                    {link.label}
                  </Link>
                  {hasChildren && (
                    <button
                      onClick={() => setExpanded(isOpen ? null : link.label)}
                      aria-label={`Toggle ${link.label} submenu`}
                      className="p-4 text-admin-text/50"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out
                      ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="pb-4 px-5 flex flex-col gap-4">
                      {link.columns!.map((col) => (
                        <div key={col.title}>
                          <p className="text-[10px] tracking-[0.18em] uppercase text-admin-text/35 mb-2">
                            {col.title}
                          </p>
                          <div className="flex flex-col gap-2.5">
                            {col.links.map((child) => (
                              <Link
                                key={child.label}
                                to={child.to}
                                state={child.state}
                                onClick={onClose}
                                className="text-[13px] text-admin-text/70 hover:text-primary-dark transition-colors duration-200"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center justify-around py-5 border-t border-border/60 shrink-0">
          <button className="flex flex-col items-center gap-1.5 text-admin-text/70">
            <Search size={19} strokeWidth={1.6} />
            <span className="text-[9px] tracking-widest uppercase">Search</span>
          </button>
          <Link to="/wishlist" onClick={onClose} className="flex flex-col items-center gap-1.5 text-admin-text/70">
            <Heart size={19} strokeWidth={1.6} />
            <span className="text-[9px] tracking-widest uppercase">Wishlist</span>
          </Link>
          <Link to="/cart" onClick={onClose} className="flex flex-col items-center gap-1.5 text-admin-text/70">
            <ShoppingBag size={19} strokeWidth={1.6} />
            <span className="text-[9px] tracking-widest uppercase">Bag</span>
          </Link>
          <Link to="/profile" onClick={onClose} className="flex flex-col items-center gap-1.5 text-admin-text/70">
            <User size={19} strokeWidth={1.6} />
            <span className="text-[9px] tracking-widest uppercase">Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
