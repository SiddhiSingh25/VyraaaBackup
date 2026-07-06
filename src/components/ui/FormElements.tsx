// src/components/ui/FormElements.tsx
import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from "react";

// --- REUSABLE INPUT ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted font-body">
          {label} {required && <span className="text-error">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full rounded-md border bg-surface px-4 py-2.5 text-sm text-body transition focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary ${error ? "border-error" : "border-border"
            } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error font-body">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// --- REUSABLE SELECT ---
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, options, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted font-body">
          {label} {required && <span className="text-error">*</span>}
        </label>
        <select
          ref={ref}
          className={`w-full rounded-md border bg-surface px-4 py-2.5 text-sm text-body transition focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-error" : "border-border"
            } ${className}`}
          {...props}
        >
          <option value="" disabled className="text-muted">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-error font-body">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// --- REUSABLE TEXTAREA ---
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted font-body">
          {label} {required && <span className="text-error">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full resize-y rounded-md border bg-surface px-4 py-2.5 text-sm text-body transition focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary ${error ? "border-error" : "border-border"
            } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error font-body">{error}</p>}
      </div>
    );
  }
);
TextArea.displayName = "TextArea";

// --- REUSABLE BUTTON ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-body transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-primary text-background hover:bg-primary-dark rounded-md px-6 py-2 text-sm font-semibold shadow-sm tracking-wide",
      secondary: "bg-card text-heading hover:bg-border rounded-md px-6 py-2 text-sm font-semibold border border-border shadow-sm tracking-wide",
      outline: "bg-transparent text-primary hover:bg-surface border border-primary rounded-md px-6 py-2 text-sm font-semibold tracking-wide",
      ghost: "bg-transparent text-muted hover:text-heading hover:bg-surface rounded-md px-4 py-2 text-sm font-medium",
      icon: "p-2 rounded-full border border-border bg-surface text-primary hover:bg-card hover:border-primary-light transition-colors",
    };

    return (
      <button ref={ref} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";