

import {  ArrowRight, Mail } from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa6";

const MAISON_LINKS = ["The Atelier", "Sustainability", "Store Locator", "Careers"];
const SERVICE_LINKS = ["Shipping & Returns", "Size Guide", "Privacy Policy", "Contact Us"];

const SOCIALS = [
  { icon: FaFacebook, label: "Facebook" },
  { icon: FaInstagram, label: "Instagram" },
  // Lucide has no Pinterest glyph — swap in a custom svg/icon set if you need Pinterest specifically.
];

export default function Footer() {
  return (
    <footer className="bg-dark relative pt-20 sm:pt-24 pb-8 sm:pb-10 overflow-hidden">
      {/* subtle ambient glow for a premium feel */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-light/40 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-primary/10 blur-[120px]" />

      {/* Centered brand mark */}
      <div className="relative flex flex-col items-center text-center px-5 mb-16 sm:mb-20">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-primary-light/30 flex items-center justify-center mb-5">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 sm:w-40 sm:h-40 object-contain" />
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl text-white tracking-[0.08em] mb-2">
          VYRAAA
        </h3>
        <p className="text-[10px] tracking-[0.35em] uppercase text-primary-light/70 mb-6">
          Est. 2014
        </p>

        <div className="flex items-center gap-4">
          {SOCIALS.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-dark hover:bg-primary-light hover:border-primary-light transition-all duration-300"
            >
              <Icon size={15} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 px-5 sm:px-10 lg:px-20 max-w-[1100px] mx-auto mb-12 sm:mb-16">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <h4 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary-light/60 mb-1 sm:mb-2">
            The Maison
          </h4>
          {MAISON_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4">
          <h4 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary-light/60 mb-1 sm:mb-2">
            Client Services
          </h4>
          {SERVICE_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-sm text-white/50 hover:text-white transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
          <h4 className="text-[10px] font-medium tracking-[0.3em] uppercase text-primary-light/60">
            Newsletter
          </h4>
          <p className="text-sm text-white/40 leading-relaxed max-w-[240px]">
            Exclusive access to launches, editorials, and member-only events.
          </p>
          <div className="relative w-full max-w-[240px]">
            <Mail
              size={15}
              strokeWidth={1.5}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-white/15 py-3 pl-6 pr-8 text-sm text-white focus:outline-none focus:border-primary-light transition-colors placeholder:text-white/25"
            />
            <button
              type="button"
              aria-label="Subscribe"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-primary-light transition-colors"
            >
              <ArrowRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto pt-6 sm:pt-8 border-t border-white/10">
        <p className="text-[10px] text-white/20 tracking-[0.18em] uppercase text-center">
          © {new Date().getFullYear()} VYRAAA. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}