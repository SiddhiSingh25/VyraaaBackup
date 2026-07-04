 export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";
export type Badge = "NEW" | "PRICE DROP" | "LOW STOCK" | "OUT OF STOCK" | null;

export interface WishlistProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  colorName: string;
  colorHex: string;
  size: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  stockStatus: StockStatus;
  badge: Badge;
}

export interface RecommendedProduct {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number | null;
}