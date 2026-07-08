// ---------------------------------------------------------------------------
// Shared types for the Quick Add Product feature
// ---------------------------------------------------------------------------

export type Option = {
  label: string;
  value: string;
};

// --- Raw API response shapes -----------------------------------------------
// NOTE: adjust these to match your actual backend response fields.

export interface CategoryApiItem {
  _id: string;
  category: string;
}

export interface TaxonomyApiItem {
  _id: string;
  subCategory: string;
  types: string[];
}

export interface ColorFamilyApiItem {
  _id: string;
  colorFamily: string;
  colors: string[];
}

export interface ColorApiItem {
  _id: string;
  color: string;
  hexCode: string;
  family: string;
}

export interface SizeTypeApiItem {
  _id: string;
  sizeType: string;
  sizes: string[];
}

export interface SizeValueApiItem {
  _id: string;
  size: string;
  sizes: string[];
}

export interface PropertyTypeApiItem {
  _id: string;
  property: string;
  values: string[];
}

export interface PropertyValueApiItem {
  _id: string;
  value: string;
  values: string[];
}

// --- Form domain types -------------------------------------------------------

export interface AttributeEntry {
  property: string;
  value: string;
  propertyLabel: string;
  valueLabel : string;
}

export interface VariantEntry {
  size: any;
  price: number;
  discountPrice?: number;
  isAvailable: boolean;
  isFewLeft: boolean;
}

export interface DraftVariant {
  size: any;
  price: string;
  stock: string;
  sku: string;
  discountPrice: string;
  isAvailable: boolean;
  isFewLeft: boolean;
}

export interface DraftAttribute {
  property: string;
  value: string;
}

export type QuickAddValues = {
  category: string;
  subcategory: string;
  subcategoryType: string;
  name: string;
  description: string;
  brand: string;
  attributes: AttributeEntry[];
  colorFamily: string;
  color: string;
  sizeType: string;
  variants: VariantEntry[];
  images: string[];
};
