import type { RecommendedProduct, WishlistProduct } from "./types";

export const INITIAL_WISHLIST: WishlistProduct[] = [
  {
    id: "vy-101",
    brand: "Mabish By Sonal Jain",
    name: "Blue Cotton Co-ord Set",
    image:
      "https://images.unsplash.com/photo-1544957992-20514f595d6f?q=80&w=800&auto=format&fit=crop",
    colorName: "Indigo",
    size: "M",
    colorHex: "#2c3e6b",
    price: 1360,
    originalPrice: 3399,
    rating: 4.6,
    reviewCount: 128,
    stockStatus: "in-stock",
    badge: null,
  },
  {
    id: "vy-102",
    brand: "Aurelia",
    name: "Halter Neck Linen Dress",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    colorName: "Beige",
    size: "S",
    colorHex: "#e4d4bd",
    price: 2999,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 64,
    stockStatus: "in-stock",
    badge: "NEW",
  },
  {
    id: "vy-103",
    brand: "Vyraaya",
    name: "Structured Shoulder Bag",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
    colorName: "Tan Brown",
    size: "One Size",
    colorHex: "#8a5a34",
    price: 4249,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 211,
    stockStatus: "in-stock",
    badge: null,
  },
  {
    id: "vy-104",
    brand: "House of Fett",
    name: "Linen Tailored Vest",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800&auto=format&fit=crop",
    colorName: "Ivory",
    size: "M/L",
    colorHex: "#f1e9dc",
    price: 2499,
    originalPrice: null,
    rating: 4.4,
    reviewCount: 39,
    stockStatus: "low-stock",
    badge: "LOW STOCK",
  }
];

export const RECOMMENDED: RecommendedProduct[] = [
  {
    id: "vy-201",
    brand: "Vyraaya",
    name: "Champagne Silk Camisole",
    image:
      "https://images.unsplash.com/photo-1566479179817-c0b7dd9d5cb2?q=80&w=800&auto=format&fit=crop",
    price: 2199,
    originalPrice: null,
  },
  {
    id: "vy-202",
    brand: "Aurelia",
    name: "Rose Gold Hoop Earrings",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    price: 1499,
    originalPrice: 1899,
  },
  {
    id: "vy-203",
    brand: "House of Fett",
    name: "Ivory Wide Leg Trousers",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    price: 2899,
    originalPrice: null,
  },
  {
    id: "vy-204",
    brand: "The White Pole",
    name: "Woven Raffia Tote",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    price: 3299,
    originalPrice: 3899,
  },
  {
    id: "vy-205",
    brand: "Kalki",
    name: "Pleated Midi Skirt",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?q=80&w=800&auto=format&fit=crop",
    price: 2599,
    originalPrice: null,
  },
];
