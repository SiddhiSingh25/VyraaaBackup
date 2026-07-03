# VYRAAA Search Experience

Premium search modal combining a centered floating layout (Vakil Uncle reference)
with a Recently Viewed / instant-filter product grid (Monclair reference).

## Install
```bash
npm install framer-motion lucide-react
```
Shadcn UI components aren't required by this build (kept it dependency-light),
but the file structure is Shadcn-compatible if you want to swap in `Dialog`
primitives later.

## Font setup (Cormorant Garamond as the serif display face)
In `app/layout.tsx`:
```tsx
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
});
```
Then in `tailwind.config.ts`, map it to `font-serif`:
```ts
theme: {
  extend: {
    fontFamily: {
      serif: ["var(--font-serif)", "Georgia", "serif"],
    },
  },
},
```
Apply `cormorant.variable` to the `<html>` or `<body>` className.

## File structure
```
components/search/
  SearchModal.tsx           – orchestrator: state, animation, focus trap, keyboard nav
  SearchInput.tsx            – top input row with icon + close button
  SearchSuggestions.tsx      – suggestion pills (Perfumes, Oud, Floral, etc.)
  RecentSearches.tsx         – localStorage-backed search history
  RecentlyViewed.tsx         – empty-state product grid
  SearchResults.tsx          – live filtered grid + no-results state
  ProductCard.tsx            – memoized card, hover zoom + lift
  SearchTriggerExample.tsx   – example navbar wiring (reference only)
hooks/useLocalStorage.ts     – SSR-safe localStorage persistence
types/search.ts              – Product / RecentSearch types
lib/mock-products.ts         – placeholder catalogue — replace with real data source
```

## Wiring into your Navbar
```tsx
import { useState } from "react";
import { SearchModal } from "@/components/search/SearchModal";
import { getAllProducts } from "@/lib/mock-products";

const [isSearchOpen, setIsSearchOpen] = useState(false);

<button onClick={() => setIsSearchOpen(true)}>Search</button>
<SearchModal
  isOpen={isSearchOpen}
  onClose={() => setIsSearchOpen(false)}
  products={getAllProducts()}
  onSelectProduct={(product) => router.push(`/products/${product.slug}`)}
/>
```
Replace `getAllProducts()` with your real product source (Server Action, API
route, or CMS query) — pass the array in as the `products` prop.

## Behavior implemented
- Overlay fade (0→1) + modal opacity/scale (0.95→1) over 0.25s, Framer Motion.
- Background scroll locked while open; restored on close.
- Click-outside and Escape both close the modal; focus returns to the trigger.
- Auto-focus on the input on open; basic Tab focus trap while open.
- Typing filters instantly (no debounce) via `useMemo`, case-insensitive
  across name, category, and tags.
- Empty state: Recently Viewed grid (4-up desktop, from localStorage).
- Results: staggered card entrance, hover lift (`translateY(-5px)`) + shadow.
- No-results state: icon + "No products found" + hint text.
- Recent searches: max 5, stored in `localStorage`, clock icon + arrow, "Clear" action.
- Suggestion pills fill the input on click.
- Full keyboard navigation: ArrowUp/ArrowDown cycle results or recent
  searches, Enter selects (or commits the search term if nothing is
  highlighted), Escape closes. `role="listbox"`/`role="option"` with
  `aria-selected` for the highlighted state.
- Responsive: centered 80vw/900px modal on desktop, 90vw on tablet
  (via the `sm:` breakpoint sizing), full-screen with sticky input on mobile.

## Notes / things to double-check before shipping
- `ProductCard` uses `next/image` — make sure your product image domains are
  allowed in `next.config.js` (`images.remotePatterns`), or swap in your CDN.
- The mock catalogue in `lib/mock-products.ts` is illustrative — point
  `products` at your real data as soon as you wire this in.
- Colors are hard-coded hex values matching the ivory/rose-gold/champagne
  palette from memory of your brand — swap for CSS variables/Tailwind theme
  tokens if you've since centralized your design tokens.
