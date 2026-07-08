/**
 * Generic option shape consumed by SearchableDropdown.
 * `value` is intentionally string | number so it can back numeric IDs
 * (e.g. category_id) or string slugs without the parent needing to cast.
 */
export interface Option {
  label: string;
  value: string | number;
}

export interface SearchableDropdownProps {
  /** Field label rendered above the control. Omit to render without one. */
  label?: string;
  /** Placeholder shown inside the search input once the dropdown is open. */
  placeholder?: string;
  /** Full list of selectable options. Filtering happens client-side against `label`. */
  options: Option[];
  /** Currently selected value, or null/undefined when nothing is selected. */
  value: string | number | null | undefined;
  /**
   * Called with the newly selected option's value, or `null` when the
   * selection is cleared via the clear button. Accepting null keeps the
   * clear affordance self-contained instead of requiring a separate onClear prop.
   */
  onChange: (value: string | number | null) => void;
  /** Shows a loading indicator in place of the option list. */
  loading?: boolean;
  /** Marks the field as required and renders an asterisk next to the label. */
  required?: boolean;
  /** Disables all interaction and mutes the visual style. */
  disabled?: boolean;
  /** Validation/error message. Renders red border + helper text when non-empty. */
  error?: string;
  /** Shows a "+ Add {addButtonText}" affordance pinned under the option list. */
  showAddButton?: boolean;
  /** Label for the add button. Defaults to "Add new". */
  addButtonText?: string;
  /** Called when the add button is pressed. The component has no opinion on what happens next. */
  onAdd?: () => void;
  /** Shows a clear (x) control inside the trigger when a value is selected. */
  clearable?: boolean;
  /** Optional id used to wire up external <label htmlFor>. Auto-generated if omitted. */
  id?: string;
  /** Optional className passthrough for layout (margin, width, grid placement, etc). */
  className?: string;
  /** Empty-state copy override. */
  emptyStateText?: string;
}
