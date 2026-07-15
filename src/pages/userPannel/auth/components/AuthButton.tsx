import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

interface AuthButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "outline";
}

/**
 * Primary CTA button for auth forms. Disables and shows a spinner while `loading`.
 */
const AuthButton = ({
  children,
  loading = false,
  variant = "primary",
  disabled,
  className = "",
  ...rest
}: AuthButtonProps) => {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60";
  const variants = {
    primary: "bg-primary text-background hover:bg-primary-dark shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary/10",
    outline: "border border-border bg-transparent text-heading hover:bg-card hover:shadow-sm focus:ring-4 focus:ring-border/10",
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.01, y: -0.5 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.99 } : undefined}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AuthButton;
