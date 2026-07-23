import React from "react";

interface OutlinedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const OutlinedButton = ({ text, onClick, disabled, ...props }: OutlinedButtonProps) => {
  return (
    <div className="text-center mt-10">
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-block border border-heading/30 text-admin-text px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-heading hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-400 cursor-pointer"
        {...props}
      >
        {text}
      </button>
    </div>
  );
};

export default OutlinedButton;

