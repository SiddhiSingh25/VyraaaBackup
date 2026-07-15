import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface SocialButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  icon: ReactNode;
  label: string;
}

/**
 * UI-only social auth button (e.g. Google, Facebook). Wire onClick when backend is ready.
 */
const SocialButton = ({ icon, label, className = "", ...rest }: SocialButtonProps) => {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className={`flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-medium text-body transition-colors duration-200 hover:bg-card ${className}`}
      {...rest}
    >
      {icon}
      {label}
    </motion.button>
  );
};

export default SocialButton;
