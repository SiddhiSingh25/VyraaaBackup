import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { FaTwitter, FaYoutube } from "react-icons/fa";
const SHOP_LINKS = ["Women", "Men", "Beauty", "Jewellery", "Shoes", "Accessories"];
const SUPPORT_LINKS = ["Contact", "FAQs", "Shipping", "Returns", "Track Order", "Privacy Policy"];

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram" },
  { icon: FaFacebook, label: "Facebook" },
  { icon: FaTwitter, label: "X" },
  { icon: FaYoutube, label: "YouTube" },
];

const PAYMENT_ICONS = ["Visa", "Mastercard", "Amex", "UPI", "PayPal"];

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
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return {
    ref,
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
    },
  };
}

function FooterColumnTitle({ children } :any) {
  return (
    <h4 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#F7F5F1] mb-5">
      {children}
    </h4>
  );
}

function FooterLink({ children } : any) {
  return (
    <a
      href="#"
      className="group inline-flex items-center text-sm text-[#dbd3c4] hover:text-[#1E1E1E] transition-colors duration-300"
    >
      <span className="transition-transform duration-300 group-hover:translate-x-[3px]">
        {children}
      </span>
    </a>
  );
}

export default function Footer() {
  const col1 = useFadeUp(0);
  const col2 = useFadeUp(80);
  const col3 = useFadeUp(160);
  const col4 = useFadeUp(240);
  const bottom = useFadeUp(320);

  return (
    <footer className="relative bg-dark border-t border-[rgba(0,0,0,0.08)]">
      {/* hairline accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B89B5E]/50 to-transparent" />

      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 lg:gap-x-12">
          {/* Column 1 — Brand */}
          <div ref={col1.ref} style={col1.style} className="flex flex-col">
            <h3 className="font-serif text-[26px] tracking-[0.12em] text-[#fff] mb-3">
              VYRAAA
            </h3>
            <p className="text-xs leading-relaxed text-[#dbd3c4] max-w-[220px] mb-6">
              Curated fashion, fine jewellery, and fragrance for those who
              value craft over noise. Est. 2014.
            </p>
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[rgba(0,0,0,0.1)] flex items-center justify-center text-[#F7F5F1]/60 hover:text-[#1E1E1E] hover:bg-[#B89B5E]/10 hover:border-[#B89B5E]/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Icon size={14} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div ref={col2.ref} style={col2.style} className="flex flex-col">
            <FooterColumnTitle>Shop</FooterColumnTitle>
            <ul className="flex flex-col gap-3">
              {SHOP_LINKS.map((label) => (
                <li key={label}>
                  <FooterLink>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Support */}
          <div ref={col3.ref} style={col3.style} className="flex flex-col">
            <FooterColumnTitle>Support</FooterColumnTitle>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map((label) => (
                <li key={label}>
                  <FooterLink>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div ref={col4.ref} style={col4.style} className="flex flex-col">
            <FooterColumnTitle>Newsletter</FooterColumnTitle>
            <p className="text-xs leading-relaxed text-[#dbd3c4] mb-5 max-w-[240px]">
              Be first to know about new arrivals and private events.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center w-full max-w-[260px] border-b border-[rgba(243,243,243,0.18)] focus-within:border-[rgba(243,243,243,0.18)]] transition-colors duration-300"
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full bg-transparent py-2.5 text-sm placeholder:text-[#dbd3c4] text-[#dbd3c4] placeholder:text-[#777]/60 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#1E1E1E] hover:bg-[#B89B5E] hover:text-white transition-all duration-300 hover:scale-[1.02]"
              >
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div ref={bottom.ref} style={bottom.style}>
          <div className="h-px bg-[rgba(0,0,0,0.08)] mt-14 mb-6" />

          {/* Bottom row */}
          <div className="flex flex-col  items-center justify-center gap-4 sm:gap-0 text-[11px] tracking-[0.04em] text-[#dbd3c4]">
            <p className="order-2 sm:order-1">© 2026 VYRAAA. All Rights Reserved.</p>

     


          </div>
        </div>
      </div>
    </footer>
  );
}