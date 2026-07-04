/* ============================================================================
   Shared Types — ProductFilter
============================================================================ */

export type ThemeTokens = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  dark: string;
  rose: string;
  bg: string;
  surface: string;
  card: string;
  heading: string;
  body: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export interface FilterOptionItem {
  id: string;
  label: string;
  value: string;
  count?: number;
  swatch?: string;
}

export type FilterType =
  | "checkbox"
  | "radio"
  | "color"
  | "size"
  | "range"
  | "toggle";

export interface FilterSectionConfig {
  id: string;
  title: string;
  type: FilterType;
  options?: FilterOptionItem[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  quickValues?: number[];
  searchable?: boolean;
}

/** Value shape stored per-filter-id inside FilterState */
export type FilterValue = string | string[] | [number, number] | undefined;

export interface FilterState {
  [sectionId: string]: FilterValue;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  img: string;
  img2: string;
  rating: number;
  reviews: number;
  price: number;
  mrp: number;
  delivery: string;
  badges: string[];
}

export interface SortOptionItem {
  id: string;
  label: string;
}

export interface ActiveChip {
  key: string;
  label: string;
  sectionId: string;
  remove: string | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export type BadgeTone = "dark" | "rose" | "warn" | "outline";

export interface FilterChangeHandler {
  (sectionId: string, value: FilterValue): void;
}
