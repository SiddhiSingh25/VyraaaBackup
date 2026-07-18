import type {
  FilterSectionConfig,
  Product,
  SortOptionItem,
  ThemeTokens,
} from "./types";

/* ---------------------------------- Tokens --------------------------------- */
export const C: ThemeTokens = {
  primary: "#835240",
  primaryLight: "#C98F7A",
  primaryDark: "#51291A",
  dark: "#3D2A1E",
  rose: "#B76E79",
  bg: "#FDF9F3",
  surface: "#F8F4EE",
  card: "#F2E8DD",
  heading: "#3B302A",
  body: "#51443F",
  muted: "#84746E",
  border: "#E6D9CF",
  success: "#4CAF50",
  warning: "#F59E0B",
  error: "#BA1A1A",
};


// Original file repeated the same 8 products twice to pad the demo grid —
// preserved as-is to keep behaviour identical.
// export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...BASE_PRODUCTS];
