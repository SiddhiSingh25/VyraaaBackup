import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  variant = "desktop",
  placeholder = "Search for products, brands and more",
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const isMobile = variant === "mobile";

  return (
    <div className={`relative w-full ${isMobile ? "h-10" : "h-10"} ${className}`}>
      <div
        className={`flex items-center w-full h-full rounded-full border bg-heading/[0.035]
          transition-all duration-300 ease-out
          ${
            focused
              ? "border-primary/40 bg-background shadow-[0_0_0_4px_rgba(0,0,0,0.03)] ring-2 ring-primary/15"
              : "border-border/70 hover:border-border"
          }`}
      >
        <Search
          size={16}
          strokeWidth={1.8}
          className={`ml-4 shrink-0 transition-colors duration-300 ${
            focused ? "text-primary-dark" : "text-admin-text/40"
          }`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent px-3 text-[13px] tracking-wide text-admin-text
            placeholder:text-admin-text/50 focus:outline-none "
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Clear search"
            className="mr-3 text-admin-text/30 hover:text-admin-text/60 transition-colors duration-200"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}





