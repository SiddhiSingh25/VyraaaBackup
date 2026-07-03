
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type ProductBadge =
  | "NEW"
  | "PRICE_DROP"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "SALE"
  | null;

export interface ColorOption {
  name: string;
  hex: string;
}

export interface WishlistItem {
  id: string;
  brand: string;
  name: string;
  slug: string;
  image: string;
  hoverImage?: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  currency?: "INR";
  rating?: number;
  reviewCount?: number;
  colors: ColorOption[];
  sizes: string[];
  stockStatus: StockStatus;
  badge?: ProductBadge;
  isWishlisted: boolean;
  addedOn?: string;
}

export const mockWishlistItems: WishlistItem[] = [
  {
    id: "vy-001",
    brand: "Vyraaya",
    name: "Draped Silk Column Gown",
    slug: "draped-silk-column-gown",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    price: 18400,
    originalPrice: 23000,
    rating: 4.8,
    reviewCount: 32,
    colors: [
      { name: "Ivory", hex: "#F3EAE0" },
      { name: "Champagne", hex: "#E4C9A3" },
    ],
    sizes: ["XS", "S", "M", "L"],
    stockStatus: "in-stock",
    badge: "SALE",
    isWishlisted: true,
    addedOn: "2026-06-18",
  },
  {
    id: "vy-002",
    brand: "Vyraaya",
    name: "Structured Shoulder Bag",
    slug: "structured-shoulder-bag",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    price: 4249,
    originalPrice: 4999,
    rating: 4.6,
    reviewCount: 58,
    colors: [{ name: "Tan Brown", hex: "#8A5A34" }],
    sizes: ["One Size"],
    stockStatus: "in-stock",
    badge: "SALE",
    isWishlisted: true,
    addedOn: "2026-06-22",
  },
  {
    id: "vy-003",
    brand: "House of Fett",
    name: "Linen Tailored Vest",
    slug: "linen-tailored-vest",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
    price: 2499,
    rating: 4.4,
    reviewCount: 14,
    colors: [{ name: "Ivory", hex: "#F3EAE0" }],
    sizes: ["S", "M/L", "XL"],
    stockStatus: "low-stock",
    badge: "LOW_STOCK",
    isWishlisted: true,
    addedOn: "2026-06-25",
  },
  {
    id: "vy-004",
    brand: "Aurelia",
    name: "Halter Neck Linen Dress",
    slug: "halter-neck-linen-dress",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    price: 2999,
    rating: 4.7,
    reviewCount: 21,
    colors: [{ name: "Beige", hex: "#E8DCC8" }],
    sizes: ["XS", "S", "M"],
    stockStatus: "in-stock",
    badge: "NEW",
    isWishlisted: true,
    addedOn: "2026-06-29",
  },
  {
    id: "vy-005",
    brand: "Nayab",
    name: "Floral Printed Kurta Set",
    slug: "floral-printed-kurta-set",
    image:
      "https://images.unsplash.com/photo-1610030181087-540716680028?w=800&q=80",
    price: 2159,
    originalPrice: 2699,
    rating: 4.3,
    reviewCount: 9,
    colors: [{ name: "Rose Pink", hex: "#E9C3C3" }],
    sizes: ["S", "M", "L"],
    stockStatus: "in-stock",
    badge: "SALE",
    isWishlisted: true,
    addedOn: "2026-06-15",
  },
  {
    id: "vy-006",
    brand: "The White Pole",
    name: "Minimal Heeled Mules",
    slug: "minimal-heeled-mules",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    price: 2799,
    rating: 4.5,
    reviewCount: 40,
    colors: [{ name: "Off White", hex: "#F1EEE7" }],
    sizes: ["36", "37", "38", "39"],
    stockStatus: "in-stock",
    badge: "NEW",
    isWishlisted: true,
    addedOn: "2026-06-27",
  },
  {
    id: "vy-007",
    brand: "KALKI",
    name: "Satin Slip Dress",
    slug: "satin-slip-dress",
    image:
      "https://images.unsplash.com/photo-1566479179817-c0a3fdb1e0e1?w=800&q=80",
    price: 3999,
    rating: 4.6,
    reviewCount: 27,
    colors: [{ name: "Black", hex: "#1E1B19" }],
    sizes: ["S"],
    stockStatus: "out-of-stock",
    badge: "OUT_OF_STOCK",
    isWishlisted: true,
    addedOn: "2026-06-10",
  },
  {
    id: "vy-008",
    brand: "Mabish By Sonal Jain",
    name: "Oversized Cotton Shirt",
    slug: "oversized-cotton-shirt",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    price: 1699,
    originalPrice: 2299,
    rating: 4.2,
    reviewCount: 16,
    colors: [{ name: "Maroon", hex: "#5C2A2E" }],
    sizes: ["M"],
    stockStatus: "in-stock",
    badge: "PRICE_DROP",
    isWishlisted: true,
    addedOn: "2026-06-30",
  },
];

export const mockRecommendations: RecommendedItem[] = [
  {
    id: "rec-001",
    brand: "Vyraaya",
    name: "Pleated Midi Skirt",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    price: 3199,
    rating: 4.5,
  },
  {
    id: "rec-002",
    brand: "Vyraaya",
    name: "Rose Gold Chain Belt",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80",
    price: 1899,
    rating: 4.3,
  },
  {
    id: "rec-003",
    brand: "Byredo Studio",
    name: "Silk Wrap Blouse",
    image:
      "https://images.unsplash.com/photo-1551048632-6d6a83e2b4c7?w=600&q=80",
    price: 4599,
    originalPrice: 5299,
    rating: 4.7,
  },
  {
    id: "rec-004",
    brand: "Vyraaya",
    name: "Woven Raffia Tote",
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    price: 2999,
    rating: 4.6,
  },
];
