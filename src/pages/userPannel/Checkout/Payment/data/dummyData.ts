import type {
  Offer,
  CardBrand,
  UPIApp,
  Wallet,
  Bank,
  EMIPlan,
  Product,
  PriceBreakdown,
  Address,
  PaymentCategory,
} from "../types";

export const paymentCategories: PaymentCategory[] = [
  { id: "recommended", label: "Recommended", icon: "Sparkles" },
  { id: "upi", label: "UPI", icon: "Smartphone" },
  { id: "card", label: "Credit / Debit Card", icon: "CreditCard", badge: "9 Offers" },
  { id: "wallets", label: "Wallets", icon: "Wallet" },
  { id: "netbanking", label: "Net Banking", icon: "Landmark" },
  { id: "emi", label: "EMI", icon: "CalendarRange", badge: "1 Offer" },
  { id: "cod", label: "Cash on Delivery", icon: "Banknote" },
];

export const offers: Offer[] = [
  {
    id: "off-1",
    icon: "Gift",
    title: "₹500 Cashback",
    description: "On HDFC Credit Cards, min. spend ₹4,999",
    code: "HDFC500",
  },
  {
    id: "off-2",
    icon: "Percent",
    title: "10% Instant Discount",
    description: "On ICICI Bank Debit Cards",
    code: "ICICI10",
  },
  {
    id: "off-3",
    icon: "Sparkles",
    title: "Flat ₹300 Off",
    description: "On orders above ₹2,999 via UPI",
    code: "UPI300",
  },
  {
    id: "off-4",
    icon: "CalendarRange",
    title: "No-Cost EMI",
    description: "Available on orders above ₹5,000",
  },
  {
    id: "off-5",
    icon: "Wallet",
    title: "5% Cashback",
    description: "On Paytm Wallet payments",
    code: "PAYTM5",
  },
];

export const cardBrands: CardBrand[] = [
  { id: "visa", name: "Visa", logo: "VISA" },
  { id: "mastercard", name: "Mastercard", logo: "MC" },
  { id: "rupay", name: "RuPay", logo: "RuPay" },
  { id: "amex", name: "American Express", logo: "AMEX" },
];

export const upiApps: UPIApp[] = [
  { id: "gpay", name: "Google Pay", icon: "GP" },
  { id: "phonepe", name: "PhonePe", icon: "PP" },
  { id: "paytm", name: "Paytm", icon: "PT" },
  { id: "bhim", name: "BHIM", icon: "BH" },
];

export const wallets: Wallet[] = [
  { id: "amazonpay", name: "Amazon Pay", icon: "AP", balance: "₹1,240.00" },
  { id: "mobikwik", name: "MobiKwik", icon: "MK" },
  { id: "paytmwallet", name: "Paytm Wallet", icon: "PT", balance: "₹85.50" },
  { id: "freecharge", name: "Freecharge", icon: "FC" },
];

export const banks: Bank[] = [
  { id: "sbi", name: "State Bank of India", icon: "SBI" },
  { id: "hdfc", name: "HDFC Bank", icon: "HDFC" },
  { id: "icici", name: "ICICI Bank", icon: "ICICI" },
  { id: "axis", name: "Axis Bank", icon: "AXIS" },
  { id: "kotak", name: "Kotak Mahindra", icon: "KOTAK" },
];

export const emiPlans: EMIPlan[] = [
  { id: "emi-3", bank: "HDFC Bank", tenure: 3, interestRate: 13, monthlyAmount: 856, totalAmount: 2568 },
  { id: "emi-6", bank: "HDFC Bank", tenure: 6, interestRate: 14, monthlyAmount: 438, totalAmount: 2628 },
  { id: "emi-9", bank: "ICICI Bank", tenure: 9, interestRate: 15, monthlyAmount: 298, totalAmount: 2682 },
  { id: "emi-12", bank: "Axis Bank", tenure: 12, interestRate: 16, monthlyAmount: 228, totalAmount: 2736 },
];

export const products: Product[] = [
  {
    id: "p-1",
    name: "Wool-Blend Tailored Overcoat",
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=200&h=260&fit=crop",
    color: "Camel Beige",
    size: "M",
    qty: 1,
    price: 18999,
  },
  {
    id: "p-2",
    name: "Silk Slip Midi Dress",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=260&fit=crop",
    color: "Ivory",
    size: "S",
    qty: 1,
    price: 8499,
  },
];

export const priceBreakdown: PriceBreakdown = {
  subtotal: 27498,
  discount: 2750,
  shipping: 0,
  platformFee: 49,
  tax: 1237,
  total: 26034,
};

export const address: Address = {
  name: "Ananya Sharma",
  line1: "14B, Prakriti Enclave, Bandstand Road",
  line2: "Near Carter Road Promenade",
  city: "Mumbai",
  state: "Maharashtra",
  pincode: "400050",
  phone: "+91 98200 12345",
  type: "Home",
};
