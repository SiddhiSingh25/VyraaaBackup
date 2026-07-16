import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Rounded, soft-shadow card wrapper used for every auth form.
 */
const AuthCard = ({ children, className = "" }: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-2xl sm:rounded-3xl bg-surface  shadow-xl md:shadow-2xl border border-border/30 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AuthCard;
