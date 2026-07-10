import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-dark text-white hover:bg-dark-800 focus-visible:ring-dark/40 shadow-sm',
  secondary:
    'bg-white text-dark/70 border border-dark-200 hover:bg-dark-50 focus-visible:ring-dark-300/50',
  danger:
    'bg-white text-red-600 border border-red-200 hover:bg-red-50 focus-visible:ring-red-300/50',
  ghost: 'bg-transparent text-dark-500 hover:bg-dark-100 focus-visible:ring-dark-300/50',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-8 px-2.5 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 disabled:pointer-events-none
          ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
