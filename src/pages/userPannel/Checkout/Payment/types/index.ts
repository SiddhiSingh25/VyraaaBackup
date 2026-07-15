// ============================================================
// Vyraaa — Payment Page Type Definitions
// ============================================================

export type PaymentCategoryId =
  | "recommended"
  | "upi"
  | "card"
  | "wallets"
  | "netbanking"
  | "emi"
  | "cod";

export interface PaymentCategory {
  id: PaymentCategoryId;
  label: string;
  icon: string; // lucide icon name
  badge?: string;
}

export interface Offer {
  id: string;
  icon: string;
  title: string;
  description: string;
  code?: string;
}

export interface CardBrand {
  id: string;
  name: string;
  logo: string; // emoji / initials placeholder for logo
}

export interface UPIApp {
  id: string;
  name: string;
  icon: string;
}

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  balance?: string;
}

export interface Bank {
  id: string;
  name: string;
  icon: string;
}

export interface EMIPlan {
  id: string;
  bank: string;
  tenure: number; // months
  interestRate: number; // percentage
  monthlyAmount: number;
  totalAmount: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  qty: number;
  price: number;
}

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  platformFee: number;
  tax: number;
  total: number;
}

export interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  type: "Home" | "Work" | "Other";
}

export interface CardFormData {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
}
