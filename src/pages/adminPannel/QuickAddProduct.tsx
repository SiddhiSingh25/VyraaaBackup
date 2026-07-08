import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ImImages } from "react-icons/im";
import { TbCategoryPlus } from "react-icons/tb";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaTags, FaArrowsTurnRight } from "react-icons/fa6";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { RiImageAddLine, RiCloseLine } from "react-icons/ri";

// Reusable components (ensure path matches your project)
import {
  Input,
  Select,
  TextArea,
  Button,
} from "../../components/ui/FormElements";
import useGetQuery from "../../hooks/getQuery.hook";
import { apiUrls } from "../../apis";
import usePostQuery from "../../hooks/postQuery.hook";

// --- SIMULATED FETCHED MASTER DATA ---
const MASTER_TAXONOMY = {
  Clothes: {
    "T-Shirt": ["Top", "Set", "Single Piece"],
    Jeans: ["Bottom"],
    Kurta: ["Top", "Set"],
  },
  Shoes: {
    Sneakers: ["Single Piece"],
    Formal: ["Single Piece"],
  },
  Bags: {
    Tote: ["Accessory"],
    Backpack: ["Accessory"],
  },
} as Record<string, Record<string, string[]>>;

const COLOR_FAMILY_DATA: Record<string, string[]> = {
  "Earth Tones": ["Olive Green", "Sand", "Rust", "Terracotta"],
  Monochrome: ["Black", "White", "Warm Grey", "Charcoal"],
};

const SIZE_TYPE_DATA: Record<string, string[]> = {
  "Topwear (Alpha)": ["XS", "S", "M", "L", "XL", "XXL"],
  "Bottomwear (Numeric)": ["28", "30", "32", "34", "36", "38"],
  "Footwear (UK)": ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
};

const ATTR_DATA: Record<string, string[]> = {
  Fabric: ["100% French Terry Cotton", "Linen Blend", "Silk", "Denim"],
  Fit: ["Oversized", "Slim Fit", "Relaxed", "Regular"],
  Care: ["Machine Wash", "Dry Clean Only", "Hand Wash"],
};

