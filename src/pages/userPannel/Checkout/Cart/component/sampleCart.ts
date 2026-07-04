import type { CartItem } from "./cart";

// Sample "add to cart" data — swap for real API data when wired up.
export const sampleCartItems: CartItem[] = [
  {
    id: "vyr-001",
    brand: "Vyraaa",
    name: "Elara Crystal Gold-Plated Link Bracelet",
    soldBy: "Vyraaa Fine Jewels",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop",
    size: "Onesize",
    availableSizes: ["Onesize"],
    qty: 1,
    maxQty: 5,
    mrp: 1499,
    price: 445,
    returnDays: 7,
    selected: true,
  },
  {
    id: "vyr-002",
    brand: "Vyraaa",
    name: "Noor Pearl Drop Gold-Plated Earrings",
    soldBy: "Vyraaa Fine Jewels",
    image:
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=400&auto=format&fit=crop",
    size: "Onesize",
    availableSizes: ["Onesize"],
    qty: 1,
    maxQty: 5,
    mrp: 1899,
    price: 899,
    returnDays: 7,
    selected: true,
  },
  {
    id: "vyr-003",
    brand: "Vyraaa",
    name: "Amara Layered Chain Necklace",
    soldBy: "Vyraaa Fine Jewels",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&auto=format&fit=crop",
    size: "16 inch",
    availableSizes: ["14 inch", "16 inch", "18 inch"],
    qty: 1,
    maxQty: 3,
    mrp: 2299,
    price: 1149,
    returnDays: 10,
    selected: false,
  },
];
