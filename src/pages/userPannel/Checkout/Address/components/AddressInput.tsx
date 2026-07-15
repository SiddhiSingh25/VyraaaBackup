import { useId, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface AddressInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  required?: boolean;
  hint?: string;
}

/**
 * Floating-label text field. The label rests inside the field until
 * focus or content pushes it up, the border warms to the primary
 * colour on focus, and a success check appears once a field has been
 * validated (used for the PIN code auto-fill moment).
 */
export function AddressInput({
  label,
  value,
  onChange,
  error,
  success,
  required,
  hint,
  id,
  ...rest
}: AddressInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [isFocused, setIsFocused] = useState(false);
  const isFloated = isFocused || value.length > 0;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={inputId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`peer w-full rounded-xl border bg-background px-4 pt-5 pb-2 text-[15px] text-admin-text outline-none transition-colors duration-200
            ${error ? "border-error" : success ? "border-success" : "border-border"}
            focus:border-primary`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />

        <motion.label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 origin-left text-muted"
          animate={{
            top: isFloated ? 7 : "50%",
            y: isFloated ? 0 : "-50%",
            scale: isFloated ? 0.78 : 1,
            color: error ? "#ba1a1a" : isFocused ? "#835240" : "#84746e",
          }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {label}
          {required && <span className="text-primary"> *</span>}
        </motion.label>

        {success && !error && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-success"
          >
            <Check size={18} strokeWidth={2.5} />
          </motion.span>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 pl-1 text-xs text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 pl-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