// --- YUP VALIDATION SCHEMA ---
const schema: yup.ObjectSchema<QuickAddValues> = yup.object({
  // Taxonomy
  category: yup.string().required("Category is required"),
  subcategory: yup.string().required("Subcategory is required"),
  subcategoryType: yup.string().required("Type is required"),

  // Basic Details
  name: yup.string().required("Product Name is required"),
  description: yup.string().required("Description is required"),

  // Attributes
  attributes: yup
    .array()
    .of(
      yup.object().shape({
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
        size: yup.string().required(),
        price: yup
          .number()
          .typeError("Must be a number")
          .required("Price is required")
          .min(1, "Price must be > 0"),
        stock: yup
          .number()
          .typeError("Must be a number")
          .required("Stock is required")
          .min(0, "Invalid stock"),
        sku: yup.string().required("SKU is required"),
        discountPrice: yup
          .number()
          .typeError("Must be a number")
          .min(0)
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

type QuickAddValues = {
  category: string;
  subcategory: string;
  subcategoryType: string;
  name: string;
  description: string;
  attributes: Array<{ property: string; value: string }>;
  colorFamily: string;
  color: string;
  sizeType: string;
  variants: Array<{
    size: string;
    price: number;
    stock: number;
    sku: string;
    discountPrice?: number;
    isAvailable: boolean;
    isFewLeft: boolean;
  }>;
  images: string[];
};

const QuickAddProduct = () => {
  const [category, setCategory] = useState([]);

  let { getQuery } = useGetQuery();

  const getCategory = () => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        console.log(res.data, "$$");
        setCategory(res.data);
        category.map((c) => console.log(c, "676478"));
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching plans");
      },
    });
  };
  useEffect(() => {
    getCategory();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<QuickAddValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      category: "",
      subcategory: "",
      subcategoryType: "",
      name: "",
      description: "",
      attributes: [],
      colorFamily: "",
      color: "",
      sizeType: "",
      variants: [],
      images: [],
    },
  });

  // --- DEPENDENCY WATCHERS ---
  const selectedCategory = watch("category");
  const selectedSubcategory = watch("subcategory");
  const selectedColorFamily = watch("colorFamily");
  const selectedSizeType = watch("sizeType");
  const images = watch("images") || [];
  const attributes = watch("attributes") || [];
  const variants = watch("variants") || [];

  // --- DRAFT STATES ---
  const [draftAttr, setDraftAttr] = useState({ property: "", value: "" });
  const [showVariantDraft, setShowVariantDraft] = useState(false);
  const [draftVariant, setDraftVariant] = useState({
    size: "",
    price: "",
    stock: "",
    sku: "",
    discountPrice: "",
    isAvailable: true,
    isFewLeft: false,
  });

  // --- CASCADING DEPENDENCY RESETS ---
  useEffect(() => {
    setValue("subcategory", "");
    setValue("subcategoryType", "");
  }, [selectedCategory, setValue]);

  useEffect(() => {
    setValue("subcategoryType", "");
  }, [selectedSubcategory, setValue]);

  useEffect(() => {
    setValue("color", "");
  }, [selectedColorFamily, setValue]);

  // --- ATTRIBUTE HANDLERS ---
  const addAttribute = () => {
    if (draftAttr.property && draftAttr.value) {
      setValue("attributes", [...attributes, draftAttr]);
      setDraftAttr({ property: "", value: "" });
    }
  };

  const removeAttribute = (index: number) => {
    const newAttrs = [...attributes];
    newAttrs.splice(index, 1);
    setValue("attributes", newAttrs);
  };

  const addVariant = () => {
    if (
      // selectedSizeType &&
      // draftVariant.size &&
      draftVariant.price
      // draftVariant.stock &&
      // draftVariant.sku
    ) {
      const newVariant = {
        // size: draftVariant.size,
        price: Number(draftVariant.price),
        // stock: Number(draftVariant.stock),
        // sku: draftVariant.sku,
        discountPrice: draftVariant.discountPrice
          ? Number(draftVariant.discountPrice)
          : undefined,
        isAvailable: draftVariant.isAvailable,
        isFewLeft: draftVariant.isFewLeft,
      };
      setValue("variants", [...variants, newVariant] as any);
      setDraftVariant({
        size: "",
        price: "",
        stock: "",
        sku: "",
        discountPrice: "",
        isAvailable: true,
        isFewLeft: false,
      });
      setShowVariantDraft(false);
    }
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setValue("variants", newVariants);
  };

  // --- MEDIA HANDLERS ---
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && images.length < 5) {
      setValue("images", [...images, URL.createObjectURL(e.target.files[0])]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  let { postQuery } = usePostQuery();

  // --- SUBMISSION ---
  const onSubmit = (data: QuickAddValues) => {
    console.log("Quick Add Payload:", data);

    postQuery({
      url: `${apiUrls.Product.add}`,
      postData: data,
      onSuccess: (res: any) => {
        console.log(res);
      },
      onFail: (err: any) => {
        console.log(err);
      },
    });

    alert("Product quickly added to inventory!");
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-body font-body selection:bg-rose-gold/30">
      <main className="flex-1 overflow-y-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex h-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold text-heading font-heading tracking-wide">
                Quick Add Product
              </h2>
              <p className="text-sm text-muted mt-1">
                Streamlined entry for a single SKU mapping to your master
                taxonomy.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button type="button" variant="secondary" onClick={() => reset()}>
                Clear
              </Button>
              <Button type="submit" variant="primary">
                Publish SKU
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* LEFT COLUMN: Data Entry */}
            <div className="flex flex-col gap-8">
              {/* 1. Taxonomy Section */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <TbCategoryPlus className="text-primary text-xl" />
                  <h3 className="text-lg text-heading font-heading font-semibold">
                    Taxonomy Mapping
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Select
                    label="Category"
                    required
                    {...register("category")}
                    error={errors.category?.message}
                    options={category.map((c: any) => ({
                      label: c.category,
                      value: c._id,
                    }))}
                  />
                  <Select
                    label="Subcategory"
                    required
                    disabled={!selectedCategory}
                    {...register("subcategory")}
                    error={errors.subcategory?.message}
                    options={
                      selectedCategory
                        ? Object.keys(
                            MASTER_TAXONOMY[selectedCategory] || {},
                          ).map((sc) => ({ label: sc, value: sc }))
                        : []
                    }
                  />
                  <Select
                    label="Subcategory Type"
                    required
                    disabled={!selectedSubcategory}
                    {...register("subcategoryType")}
                    error={errors.subcategoryType?.message}
                    options={
                      selectedCategory && selectedSubcategory
                        ? MASTER_TAXONOMY[selectedCategory][
                            selectedSubcategory
                          ].map((t) => ({ label: t, value: t }))
                        : []
                    }
                  />
                </div>
              </section>

              {/* 2. Basic Details */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <FaTags className="text-primary text-xl" />
                  <h3 className="text-lg text-heading font-heading font-semibold">
                    Core Information
                  </h3>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    <Select
                      label="Color Family"
                      required
                      {...register("colorFamily")}
                      error={errors.colorFamily?.message}
                      options={Object.keys(COLOR_FAMILY_DATA).map((cf) => ({
                        label: cf,
                        value: cf,
                      }))}
                    />
                    <Select
                      label="Specific Color"
                      required
                      disabled={!selectedColorFamily}
                      {...register("color")}
                      error={errors.color?.message}
                      options={
                        selectedColorFamily
                          ? COLOR_FAMILY_DATA[selectedColorFamily].map((c) => ({
                              label: c,
                              value: c,
                            }))
                          : []
                      }
                    />
                    <Select
                      label="Size Type"
                      required
                      {...register("sizeType")}
                      error={errors.sizeType?.message}
                      options={Object.keys(SIZE_TYPE_DATA).map((st) => ({
                        label: st,
                        value: st,
                      }))}
                    />
                  </div>
                  <Input
                    label="Product Name"
                    required
                    placeholder="e.g. Classic Heavyweight Hoodie"
                    {...register("name")}
                    error={errors.name?.message}
                  />
                  <TextArea
                    label="Description"
                    required
                    rows={4}
                    placeholder="Short, compelling description..."
                    {...register("description")}
                    error={errors.description?.message}
                  />
                </div>
              </section>

              {/* 3. Variant & Inventory Details */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <IoColorPaletteOutline className="text-primary text-xl" />
                  <h3 className="text-lg text-heading font-heading font-semibold">
                    Variants & Pricing
                  </h3>
                </div>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p className="text-sm font-medium text-heading">
                      Add SKU variants
                    </p>
                    <p className="text-sm text-muted">
                      Create one or more size-based entries for this product.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="icon"
                    onClick={() => setShowVariantDraft(!showVariantDraft)}
                  >
                    <span className="material-symbols-outlined">
                      {showVariantDraft ? "remove" : "add"}
                    </span>
                  </Button>
                </div>

                {errors.variants &&
                  !showVariantDraft &&
                  variants.length === 0 && (
                    <p className="mb-4 text-sm text-error">
                      {errors.variants.message}
                    </p>
                  )}

                {showVariantDraft && (
                  <div className="mb-6 rounded-xl border border-primary-light bg-card/80 p-5 shadow-sm">
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                          Size
                        </label>
                        <select
                          value={draftVariant.size}
                          onChange={(e) =>
                            setDraftVariant({
                              ...draftVariant,
                              size: e.target.value,
                            })
                          }
                          disabled={!selectedSizeType}
                          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Select Size
                          </option>
                          {selectedSizeType
                            ? SIZE_TYPE_DATA[selectedSizeType].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))
                            : null}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={draftVariant.price}
                          onChange={(e) =>
                            setDraftVariant({
                              ...draftVariant,
                              price: e.target.value,
                            })
                          }
                          placeholder="0.00"
                          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary"
                        />
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                          Stock Qty
                        </label>
                        <input
                          type="number"
                          value={draftVariant.stock}
                          onChange={(e) =>
                            setDraftVariant({
                              ...draftVariant,
                              stock: e.target.value,
                            })
                          }
                          placeholder="0"
                          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary"
                        />
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                          SKU Code
                        </label>
                        <input
                          type="text"
                          value={draftVariant.sku}
                          onChange={(e) =>
                            setDraftVariant({
                              ...draftVariant,
                              sku: e.target.value,
                            })
                          }
                          placeholder="e.g. BLK-TS-M"
                          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 rounded-lg border border-border/70 bg-surface/70 p-4 md:flex-row md:items-end md:justify-between">
                      <div className="flex flex-1 flex-wrap items-center gap-4">
                        <div className="min-w-[140px] flex-1">
                          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                            Discount (₹)
                          </label>
                          <input
                            type="number"
                            value={draftVariant.discountPrice}
                            onChange={(e) =>
                              setDraftVariant({
                                ...draftVariant,
                                discountPrice: e.target.value,
                              })
                            }
                            placeholder="Optional"
                            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary"
                          />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={draftVariant.isAvailable}
                            onChange={(e) =>
                              setDraftVariant({
                                ...draftVariant,
                                isAvailable: e.target.checked,
                              })
                            }
                            className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                          />
                          Available
                        </label>
                        <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={draftVariant.isFewLeft}
                            onChange={(e) =>
                              setDraftVariant({
                                ...draftVariant,
                                isFewLeft: e.target.checked,
                              })
                            }
                            className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
                          />
                          Few Left
                        </label>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={addVariant}
                        className="px-4 py-1.5"
                      >
                        Add to Listing
                      </Button>
                    </div>
                  </div>
                )}

                {variants.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-border bg-surface/70">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-card text-heading border-b border-border font-heading">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Size</th>
                          <th className="px-5 py-3 font-semibold">Price</th>
                          <th className="px-5 py-3 font-semibold">Stock</th>
                          <th className="px-5 py-3 font-semibold">SKU</th>
                          <th className="px-5 py-3 font-semibold">Discount</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {variants.map((variant: any, index: number) => (
                          <tr
                            key={index}
                            className="hover:bg-card/40 transition-colors text-body"
                          >
                            <td className="px-5 py-4 font-medium">
                              {variant.size}
                            </td>
                            <td className="px-5 py-4">₹{variant.price}</td>
                            <td className="px-5 py-4">{variant.stock}</td>
                            <td className="px-5 py-4">{variant.sku}</td>
                            <td className="px-5 py-4 text-muted">
                              {variant.discountPrice
                                ? `₹${variant.discountPrice}`
                                : "-"}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`h-2.5 w-2.5 rounded-full ${variant.isAvailable ? "bg-success" : "bg-error"}`}
                                ></span>
                                {variant.isFewLeft && (
                                  <span className="rounded-md bg-warning/20 px-2 py-0.5 text-[10px] font-bold text-warning uppercase tracking-wider">
                                    Few Left
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => removeVariant(index)}
                                className="text-muted hover:text-error transition"
                              >
                                <MdOutlineDeleteSweep size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* 4. Attributes Section */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FaArrowsTurnRight className="text-primary text-xl" />
                    <h3 className="text-lg text-heading font-heading font-semibold">
                      Attributes
                    </h3>
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-4 rounded-lg border border-primary-light bg-card p-4 sm:flex-row sm:items-end shadow-inner">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                      Property
                    </label>
                    <select
                      value={draftAttr.property}
                      onChange={(e) =>
                        setDraftAttr({ property: e.target.value, value: "" })
                      }
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {Object.keys(ATTR_DATA).map((prop) => (
                        <option key={prop} value={prop}>
                          {prop}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
                      Value
                    </label>
                    <select
                      value={draftAttr.value}
                      onChange={(e) =>
                        setDraftAttr({ ...draftAttr, value: e.target.value })
                      }
                      disabled={!draftAttr.property}
                      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50"
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {draftAttr.property &&
                        ATTR_DATA[draftAttr.property].map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                    </select>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={addAttribute}
                    disabled={!draftAttr.property || !draftAttr.value}
                    className="px-5 py-2"
                  >
                    Add
                  </Button>
                </div>

                {attributes.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-card text-heading font-heading border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Property</th>
                          <th className="px-4 py-3 font-semibold">Value</th>
                          <th className="px-4 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {attributes.map((attr, index) => (
                          <tr
                            key={index}
                            className="hover:bg-card/40 transition"
                          >
                            <td className="px-4 py-3 font-medium text-heading">
                              {attr.property}
                            </td>
                            <td className="px-4 py-3 text-muted">
                              {attr.value}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => removeAttribute(index)}
                                className="text-muted hover:text-error transition"
                              >
                                <MdOutlineDeleteSweep size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted text-center py-6 border border-dashed border-border rounded-lg bg-card/50">
                    No attributes assigned.
                  </p>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: Media & Summary */}
            <div className="flex flex-col gap-8">
              {/* Media Gallery */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm sticky top-6">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <ImImages className="text-primary text-xl" />
                    <h3 className="text-lg text-heading font-heading font-semibold">
                      Media
                    </h3>
                  </div>
                  <span className="rounded-md bg-card px-3 py-1 text-xs font-semibold text-primary-dark border border-border">
                    {images.length}/5
                  </span>
                </div>
                {errors.images && (
                  <p className="mb-4 text-xs text-error">
                    {errors.images.message}
                  </p>
                )}

                {/* Primary Image Display */}
                <div className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary-light">
                  {images.length > 0 ? (
                    <>
                      <span className="absolute left-3 top-3 z-10 rounded-sm bg-dark/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-background backdrop-blur-md">
                        Primary
                      </span>
                      <img
                        src={images[0]}
                        alt="Primary"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(0)}
                        className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 text-error shadow-sm hover:bg-error hover:text-white transition"
                      >
                        <RiCloseLine size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 text-muted">
                      <RiImageAddLine className="mx-auto h-10 w-10 mb-3 opacity-50" />
                      <span className="block text-sm font-medium">
                        Add primary image
                      </span>
                    </div>
                  )}
                </div>

                {/* Grid for extra images */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.slice(1).map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card"
                    >
                      <img
                        src={img}
                        alt={`Extra ${idx}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx + 1)}
                        className="absolute inset-0 flex items-center justify-center bg-dark/50 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm"
                      >
                        <RiCloseLine size={20} />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary-light bg-card text-primary-light hover:bg-primary-light/10 hover:text-primary transition">
                      <RiImageAddLine size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </section>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default QuickAddProduct;
