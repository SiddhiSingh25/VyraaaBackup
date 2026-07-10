# Vyraaa — My Account page

Component-based "My Account" page built for the Vyraaa storefront, matching the supplied Tailwind v4 theme tokens (`--color-primary`, `--color-rose-gold`, `--color-heading`, etc).

## Install

```bash
npm install motion
```

(Tailwind v4, React and TypeScript are assumed to already be set up in your project, using the `@theme` block you shared.)

## Structure

```
types/account.ts                     Shared TypeScript types
data/sampleUser.ts                   Sample profile / orders / addresses / cards (swap for API data)
components/profile/
  LoyaltyAvatar.tsx                  Avatar with animated tier-progress ring + photo upload
  StatChip.tsx                       Small metric chip (orders / wishlist / points)
  ProfileSidebar.tsx                 Left nav: Personal Info, Orders, Addresses, Payment, Security, Logout
  ProfileHeader.tsx                  Name, tier badge, stat chips
  tabs/
    PersonalInfoTab.tsx              Editable first/last name, email, phone, gender
    OrdersTab.tsx                    Order history list with status badges
    AddressesTab.tsx                 Saved address cards + add new
    PaymentTab.tsx                   Saved cards + add new
    SecurityTab.tsx                  Password change + 2FA / login-alert toggles
pages/AccountPage.tsx                Composes everything; imports your existing Navbar/Footer
```

## Wiring into your app

1. Fix the two import paths at the top of `AccountPage.tsx` to point at your real Navbar/Footer:
   ```tsx
   import { Navbar } from "../components/layout/Navbar";
   import { Footer } from "../components/layout/Footer";
   ```
2. Swap the sample data in `data/sampleUser.ts` for your API/auth response (same shape as `types/account.ts`).
3. `handleSaveProfile`, `handleLogout`, and the two `onAddNew` handlers in `AccountPage.tsx` are marked with `// TODO` — connect them to your account API.

## Design notes

- **Signature element**: the avatar's ring is a real loyalty-tier progress indicator (`tierProgress` in the sample data), not decoration — it animates in on load using `motion`.
- Active sidebar tab uses a shared `layoutId` so the highlight glides between items instead of snapping.
- Tab content cross-fades on switch (`AnimatePresence`).
- All colors reference your theme tokens (`bg-surface`, `text-admin-text`, `border-border`, etc.) so the page stays in sync if the palette changes.
- Fully responsive: sidebar stacks above content below the `lg` breakpoint, form grids collapse to one column, order rows stack on mobile.
