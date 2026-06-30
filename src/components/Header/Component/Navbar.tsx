import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const PRIMARY_LINKS = [{label  : "Home", to : "/"}, { label  : "About us", to : "/aboutus"}, {label  : "Wishlist", to : "/wishlist"}, { label : "Contact", to : "/"}];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`  w-full z-50 h-16 flex items-center transition-[background,box-shadow] duration-500
          ${scrolled ? "bg-background/96 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-background/96"}`}
      >
        <div className="flex justify-between items-center px-5 sm:px-8 lg:px-10 w-full max-w-[1440px] mx-auto relative">
          <div className="flex flex-col items-center mt-0.5">
            <img
              src="/logo.png"
              alt="VYRAAA"
              className="w-[140px] h-[140px] object-contain mt-2.5"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Hamburger (mobile/tablet) */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="lg:hidden flex flex-col gap-[5px] p-1 z-10"
          >
            <span className="block w-6 h-[1.5px] bg-heading transition-all duration-300" />
            <span className="block w-6 h-[1.5px] bg-heading transition-all duration-300" />
            <span className="block w-4 h-[1.5px] bg-heading transition-all duration-300" />
          </button>

          {/* Right actions */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-7">
         

            {PRIMARY_LINKS.map((elm) => (
              <Link
                key={elm.label}
                to={elm.to}
                className="text-[11px] font-medium tracking-[0.18em] uppercase text-heading transition-colors duration-300 hover:text-primary-dark"
              >
                {elm.label}
              </Link>
            ))}

            <div className="w-px h-4 bg-border hidden xl:block" />

            <button className="text-primary">
              <Search size={20} />
            </button>

            <button className="text-primary">
              <Heart size={20} />
            </button>

            <button className="text-primary">
              <ShoppingBag size={20} />
            </button>
          </div>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
