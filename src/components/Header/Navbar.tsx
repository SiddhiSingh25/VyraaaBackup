import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu } from "lucide-react";
import SearchBar from "./Component/SearchBar";
import MegaMenu from "./Component/MegaMenu";
import { NAV_LINKS } from "./Component/navData";
import MobileMenu from "./Component/MobileMenu";
import { useSelector } from "react-redux";

interface NavbarProps {
  wishlistCount?: number;
  cartCount?: number;
}

// Briefly flags "just changed" so the badge can pulse without a new library
function useBadgePulse(count: number) {
  const [pulse, setPulse] = useState(false);
  const prev = useRef(count);
  useEffect(() => {
    if (count !== prev.current) {
      setPulse(true);
      prev.current = count;
      const t = setTimeout(() => setPulse(false), 420);
      return () => clearTimeout(t);
    }
  }, [count]);
  return pulse;
}

function Badge({ count, pulse }: { count: number; pulse: boolean }) {
  if (!count) return null;
  return (
    <span
      className={`absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 min-w-[16px] px-[3px]
        rounded-full bg-primary-dark text-background text-[9px] font-semibold leading-none
        transition-transform duration-300 ${pulse ? "scale-125" : "scale-100"}`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function Navbar({
  wishlistCount = 0,
  cartCount = 0,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  let {user}  = useSelector((state : any)=>state.auth)



  const cartItems = useSelector((state: any) => state.cart.items || []);
  const calculatedCartCount = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || item.qty || 1), 0);

  const cartPulse = useBadgePulse(calculatedCartCount);
  const wishlistPulse = useBadgePulse(wishlistCount);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out
          ${scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] border-b border-border/50"
            : "bg-background border-b border-border/30"
          }`}
      >
        {/* ============ DESKTOP / LAPTOP (lg and up) ============ */}
        <div className="hidden lg:flex items-center justify-between h-[72px] px-8 xl:px-12 gap-8 xl:gap-12">
          <div className=" flex items-center gap-4">
            <Link to="/" className="shrink-0 flex items-center">
              <img
                src="/logo.png"
                alt="VYRAAA"
                className="h-20 mt-2 w-auto object-contain "
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </Link>

            <div className="flex-1 min-w-[380px] max-w-[600px]">
              <SearchBar variant="desktop" />
            </div>
          </div>

          <div className="gap-6 xl:gap-8 flex items-center">
            <nav className="flex items-center gap-7 xl:gap-8 shrink-0">
              {NAV_LINKS.map((link) => {
                const active =
                  link.to !== "/" && location.pathname.startsWith(link.to);
                return (
                  <div key={link.label} className="relative group">
                    <Link
                      to={link.to}
                      className="relative py-2 block text-[11px] font-medium tracking-[0.16em] uppercase text-admin-text/85
                      hover:text-primary-dark transition-colors duration-250"
                    >
                      {link.label}
                      <span
                        className={`absolute left-0 -bottom-0.5 h-[1px] bg-primary-dark transition-all duration-300 ease-out
                        ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                      />
                    </Link>
                    {link.columns && <MegaMenu columns={link.columns} />}
                  </div>
                );
              })}
            </nav>

            <div className="w-px h-4 bg-border shrink-0" />

            <div className="flex items-center gap-5 xl:gap-6 shrink-0">
              <Link
                to="/wishlist"
                className="relative text-admin-text/80 hover:text-primary-dark hover:scale-110 transition-all duration-200"
              >
                <Heart size={19} strokeWidth={1.6} />
                <Badge count={wishlistCount} pulse={wishlistPulse} />
              </Link>
              <Link
                to="/checkout/cart"
                className="relative text-admin-text/80 hover:text-primary-dark hover:scale-110 transition-all duration-200"
              >
                <ShoppingBag size={19} strokeWidth={1.6} />
                <Badge count={calculatedCartCount} pulse={cartPulse} />
              </Link>
              <Link
                to={user.role =="admin" ? "/admin" : "/profile"  }

                className="text-admin-text/80 hover:text-primary-dark hover:scale-110 transition-all duration-200"
              >
                <User size={19} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
        </div>

        {/* ============ TABLET (640px - 1024px) ============ */}
        <div className="hidden sm:flex lg:hidden flex-col">
          <div className="flex items-center justify-between h-[68px] px-6 gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="text-admin-text p-1"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="VYRAAA"
                className="h-18 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </Link>
            <div className="flex items-center gap-5">
              <Link to="/wishlist" className="relative text-admin-text/80">
                <Heart size={20} strokeWidth={1.6} />
                <Badge count={wishlistCount} pulse={wishlistPulse} />
              </Link>
              <Link to="/checkout/cart" className="relative text-admin-text/80">
                <ShoppingBag size={20} strokeWidth={1.6} />
                <Badge count={calculatedCartCount} pulse={cartPulse} />
              </Link>
              <Link to="/profile" className="text-admin-text/80">
                <User size={20} strokeWidth={1.6} />
              </Link>
            </div>
          </div>
          <div className="px-6 pb-3">
            <SearchBar variant="mobile" />
          </div>
        </div>

        {/* ============ MOBILE (below 640px) ============ */}
        <div className="sm:hidden flex flex-col">
          <div className="grid grid-cols-3 items-center h-16 px-4">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="justify-self-start text-admin-text p-1"
            >
              <Menu size={22} strokeWidth={1.6} />
            </button>
            <Link to="/" className="  justify-self-center flex items-center">
              <img
                src="/logo.png"
                alt="VYRAAA"
                className="h-16 mt-1 w-auto object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </Link>
            <div className="justify-self-end flex items-center gap-4">
              <Link to="/wishlist" className="relative text-admin-text/80">
                <Heart size={20} strokeWidth={1.6} />
                <Badge count={wishlistCount} pulse={wishlistPulse} />
              </Link>
              <Link to="/checkout/cart" className="relative text-admin-text/80">
                <ShoppingBag size={20} strokeWidth={1.6} />
                <Badge count={calculatedCartCount} pulse={cartPulse} />
              </Link>
            </div>
          </div>
          <div className="px-4 pb-3">
            <SearchBar variant="mobile" placeholder="Search products..." />
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}
