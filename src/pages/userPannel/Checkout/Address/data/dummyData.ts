import type { AddressFormData, OrderItem, PriceDetails } from "../types/address";

export const emptyAddress: AddressFormData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  pinCode: "",
  houseNumber: "",
  streetAddress: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  addressType: "home",
  isDefault: false,
};

export const dummyOrderItems: OrderItem[] = [
  {
    id: "vy-01",
    name: "Cassia Wool Wrap Coat",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80",
    color: "Camel",
    size: "M",
    quantity: 1,
    price: 12499,
  },
  {
    id: "vy-02",
    name: "Silk Column Slip Dress",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80",
    color: "Ivory",
    size: "S",
    quantity: 1,
    price: 8999,
  },
];

export const dummyPriceDetails: PriceDetails = {
  subtotal: 21498,
  shipping: 0,
  discount: 2150,
  tax: 1075,
  total: 20423,
};

/**
 * Simulated PIN code lookup. In production this would call a postal
 * API; here we resolve a handful of known codes and otherwise fall
 * back to a generic metro so the auto-fill moment can always be
 * demonstrated with dummy data.
 */
export const pinCodeLookup: Record<string, { city: string; state: string }> = {
  "110001": { city: "New Delhi", state: "Delhi" },
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "560001": { city: "Bengaluru", state: "Karnataka" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
};

export function lookupPinCode(pin: string): { city: string; state: string } | null {
  if (pin.length !== 6) return null;
  if (pinCodeLookup[pin]) return pinCodeLookup[pin];
  // Deterministic fallback so any 6-digit code still resolves for the demo
  return { city: "New Delhi", state: "Delhi" };
}
