import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface RememberMeProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

/**
 * Styled checkbox for "Remember Me". Pass react-hook-form's `register(...)` spread as props.
 */
const RememberMe = forwardRef<HTMLInputElement, RememberMeProps>(
  ({ label = "Remember Me", ...rest }, ref) => {
    return (
      <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-body">
        <input
          ref={ref}
          {...rest}
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-border text-primary accent-primary focus:ring-2 focus:ring-primary/15"
        />
        {label}
      </label>
    );
  }
);

RememberMe.displayName = "RememberMe";

export default RememberMe;
