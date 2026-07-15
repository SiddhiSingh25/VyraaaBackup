import type { ReactNode } from "react";

interface AuthHeaderProps {
  title: string;
  highlight?: string;
  subtitle?: ReactNode;
}

/**
 * Consistent heading block used across auth pages.
 */
const AuthHeader = ({ title, highlight, subtitle }: AuthHeaderProps) => {
  return (
    <div className="mb-4 md:mb-5 lg:mb-6">
      <h1 className="font-heading text-2xl md:text-[1.75rem] lg:text-3xl xl:text-[2.1rem] font-bold tracking-tight leading-tight text-heading">
        {title}{" "}
        {highlight && (
          <span className="font-extrabold text-primary">
            {highlight}
          </span>
        )}
      </h1>

      {subtitle && (
        <p className="mt-2 text-sm md:text-[0.9rem] lg:text-base leading-relaxed text-muted font-medium max-w-md">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;