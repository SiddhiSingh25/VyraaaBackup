import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface DefaultCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function DefaultCheckbox({ checked, onChange }: DefaultCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2
          ${checked ? "border-primary bg-primary" : "border-border bg-background"}`}
      >
        <motion.span
          initial={false}
          animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <Check size={13} strokeWidth={3} className="text-white" />
        </motion.span>
      </button>
      <span className="text-sm text-body">Make this my default delivery address</span>
    </label>
  );
}
