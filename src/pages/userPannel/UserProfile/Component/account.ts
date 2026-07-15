export type MembershipTier = "Clay" | "Rose Gold" | "Terracotta Elite";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  gender: "Female" | "Male" | "Non-binary" | "Prefer not to say";
  avatarUrl: string | null;
  memberSince: string;
  tier: MembershipTier;
  tierProgress: number;
  pointsToNextTier: number;
}

export interface AccountStats {
  totalOrders: number;
  wishlistCount: number;
  loyaltyPoints: number;
}

export type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled" | "Returned";

export interface OrderItem {
  id: string;
  orderNumber: string;
  placedOn: string;
  status: OrderStatus;
  itemCount: number;
  total: number;
  thumbnailUrl: string;
  items: string[];
}

export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: "Visa" | "Mastercard" | "RuPay" | "Amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export type AccountTabId =
  | "personal-info"
  | "orders"
  | "addresses"
  | "payment"
  | "security";

export interface AccountTabConfig {
  id: AccountTabId;
  label: string;
  icon: string;
}
