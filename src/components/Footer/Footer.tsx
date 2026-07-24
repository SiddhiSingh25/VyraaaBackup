import { useEffect, useRef, useState } from "react";
import { ArrowRight, Mail, Phone, Globe } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";

const toSlug = (text: string) => {
  return text?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
};

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaFacebook, label: "Facebook" },
  { icon: FaTwitter, label: "X" },
  { icon: FaYoutube, label: "YouTube" },
];

const SUPPORT_LINKS = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms and Conditions", to: "/terms-condtions" },
];

/** Small hook: fades a section up into view once, with an optional stagger delay. */
function useFadeUp(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  };
}

function FooterColumnTitle({ children }: any) {
  return (
    <h4 className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#C5A880] mb-4">
      {children}
    </h4>
  );
}

interface FooterLinkProps {
  children: React.ReactNode;
  to?: string;
  state?: any;
}

function FooterLink({ children, to, state }: FooterLinkProps) {
  const linkClasses = "group relative inline-flex items-center text-xs text-[#f7f4ed]/90 hover:text-[#C5A880] transition-colors duration-300 py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-[#C5A880] after:transition-all after:duration-300 after:ease-out";

  if (to) {
    return (
      <Link to={to} state={state} className={linkClasses}>
        <span>{children}</span>
      </Link>
    );
  }
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className={linkClasses}>
      <span>{children}</span>
    </a>
  );
}

export default function Footer() {
  const col1 = useFadeUp(0);
  const col2 = useFadeUp(80);
  const col3 = useFadeUp(160);
  const col4 = useFadeUp(240);
  const bottom = useFadeUp(320);

  const { getQuery } = useGetQuery();
  const [categories, setCategories] = useState<any[]>([]);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data.slice(0, 6)); // show first 6 categories
        }
      },
      onFail: (err: any) => {
        console.error("Failed to fetch footer categories:", err);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <footer className="relative bg-[#0d0a08] overflow-hidden">
      {/* Luxury radial background glow */}
      <div className="absolute inset-0 bg-dark pointer-events-none" />

      {/* Sophisticated top aesthetic border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A880]/30 to-transparent" />

      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 pt-14 pb-8 lg:pt-16 lg:pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8 lg:gap-x-10 pb-10">

          {/* Column 1 — Brand Column (Span 4) */}
          <div ref={col1.ref} style={col1.style} className="md:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-heading text-2xl tracking-[0.25em] text-white mb-4 transition-colors duration-300 hover:text-[#C5A880]">
                VYRAAA
              </h3>
              <p className="text-xs leading-relaxed text-[#f7f4ed]/90 max-w-[280px] mb-4 font-light">
                Curated fashion, fine products, and fragrance for those who
                value craft over noise.
              </p>

              {/* Verified contact layout */}
              <div className="space-y-3.5 mb-6 text-xs font-light text-[#f7f4ed]/95">
                <a href="mailto:support@vyraaa.com" className="flex items-center gap-3 group hover:text-[#C5A880] transition-colors duration-300">
                  <Mail size={13} className="text-[#C5A880]/90 group-hover:scale-110 transition-transform" />
                  <span>support@vyraaa.com</span>
                </a>

                <a href="tel:8796571232" className="flex items-center gap-3 group hover:text-[#C5A880] transition-colors duration-300">
                  <Phone size={13} className="text-[#C5A880]/90 group-hover:scale-110 transition-transform" />
                  <span>8796571232</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  to="/"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#f7f4ed]/75 hover:text-[#0d0a08] hover:bg-[#C5A880] hover:border-[#C5A880] transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-[0_4px_12px_rgba(197,168,128,0.25)]"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 — Shop (Span 2) */}
          <div ref={col2.ref} style={col2.style} className="md:col-span-2 flex flex-col">
            <FooterColumnTitle>Shop</FooterColumnTitle>
            <ul className="flex flex-col gap-3">
              {categories.map((cat: any) => (
                <li key={cat._id}>
                  <FooterLink
                    to={`/${toSlug(cat.category)}`}
                    state={{
                      categoryId: cat._id,
                      fullCategoryData: cat,
                    }}
                  >
                    {cat.category}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Support (Span 2) */}
          <div ref={col3.ref} style={col3.style} className="md:col-span-2 flex flex-col">
            <FooterColumnTitle>Support</FooterColumnTitle>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Join Client List / Go to Cart (Span 4) */}
          <div ref={col4.ref} style={col4.style} className="md:col-span-4 flex flex-col justify-start">
            {user ? (
              <>
                <FooterColumnTitle>Your Bag</FooterColumnTitle>
                <p className="text-xs leading-relaxed text-[#f7f4ed]/90 mb-4 max-w-[280px] font-light">
                  Go to your cart and buy the products you may have forgotten. Your favorites are waiting for you!
                </p>
                <div>
                  <Link
                    to="/cart"
                    className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden rounded-sm bg-[#C5A880] hover:bg-[#b09366] text-[#0d0a08] font-body text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(197,168,128,0.25)]"
                  >
                    Go To Cart
                  </Link>
                </div>
              </>
            ) : (
              <>
                <FooterColumnTitle>Vyraaa People</FooterColumnTitle>
                <p className="text-xs leading-relaxed text-[#f7f4ed]/90 mb-4 max-w-[280px] font-light">
                  Create an exclusive account to explore our collections, build your private wishlist, and purchase original products.
                </p>
                <div>
                  <Link
                    to="/auth/signup"
                    className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden rounded-sm bg-[#C5A880] hover:bg-[#b09366] text-[#0d0a08] font-body text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(197,168,128,0.25)]"
                  >
                    Create Account
                  </Link>
                </div>
              </>
            )}
          </div>

        </div>

        {/* Delicate Golden Divider */}
        <div ref={bottom.ref} style={bottom.style} className="border-t border-white/5 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-[10px] tracking-[0.05em] text-[#f7f4ed]/60">
            <p className="order-2 md:order-1 font-light">
              © {new Date().getFullYear()} VYRAAA. All Rights Reserved. Crafted for elegance.
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
}