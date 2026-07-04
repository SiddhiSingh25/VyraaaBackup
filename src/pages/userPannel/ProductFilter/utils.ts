/* -------------------------------- Utilities -------------------------------- */

/** Formats a number as an Indian-Rupee currency string, e.g. 3499 -> "₹3,499" */
export const money = (n: number): string => `₹${n.toLocaleString("en-IN")}`;

/** Returns the whole-number percentage discount between an mrp and a sale price */
export const pct = (price: number, mrp: number): number =>
  Math.round(((mrp - price) / mrp) * 100);

/**
 * Builds a compact pagination sequence (with "..." ellipses) for a given
 * current page / total pages combination.
 */
export const getPagination = (
  current: number,
  total: number,
): (number | string)[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Beginning
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  // End
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  // Middle
  return [1, "...", current - 1, current, current + 1, "...", total];
};
