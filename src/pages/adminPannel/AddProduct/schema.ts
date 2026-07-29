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
  gender: yup
    .string()
    .oneOf(["Men", "Women", "Unisex", "Boys", "Girls"])
    .required("Gender is required"),

  ageRange: yup
    .string()
    .oneOf([
      "",
      "0-2 Years",
      "3-5 Years",
      "6-8 Years",
      "9-12 Years",
      "13-18 Years",
    ])
    .optional(),

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
  variants: yup
    .array()
    .of(
      yup.object({
        size: yup.string().required("Size is required"),
        price: yup
          .number()
          .typeError("Must be a number")
          .required("Price is required")
          .min(0, "Price cannot be negative"),
        discountPrice: yup
          .number()
          .typeError("Must be a number")
          .min(0, "Discount cannot be negative")
          .nullable(),
        isAvailable: yup.boolean().default(true),
        isFewLeft: yup.boolean().default(false),
      }),
    )
    .min(1, "At least one variant is required")
    .default([]),

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
  gender: "",
  ageRange: "",
  attributes: [],
  colorFamily: "",
  color: "",
  sizeType: "",
  variants: [],
  images: [],
};
//hey chat gpt i am giving you image  of a school in which i have attached the logo all you have to do is genrate  a exact logo but with8k qulaity and transaprent bg ...make sure color will not change and bg will be 100% transparent  there shoiuld be not much gap./