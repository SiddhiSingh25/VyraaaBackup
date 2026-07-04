import type {
  UserProfile,
  AccountStats,
  OrderItem,
  Address,
  PaymentMethod,
} from "./account";

export const sampleUser: UserProfile = {
  id: "usr_29441",
  firstName: "Siddhi",
  lastName: "Singh",
  email: "siddhyy@gmail.com",
  phone: "98765 43210",
  phoneCountryCode: "+91",
  gender: "Female",
  avatarUrl: "https://i.pinimg.com/236x/97/31/b8/9731b85ff22e4a751e7aeff6667d14c7.jpg",
  memberSince: "March 2023",
  tier: "Rose Gold",
  tierProgress: 68,
  pointsToNextTier: 640,
};

export const sampleStats: AccountStats = {
  totalOrders: 14,
  wishlistCount: 27,
  loyaltyPoints: 2360,
};

export const sampleOrders: OrderItem[] = [
  {
    id: "ord_1",
    orderNumber: "VYR-100482",
    placedOn: "24 Jun 2026",
    status: "Delivered",
    itemCount: 2,
    total: 4598,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&q=60",
    items: ["Linen Wrap Dress", "Woven Raffia Belt"],
  },
  {
    id: "ord_2",
    orderNumber: "VYR-099317",
    placedOn: "02 Jun 2026",
    status: "Shipped",
    itemCount: 1,
    total: 3299,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=60",
    items: ["Terracotta Silk Scarf"],
  },
  {
    id: "ord_3",
    orderNumber: "VYR-097820",
    placedOn: "19 May 2026",
    status: "Processing",
    itemCount: 3,
    total: 6850,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=60",
    items: ["Tailored Trousers", "Rose Gold Hoops", "Cotton Blouse"],
  },
  {
    id: "ord_4",
    orderNumber: "VYR-093118",
    placedOn: "28 Mar 2026",
    status: "Returned",
    itemCount: 1,
    total: 2199,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200&q=60",
    items: ["Suede Ankle Boots"],
  },
];

export const sampleAddresses: Address[] = [
  {
    id: "addr_1",
    label: "Home",
    fullName: "Luna Cooper",
    line1: "402, Amber Residency",
    line2: "Koramangala 5th Block",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560095",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Work",
    fullName: "Luna Cooper",
    line1: "Vyraaa Studio, WeWork Galaxy",
    line2: "Residency Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560025",
    phone: "+91 98765 43210",
    isDefault: false,
  },
];

export const samplePaymentMethods: PaymentMethod[] = [
  { id: "pm_1", brand: "Visa", last4: "4821", expiry: "09/28", isDefault: true },
  { id: "pm_2", brand: "RuPay", last4: "1190", expiry: "01/27", isDefault: false },
];
