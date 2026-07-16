import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Password field with show/hide toggle. Pass react-hook-form's `register(...)` spread as props.
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...rest }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="mb-3">
        <label
          htmlFor={rest.id ?? rest.name}
          className="mb-1.5 block text-sm font-medium text-heading"
        >
          {label}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            <FiLock size={16} />
          </span>
          <input
            ref={ref}
            {...rest}
            id={rest.id ?? rest.name}
            type={visible ? "text" : "password"}
            className={`w-full rounded-xl border bg-background py-3 pl-10 pr-11 text-sm text-body outline-none transition-all duration-200 placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/15 ${error ? "border-error focus:border-error focus:ring-error/15" : "border-border"
              } ${className}`}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-heading"
          >
            {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
