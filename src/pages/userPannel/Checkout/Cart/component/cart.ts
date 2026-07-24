export interface CartItem {
  id: string;
  brand: string;
  name: string;
  soldBy: string;
  image: string;
  size: string;
  availableSizes: string[];
  qty: number;
  maxQty: number;
  mrp: number;
  price: number;
  returnDays: number;
  selected: boolean;
  isAvailable: boolean;
  isFewLeft : boolean;
  cartItemId : boolean
}

export interface DonationTier {
  amount: number;
}

export interface PriceDetails {
  itemCount: number;
  totalMrp: number;
  discountOnMrp: number;
  couponDiscount: number;
  platformFee: number;
  donation: number;
  totalAmount: number;
}

export type CheckoutStep = "bag" | "address" | "payment";
