import React from 'react';

interface SectionHeaderProps {
  tagline: string;
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tagline,
  title,
  subtitle,
  viewAllLink,
  viewAllText = "View All",
  className = "",
}) => {
  return (
    <div
      data-reveal
      className={`group/header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16 border-b border-neutral-100 dark:border-neutral-900 pb-6 sm:pb-8 ${className}`}
    >
      {/* Left Side: Typography Stack */}
      <div className="max-w-3xl space-y-3">
        <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 px-2.5 py-1 rounded-sm selection:bg-primary/20">
          {tagline}
        </span>
        
        <h2 className="font-serif font-light text-neutral-900 dark:text-neutral-50 text-[clamp(28px,4.5vw,48px)] leading-[1.15] tracking-tight sm:-tracking-[0.02em]">
          {title}
        </h2>

        {subtitle && (
          <p className="max-w-2xl font-sans text-neutral-500 dark:text-neutral-400 text-sm sm:text-base font-normal leading-relaxed pt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Side: Editorial Interactive Link */}
      {viewAllLink && (
        <a
          href={viewAllLink}
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-900 dark:text-neutral-100 transition-colors duration-300 self-start md:self-auto pb-1 relative group/link"
        >
          <span>{viewAllText}</span>
          
          {/* Elegant Minimalist Arrow */}
          <svg 
            className="w-3.5 h-3.5 transform transition-transform duration-300 ease-out group-hover/link:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>

          {/* Reveal Underline Effect */}
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900 dark:bg-neutral-100 origin-right scale-x-0 transition-transform duration-300 ease-out group-hover/link:origin-left group-hover/link:scale-x-100" />
        </a>
      )}
    </div>
  );
};

export default SectionHeader;