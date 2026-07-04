import { motion } from "framer-motion";
import { Home, Briefcase, MapPin } from "lucide-react";
import type { AddressType } from "../types/address";

interface AddressTypeSelectorProps {
  value: AddressType;
  onChange: (type: AddressType) => void;
}

const OPTIONS: { value: AddressType; label: string; icon: typeof Home }[] = [
  { value: "home", label: "Home", icon: Home },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "other", label: "Other", icon: MapPin },
];

export function AddressTypeSelector({ value, onChange }: AddressTypeSelectorProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-heading">Address Type</p>
      <div role="radiogroup" aria-label="Address type" className="flex flex-wrap gap-3">
        {OPTIONS.map(({ value: optionValue, label, icon: Icon }) => {
          const isSelected = value === optionValue;
          return (
            <button
              key={optionValue}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(optionValue)}
              className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2"
            >
              {isSelected && (
                <motion.span
                  layoutId="address-type-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200
                  ${isSelected ? "border-primary text-white" : "border-border text-body hover:border-primary-light"}`}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
