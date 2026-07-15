import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

/**
 * Standard text input for auth forms. Pass react-hook-form's `register(...)` spread as props.
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, icon, className = "", ...rest }, ref) => {
    return (
      <div className="mb-3">
        <label
          htmlFor={rest.id ?? rest.name}
          className="mb-2 block text-sm font-medium text-heading/90 tracking-wide"
        >
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted/80 transition-colors duration-200">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            {...rest}
            id={rest.id ?? rest.name}
            className={`w-full rounded-xl border bg-background px-4 py-3.5 text-sm text-body outline-none transition-all duration-300 placeholder:text-muted/50 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 ${icon ? "pl-11" : ""
              } ${error ? "border-error focus:border-error focus:ring-error/10" : "border-border"
              } ${className}`}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-error font-medium">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
