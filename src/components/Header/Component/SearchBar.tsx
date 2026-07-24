import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, ArrowLeft } from "lucide-react";

interface SearchBarProps {
  variant?: "desktop" | "mobile";
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

const SEARCH_DEBOUNCE_MS = 450;
const PRODUCT_LISTING_PATH = "/products"; // <-- adjust to your actual listing route

export default function SearchBar({
  variant = "desktop",
  placeholder = "Search for products, brands and more",
  className = "",
  onClose,
}: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navSearch = (location.state as any)?.search || "";
  const [value, setValue] = useState(navSearch);
  const [focused, setFocused] = useState(false);
  const isMobile = variant === "mobile";
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input value with router state search term
  useEffect(() => {
    setValue(navSearch);
  }, [navSearch]);

  // Debounced navigation as-you-type
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();
    const currentSearch = (location.state as any)?.search || "";

    if (trimmed !== currentSearch) {
      debounceRef.current = setTimeout(() => {
        const nextState = trimmed ? { search: trimmed } : {};
        navigate(PRODUCT_LISTING_PATH, { state: nextState });
      }, SEARCH_DEBOUNCE_MS);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, navSearch, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = value.trim();
      const nextState = trimmed ? { search: trimmed } : {};
      navigate(PRODUCT_LISTING_PATH, { state: nextState });
    }
  };

  return (
    <div className={`relative flex items-center w-full ${isMobile ? "h-10" : "h-10"} ${className}`}>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="mr-3 p-1 shrink-0 text-admin-text/70 hover:text-primary-dark transition-colors duration-200"
        >
          <ArrowLeft size={20} strokeWidth={1.8} />
        </button>
      )}
      <div
        className={`flex items-center w-full h-full rounded-full border bg-heading/[0.035]
          transition-all duration-300 ease-out
          ${focused
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
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent px-3 text-[13px] tracking-wide text-admin-text
            placeholder:text-admin-text/50 focus:outline-none"
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