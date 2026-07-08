import * as yup from "yup";
import type { QuickAddValues } from "./types";

export const quickAddSchema: yup.ObjectSchema<QuickAddValues> = yup.object({
  // Taxonomy
  category: yup.string().required("Category is required"),
  subcategory: yup.string().required("Subcategory is required"),
  subcategoryType: yup.string().required("Type is required"),

  // Basic Details
  name: yup.string().required("Product Name is required"),
  description: yup.string().required("Description is required"),
  brand: yup.string().required("Brand is required"),

  // Attributes
  attributes: yup
    .array()
    .of(
      yup
        .object()
        .shape({
          property: yup.string().required(),
          value: yup.string().required(),
        }),
    )
    .default([]),

  // Variants (Simplified for Quick Add)
  colorFamily: yup.string().required("Color Family is required"),
  color: yup.string().required("Specific Color is required"),
  sizeType: yup.string().required("Size Type is required"),

  // variants: yup
  //   .array()
  //   .of(
  //     yup.object({
  //       size: yup.string().required(),
  //       price: yup
  //         .number()
  //         .typeError("Must be a number")
  //         .required("Price is required")
  //         .min(1, "Price must be > 0"),
  //       stock: yup
  //         .number()
  //         .typeError("Must be a number")
  //         .required("Stock is required")
  //         .min(0, "Invalid stock"),
  //       sku: yup.string().required("SKU is required"),
  //       discountPrice: yup
  //         .number()
  //         .typeError("Must be a number")
  //         .min(0)
  //         .nullable(),
  //       isAvailable: yup.boolean().default(true),
  //       isFewLeft: yup.boolean().default(false),
  //     }),
  //   )
  //   .min(1, "At least one variant is required")
  //   .default([]),

  // Media
  images: yup
    .array()
    .of(yup.string().required())
    .required("At least one image is required")
    .min(1, "At least one image is required")
    .max(5, "Max 5 images for Quick Add"),
}) as yup.ObjectSchema<QuickAddValues>;

export const quickAddDefaultValues: QuickAddValues = {
  category: "",
  subcategory: "",
  subcategoryType: "",
  name: "",
  description: "",
  brand: "",
  attributes: [],
  colorFamily: "",
  color: "",
  sizeType: "",
  variants: [],
  images: [],
};
