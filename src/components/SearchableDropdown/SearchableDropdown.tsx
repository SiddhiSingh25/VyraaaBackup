// SearchableSelect.tsx
import {
  forwardRef,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useId,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X, Plus, Loader2 } from "lucide-react";

interface SearchableSelectOption {
  label: string;
  value: string | number;
}

interface SearchableSelectProps {
  label: string;
  error?: string;
  options: SearchableSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  loading?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAdd?: (query?: string) => void;
  clearable?: boolean;
  className?: string;

  // react-hook-form register() shape: { name, onChange, onBlur, ref }
  name?: string;
  value?: string | number;
  onChange?: (event: {
    target: { name?: string; value: string | number | "" };
    type: "change";
  }) => void;
  onBlur?: (event: {
    target: { name?: string; value: string | number | "" };
    type: "blur";
  }) => void;
}

export const SearchableSelect = forwardRef<
  HTMLInputElement,
  SearchableSelectProps
>(
  (
    {
      label,
      error,
      required,
      disabled,
      options,
      placeholder = "Select an option",
      loading = false,
      showAddButton = false,
      addButtonText = "Add new",
      onAdd,
      clearable = true,
      className = "",
      name,
      value,
      onChange,
      onBlur,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listboxId = `${useId()}-listbox`;

    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === value) ?? null,
      [options, value],
    );

    const filteredOptions = useMemo(() => {
      if (!query.trim()) return options;
      const normalized = query.trim().toLowerCase();
      return options.filter((opt) =>
        opt.label.toLowerCase().includes(normalized),
      );
    }, [options, query]);

    // does the typed query already exist (case-insensitive) among options?
    const trimmedQuery = query.trim();
    const queryMatchesExisting = useMemo(() => {
      if (!trimmedQuery) return true;
      return options.some(
        (opt) => opt.label.toLowerCase() === trimmedQuery.toLowerCase(),
      );
    }, [options, trimmedQuery]);

    const canAddFromQuery =
      showAddButton &&
      !!onAdd &&
      trimmedQuery.length > 0 &&
      !queryMatchesExisting;

    useEffect(() => {
      if (activeIndex < 0 || !listRef.current) return;
      listRef.current
        .querySelector<HTMLLIElement>(`[data-index="${activeIndex}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    const emitChange = useCallback(
      (nextValue: string | number | "") => {
        onChange?.({ target: { name, value: nextValue }, type: "change" });
      },
      [onChange, name],
    );

    const emitBlur = useCallback(() => {
      onBlur?.({ target: { name, value: value ?? "" }, type: "blur" });
    }, [onBlur, name, value]);

    const close = useCallback(() => {
      setIsOpen(false);
      setQuery("");
      setActiveIndex(-1);
      emitBlur();
    }, [emitBlur]);

    useEffect(() => {
      function handlePointerDown(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          if (isOpen) close();
        }
      }
      document.addEventListener("mousedown", handlePointerDown);
      return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [isOpen, close]);

    const open = useCallback(() => {
      if (disabled) return;
      setIsOpen(true);
      const currentIndex = selectedOption
        ? options.findIndex((o) => o.value === selectedOption.value)
        : -1;
      setActiveIndex(currentIndex);
    }, [disabled, options, selectedOption]);

    useEffect(() => {
      if (isOpen) {
        const frame = requestAnimationFrame(() =>
          searchInputRef.current?.focus(),
        );
        return () => cancelAnimationFrame(frame);
      }
    }, [isOpen]);

    const toggleOpen = useCallback(() => {
      if (disabled) return;
      isOpen ? close() : open();
    }, [disabled, isOpen, open, close]);

    const handleSelect = useCallback(
      (opt: SearchableSelectOption) => {
        emitChange(opt.value);
        close();
      },
      [emitChange, close],
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        emitChange("");
      },
      [emitChange],
    );

    // add using whatever text is currently typed in the search box
    const handleAddFromQuery = useCallback(() => {
      if (!onAdd) return;
      const typed = trimmedQuery;
      setIsOpen(false);
      setQuery("");
      setActiveIndex(-1);
      emitBlur();
      onAdd(typed);
    }, [onAdd, trimmedQuery, emitBlur]);

    // add without any typed text (plain "Add new" trigger)
    const handleAddPlain = useCallback(() => {
      console.log("clicked");
      console.log(onAdd);
      console.log(trimmedQuery);
      if (!trimmedQuery) return;
      close();
      onAdd?.(trimmedQuery);
    }, [close, onAdd, trimmedQuery]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!isOpen) {
          if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
            e.preventDefault();
            open();
          }
          return;
        }
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((p) => Math.min(p + 1, filteredOptions.length - 1));
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((p) => Math.max(p - 1, 0));
            break;
          case "Enter":
            e.preventDefault();
            if (activeIndex >= 0 && filteredOptions[activeIndex]) {
              handleSelect(filteredOptions[activeIndex]);
            } else if (canAddFromQuery) {
              // no option is active/matched, but there's a valid new query -> add it
              handleAddFromQuery();
            }
            break;
          case "Escape":
            e.preventDefault();
            close();
            break;
          case "Tab":
            close();
            break;
        }
      },
      [
        isOpen,
        open,
        close,
        activeIndex,
        filteredOptions,
        handleSelect,
        canAddFromQuery,
        handleAddFromQuery,
      ],
    );

    const showEmptyState = !loading && filteredOptions.length === 0;

    return (
      <div className="w-full">
        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted font-body">
          {label} {required && <span className="text-error">*</span>}
        </label>

        <div className="relative" ref={containerRef}>
          {/* hidden field so react-hook-form register(ref) has a real DOM node */}
          <input
            type="hidden"
            ref={ref}
            name={name}
            value={value ?? ""}
            readOnly
          />

          <button
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-invalid={Boolean(error)}
            disabled={disabled}
            onClick={toggleOpen}
            onKeyDown={handleKeyDown}
            className={`flex w-full items-center justify-between gap-2 rounded-md border bg-surface px-4 py-2.5 text-left text-sm text-body transition focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? "border-error" : "border-border"
            } ${className}`}
          >
            <span
              className={
                selectedOption ? "truncate text-body" : "truncate text-muted"
              }
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            <span className="flex shrink-0 items-center gap-1">
              {clearable && selectedOption && !disabled && (
                <span
                  role="button"
                  aria-label="Clear selection"
                  onClick={handleClear}
                  className="rounded-md p-0.5 text-muted transition hover:bg-background hover:text-body"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="flex text-muted"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-md border border-border bg-surface shadow-lg"
              >
                <div className="sticky top-0 z-10 border-b border-border bg-surface p-2">
                  <div className="flex items-center gap-2 rounded-md bg-background px-2.5 py-2">
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={placeholder}
                      className="w-full bg-transparent text-sm text-body placeholder:text-muted focus:outline-none font-body"
                    />
                  </div>
                </div>

                <ul
                  ref={listRef}
                  id={listboxId}
                  role="listbox"
                  // className="max-h-56 overflow-y-auto py-1"
                  className="scrollbar-premium max-h-56 overflow-y-auto py-1"
                >
                  {loading && (
                    <li className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading options...
                    </li>
                  )}

                  {showEmptyState && !canAddFromQuery && (
                    <li className="px-3 py-6 text-center text-sm text-muted">
                      No results found{query ? ` for "${query}"` : ""}
                    </li>
                  )}

                  {/* Inline "add" row using whatever the user typed */}
                  {!loading && canAddFromQuery && (
                    <li className="px-1.5">
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(-1)}
                        onClick={handleAddFromQuery}
                        className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-background"
                      >
                        <Plus className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Add "{trimmedQuery}"</span>
                      </button>
                    </li>
                  )}

                  {!loading &&
                    filteredOptions.map((opt, index) => {
                      const isSelected = opt.value === selectedOption?.value;
                      const isActive = index === activeIndex;
                      return (
                        <li
                          key={opt.value}
                          data-index={index}
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => handleSelect(opt)}
                          className="px-1.5"
                        >
                          <div
                            className={`relative flex cursor-pointer items-center rounded-md px-2.5 py-2 text-sm transition-colors ${
                              isActive ? "bg-background" : "bg-transparent"
                            } ${isSelected ? "font-medium text-primary" : "text-body"}`}
                          >
                            {isSelected && (
                              <span className="absolute left-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                            <span className="truncate pl-2">{opt.label}</span>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && <p className="mt-1 text-xs font-body text-error">{error}</p>}
      </div>
    );
  },
);

SearchableSelect.displayName = "SearchableSelect";
