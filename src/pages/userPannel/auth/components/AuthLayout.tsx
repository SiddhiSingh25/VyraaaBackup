import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import authMobile from "@/assets/auth/authMobile.png";

interface AuthLayoutProps {
  image: string;
  imageAlt: string;
  children: ReactNode;
}

/**
 * Shared auth shell: warm gradient backdrop + a floating, rounded,
 * shadowed card (Flipkart-style modal feel) rather than a full-bleed panel.
 */
const AuthLayout = ({ image, imageAlt, children }: AuthLayoutProps) => {
  return (
    <div
      className="
        relative w-full
        min-h-[100dvh] md:h-screen
        flex items-center justify-center
        p-0 xs:p-3 sm:p-4 md:p-6 lg:p-12 xl:p-20 2xl:p-32
        bg-gradient-to-br from-[#fdf9f3] via-[#f6ece3] to-[#ead9c8]
        overflow-y-auto md:overflow-hidden
      "
    >
      {/* Ambient rose-gold glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute w-[70vw] h-[60vw] sm:w-[60vw] sm:h-[55vw] max-w-[700px] max-h-[600px] rounded-full bg-[#b76e79]/20 blur-[80px] sm:blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="
          relative z-10
          w-full max-w-4xl
          bg-[#fcfaf8]
          rounded-none md:rounded-[2rem]
          overflow-hidden
          shadow-[0_20px_60px_-10px_rgba(131,82,64,0.25)]
          border border-[#835240]/10
          flex flex-col md:flex-row
          min-h-[100dvh] md:min-h-0
          md:h-[85vh] lg:h-[80vh]
          md:max-h-[720px]
        "
      >
        {/* Mobile: top image banner */}
        <div
          className="relative block w-full overflow-hidden md:hidden shrink-0"
          style={{ height: "clamp(160px, 30vh, 280px)" }}
        >
          <img
            src={authMobile}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fcfaf8] via-transparent to-transparent" />
        </div>

        {/* Desktop/tablet: left image panel */}
        <div className="relative hidden md:block md:w-[42%] lg:w-[45%] shrink-0 overflow-hidden">
          <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#835240]/30 via-transparent to-transparent" />
        </div>

        {/* Form panel */}
        <div
          className="
            flex-1 min-h-0
            flex items-start sm:items-center justify-center
            overflow-y-auto
            px-5 py-8
            xs:px-6
            sm:px-8 sm:py-10
            md:px-6 md:py-6
            lg:px-10
          "
        >
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;