export type AddressType = "home" | "work" | "other";

export interface AddressFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  pinCode: string;
  houseNumber: string;
  streetAddress: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  addressType: AddressType;
  isDefault: boolean;
}

export type FieldErrors = Partial<Record<keyof AddressFormData, string>>;

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface PriceDetails {
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}
