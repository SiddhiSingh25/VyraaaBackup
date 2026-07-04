import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { PaymentCategory, PaymentCategoryId } from "../types";

interface PaymentMethodSidebarProps {
  categories: PaymentCategory[];
  activeId: PaymentCategoryId;
  onSelect: (id: PaymentCategoryId) => void;
}

export default function PaymentMethodSidebar({
  categories,
  activeId,
  onSelect,
}: PaymentMethodSidebarProps) {
  return (
    <nav
      aria-label="Payment categories"
      className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-2"
    >
      {categories.map((cat) => {
        const Icon = (Icons as any)[cat.icon] ?? Icons.Circle;
        const isActive = cat.id === activeId;

        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className="relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors duration-200"
            style={{
              backgroundColor: isActive ? "#835240" : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = "#f2e8dd";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {isActive && (
              <motion.span
                layoutId="active-category-indicator"
                className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-rose-gold"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            <Icon
              className="h-[18px] w-[18px] shrink-0"
              strokeWidth={1.75}
              style={{ color: isActive ? "#fdf9f3" : "#84746e" }}
            />

            <span
              className="font-body text-[13.5px] font-medium leading-snug"
              style={{ color: isActive ? "#fdf9f3" : "#51443f" }}
            >
              {cat.label}
            </span>

            {cat.badge && (
              <span
                className="ml-auto rounded-full px-2 py-0.5 font-body text-[10px] font-semibold"
                style={{
                  backgroundColor: isActive ? "rgba(253,249,243,0.18)" : "#e6d9cf",
                  color: isActive ? "#fdf9f3" : "#835240",
                }}
              >
                {cat.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
