import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PaymentMethodCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
  logo?: ReactNode;
  children?: ReactNode;
}

export default function PaymentMethodCard({
  title,
  description,
  selected,
  onSelect,
  recommended,
  logo,
  children,
}: PaymentMethodCardProps) {
  return (
    <motion.div
      layout
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      whileHover={{ y: -2 }}
      className={`vyraaa-card-shadow cursor-pointer rounded-2xl border bg-card p-4 transition-colors duration-200 sm:p-5 ${
        selected ? "border-primary" : "border-border"
      }`}
      style={{
        backgroundColor: selected ? "#f2e8dd" : "#f8f4ee",
      }}
    >
      <div className="flex items-start gap-3.5">
        {logo && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
            {logo}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-body text-[15px] font-semibold text-heading">{title}</p>
            {recommended && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-primary">
                Recommended
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 font-body text-[13px] leading-snug text-muted">
              {description}
            </p>
          )}
          {children}
        </div>

        <span
          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
          style={{ borderColor: selected ? "#835240" : "#e6d9cf" }}
        >
          {selected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="h-2.5 w-2.5 rounded-full bg-primary"
            />
          )}
        </span>
      </div>
    </motion.div>
  );
}
