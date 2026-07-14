import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ImImages } from "react-icons/im";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { RiImageAddLine, RiCloseLine } from "react-icons/ri";

import { Input, Select, TextArea, Button } from "../../components/ui/FormElements";
import { apiUrls } from "../../apis";
import useCategoryData from "./AddProduct/api/useCategoryData";
import useTaxonomyData from "./AddProduct/api/useTaxonomyData";
import useBrandData from "./AddProduct/api/useBrandData";
import useColorFamilyData from "./AddProduct/api/useColorFamilyData";
import useColorData from "./AddProduct/api/useColorData";
import useSizeTypeData from "./AddProduct/api/useSizeTypeData";
import useSizeValueData from "./AddProduct/api/useSizeValueData";
import usePropertyTypeData from "./AddProduct/api/usePropertyTypeData";
import usePropertyValueData from "./AddProduct/api/usePropertyValueData";
import usePostQuery from "../../hooks/postQuery.hook";
import { useToast } from "../../hooks/useToast.hook";

// --- Yup Validation Schema ---
const schema: yup.ObjectSchema<ProductFormValues> = yup.object({
  name: yup.string().required("Product Name is required"),
  category: yup.string().required("Category is required"),
  subcategory: yup.string().required("Subcategory is required"),
  brand: yup.string().required("Brand is required"),
  sizeType: yup.string().required("Size Type is required"),
  colorFamily: yup.string().required("Color Family is required"),
  color: yup.string().required("Color is required"),
  description: yup.string().required("Description is required"),
  images: yup.array().of(yup.string().required()).required("At least one image is required").min(1, "At least one image is required").max(10, "Max 10 images"),
  attributes: yup.array().of(
    yup.object({
      property: yup.string().required(),
      value: yup.string().required(),
      propertyLabel: yup.string(),
      valueLabel: yup.string(),
    }),
  ).default([]),
  variants: yup.array().of(
    yup.object({
      size: yup.string().required(),
      price: yup.number().typeError("Must be a number").required("Required").min(0),
      discountPrice: yup.number().typeError("Must be a number").min(0).nullable(),
      isAvailable: yup.boolean().default(true),
      isFewLeft: yup.boolean().default(false),
    }),
  ).min(1, "At least one variant (Size & Price) is required").default([]),
}) as yup.ObjectSchema<ProductFormValues>;

type ProductFormValues = {
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  sizeType: string;
  colorFamily: string;
  color: string;
  description: string;
  images: string[];
  attributes: Array<{
    property: string;
    value: string;
    propertyLabel: string;
    valueLabel: string;
  }>;
  variants: Array<{
    size: string;
    price: number;
    discountPrice?: number;
    isAvailable?: boolean;
    isFewLeft?: boolean;
  }>;
};

type DraftAttribute = {
  property: string;
  value: string;
};

type DraftVariant = {
  size: string;
  price: string;
  discountPrice: string;
  isAvailable: boolean;
  isFewLeft: boolean;
};

// Route is expected to be something like:
// /admin/product/:categorySlug/:categoryId
// e.g. /admin/product/shoes/6a4742d8860ccf879fb4a3f8
// Rename these two keys below if your route uses different param names.
type RouteParams = {
  categorySlug: string;
  categoryId: string;
};

const AllProduct = () => {
  const { categorySlug, categoryId } = useParams<RouteParams>();
  const { toast } = useToast();

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      category: categoryId || "",
      subcategory: "",
      brand: "",
      sizeType: "",
      colorFamily: "",
      color: "",
      description: "",
      images: [],
      attributes: [],
      variants: [],
    },
  });

  // Category now comes from the URL, not from user selection.
  const selectedCategory = categoryId || "";
  const selectedSubcategory = watch("subcategory");
  const selectedColorFamily = watch("colorFamily");
  const selectedSizeType = watch("sizeType");
  const images = watch("images") || [];
  const attributes = watch("attributes") || [];
  const variants = watch("variants") || [];

  const [showAttrDraft, setShowAttrDraft] = useState(false);
  const [draftAttr, setDraftAttr] = useState<DraftAttribute>({ property: "", value: "" });
  const [showVariantDraft, setShowVariantDraft] = useState(false);
  const [draftVariant, setDraftVariant] = useState<DraftVariant>({ size: "", price: "", discountPrice: "", isAvailable: true, isFewLeft: false });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { categoryOptions } = useCategoryData();
  const { subcategoryOptions } = useTaxonomyData(selectedCategory);
  const { brandOptions } = useBrandData(selectedCategory);
  const { colorFamilyOptions } = useColorFamilyData();
  const { colorOptions } = useColorData(selectedColorFamily);
  const { sizeTypeOptions } = useSizeTypeData();
  const { sizeValueOptions } = useSizeValueData(selectedSizeType);
  const { propertyTypeOptions } = usePropertyTypeData(selectedSubcategory);
  const { propertyValueOptions } = usePropertyValueData(draftAttr.property);

  const { postQuery } = usePostQuery();

  // Guard: bail out early (with a toast) if the route didn't actually give us a category id.
  useEffect(() => {
    if (!categoryId) {
      toast("error", "No category found in the URL. Please navigate here from the category list.");
    }
  }, [categoryId, toast]);

  // Push the param-derived category id into the form whenever it changes
  // (e.g. navigating between /admin/product/shoes/:id1 and /admin/product/bags/:id2).
  useEffect(() => {
    setValue("category", categoryId || "");
  }, [categoryId, setValue]);

  // Category changed (via the URL) -> reset everything that depends on it.
  useEffect(() => {
    setValue("subcategory", "");
    setValue("brand", "");
    setValue("attributes", []);
    setDraftAttr({ property: "", value: "" });
  }, [categoryId, setValue]);

  useEffect(() => {
    setValue("attributes", []);
    setDraftAttr({ property: "", value: "" });
  }, [selectedSubcategory, setValue]);

  useEffect(() => {
    setValue("color", "");
  }, [selectedColorFamily, setValue]);

  // useEffect(() => {
  //   setValue("variants", []);
  //   setDraftVariant({ size: "", price: "", discountPrice: "", isAvailable: true, isFewLeft: false });
  // }, [selectedSizeType, setValue]);


  useEffect(() => {
  setValue("variants", []);

  setDraftVariant({
    size: "",
    price: "",
    discountPrice: "",
    isAvailable: true,
    isFewLeft: false,
  });
}, [selectedSizeType, setValue]);

  // Nice label to show in place of the old dropdown ("Shoes" instead of the raw slug/id).
  const currentCategoryLabel =
    categoryOptions.find((opt) => opt.value === categoryId)?.label ||
    (categorySlug ? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Unknown Category");

  const addAttribute = () => {
    if (draftAttr.property && draftAttr.value) {
      const propertyLabel = propertyTypeOptions.find((opt) => opt.value === draftAttr.property)?.label || "";
      const valueLabel = propertyValueOptions.find((opt) => opt.value === draftAttr.value)?.label || "";
      setValue("attributes", [...attributes, { ...draftAttr, propertyLabel, valueLabel }]);
      setDraftAttr({ property: "", value: "" });
      setShowAttrDraft(false);
    }
  };

  const addVariant = () => {
    if (selectedSizeType && draftVariant.size && draftVariant.price) {
      setValue("variants", [...variants, { ...draftVariant, price: Number(draftVariant.price), discountPrice: draftVariant.discountPrice ? Number(draftVariant.discountPrice) : undefined }] as any);
      setDraftVariant({ size: "", price: "", discountPrice: "", isAvailable: true, isFewLeft: false });
      setShowVariantDraft(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || images.length >= 10) return;

    const file = e.target.files[0];
    const previewUrl = URL.createObjectURL(file);

    setImageFiles((prev) => [...prev, file]);
    setValue("images", [...images, previewUrl]);
  };

  const handleRemoveImage = (index: number) => {
    const nextImages = [...images];
    nextImages.splice(index, 1);
    setValue("images", nextImages);
    setImageFiles((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const uploadImages = async (files: File[]) => {
    const imageUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await postQuery({
        url: apiUrls.Image.upload,
        postData: formData,
      });

      if (!uploadResponse?.data) {
        throw new Error("Image upload failed");
      }

      imageUrls.push(uploadResponse.data);
    }

    return imageUrls;
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (!categoryId) {
      toast("error", "Missing category id from the URL. Cannot save product.");
      return;
    }

    if (!imageFiles.length) {
      toast("error", "Upload product images before saving.");
      return;
    }

    const payload = {
      title: data.name,
      description: data.description,
      color: data.color,
      category: categoryId,
      subCategory: data.subcategory,
      brand: data.brand,
      sizeType: data.sizeType,
      price: data.variants.map((variant) => ({
        size: variant.size,
        amount: variant.price,
        isAvailable: variant.isAvailable,
        isFewLeft: variant.isFewLeft,
        markupPrice: variant.price || 0,
        discount: variant.discountPrice || 0,
      })),
      attributes: data.attributes.map((attr) => ({ property: attr.property, value: attr.value })),
      linkItems: [],
    };

    try {
      const imageUrls = await uploadImages(imageFiles);

      const payloadWithImages = {
        ...payload,
        image: imageUrls[0] || "",
        subImages: imageUrls.length > 1 ? imageUrls.slice(1).map((img) => ({ imageUrl: img })) : [],
      };

      const productResponse = await postQuery({
        url: apiUrls.Product.add,
        postData: payloadWithImages,
      });

      toast("success", productResponse?.message || productResponse?.data?.message || "Product added successfully");
      reset({
        name: "",
        category: categoryId,
        subcategory: "",
        brand: "",
        sizeType: "",
        colorFamily: "",
        color: "",
        description: "",
        images: [],
        attributes: [],
        variants: [],
      });
      setImageFiles([]);
    } catch (err: any) {
      console.error(err);
      toast("error", err?.response?.data?.message || err?.message || "Could not add product");
    }
  };

  const getSizeLabel = (sizeId: string) => sizeValueOptions.find((opt) => opt.value === sizeId)?.label || sizeId;

  return (
    <div className="flex min-h-screen flex-col bg-background text-body font-admin-text selection:bg-rose-gold/30">
      <main className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex h-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold  text-sm font-semibold tracking-tight  tracking-wide">Add Product</h2>
              <p className="text-sm text-muted mt-1">
                Curate a new piece for your collection.{" "}
                <span className="ml-1 inline-flex items-center rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary-dark border border-border align-middle">
                  Category: {currentCategoryLabel}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button type="button" variant="secondary" onClick={() => { reset(); setImageFiles([]); }}>Reset</Button>
              <Button type="submit" variant="primary" disabled={!categoryId}>Save Product</Button>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
            {/* Left Column */}
            <div className="flex flex-col gap-8">

              {/* Basic Details */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <h3 className="text-xl  text-sm font-semibold tracking-tight  mb-6 border-b border-border pb-4">Basic Details</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input label="Product Name" required placeholder="e.g. Silk Blend Evening Dress" {...register("name")} error={errors.name?.message} />
                  </div>

                  {/* Category select removed — category is taken from the URL param (categoryId) */}
                  <input type="hidden" {...register("category")} value={categoryId || ""} />

                  <Select
                    label="Subcategory"
                    required
                    disabled={!selectedCategory}
                    {...register("subcategory")}
                    error={errors.subcategory?.message}
                    options={subcategoryOptions}
                  />
                  <Select
                    label="Brand"
                    required
                    disabled={!selectedCategory}
                    {...register("brand")}
                    error={errors.brand?.message}
                    options={brandOptions}
                  />
                  <Select
                    label="Size Type"
                    required
                    {...register("sizeType")}
                    error={errors.sizeType?.message}
                    options={sizeTypeOptions}
                  />
                  <div className="sm:col-span-2 grid gap-6 md:grid-cols-2">
                    <Select
                      label="Color Family"
                      required
                      {...register("colorFamily")}
                      error={errors.colorFamily?.message}
                      options={colorFamilyOptions}
                    />
                    <Select
                      label="Specific Color"
                      required
                      disabled={!selectedColorFamily}
                      {...register("color")}
                      error={errors.color?.message}
                      options={colorOptions}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextArea label="Description" required rows={5} placeholder="Describe the material, fit, and aesthetic..." {...register("description")} error={errors.description?.message} />
                  </div>
                </div>
              </section>

              {/* Variants Section */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div>
                    <h3 className="text-xl  text-sm font-semibold tracking-tight ">Variants & Pricing</h3>
                    <p className="text-xs text-muted mt-1">Manage inventory sizes and specific pricing.</p>
                  </div>
                  <Button type="button" variant="icon" onClick={() => setShowVariantDraft(!showVariantDraft)}>
                    <span className="material-symbols-outlined">{showVariantDraft ? 'remove' : 'add'}</span>
                  </Button>
                </div>
                {errors.variants && !showVariantDraft && variants.length === 0 && <p className="mb-4 text-sm text-error">{errors.variants.message}</p>}

                {showVariantDraft && (
                  <div className="mb-8 rounded-lg border border-primary-light bg-card p-5 shadow-inner">
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">Size</label>
                        <select value={draftVariant.size} onChange={(e) => setDraftVariant({ ...draftVariant, size: e.target.value })} disabled={!selectedSizeType} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50">
                          <option value="" disabled>Select Size</option>
                          {selectedSizeType && sizeValueOptions.map((size) => <option key={size.value} value={size.value}>{size.label}</option>)}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">Price</label>
                        <input type="number" value={draftVariant.price} onChange={(e) => setDraftVariant({ ...draftVariant, price: e.target.value })} placeholder="0.00" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary" />
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">Discount</label>
                        <input type="number" value={draftVariant.discountPrice} onChange={(e) => setDraftVariant({ ...draftVariant, discountPrice: e.target.value })} placeholder="Optional" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm  cursor-pointer select-none">
                          <input type="checkbox" checked={draftVariant.isAvailable} onChange={(e) => setDraftVariant({ ...draftVariant, isAvailable: e.target.checked })} className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary" />
                          Available
                        </label>
                        <label className="flex items-center gap-2 text-sm  cursor-pointer select-none">
                          <input type="checkbox" checked={draftVariant.isFewLeft} onChange={(e) => setDraftVariant({ ...draftVariant, isFewLeft: e.target.checked })} className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary" />
                          Few Left
                        </label>
                      </div>
                      <Button type="button" variant="primary" onClick={addVariant} className="px-4 py-1.5">Add to Listing</Button>
                    </div>
                  </div>
                )}

                {variants.length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-card  border-b border-border text-sm font-semibold tracking-tight ">
                        <tr>
                          <th className="px-5 py-3 font-semibold">Size</th>
                          <th className="px-5 py-3 font-semibold">Price</th>
                          <th className="px-5 py-3 font-semibold">Discount</th>
                          <th className="px-5 py-3 font-semibold">Status</th>
                          <th className="px-5 py-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {variants.map((v: any, idx: any) => (
                          <tr key={idx} className="hover:bg-card/40 transition-colors text-body">
                            <td className="px-5 py-4 font-medium">{getSizeLabel(v.size)}</td>
                            <td className="px-5 py-4">₹{v.price}</td>
                            <td className="px-5 py-4 text-muted">{v.discountPrice ? `₹${v.discountPrice}` : '-'}</td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${v.isAvailable ? 'bg-success' : 'bg-error'}`}></span>
                                {v.isFewLeft && <span className="rounded-md bg-warning/20 px-2 py-0.5 text-[10px] font-bold text-warning uppercase tracking-wider">Few Left</span>}
                              </div>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <button type="button" onClick={() => { const n = [...variants]; n.splice(idx, 1); setValue("variants", n); }} className="text-muted hover:text-error transition">
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
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8">

              {/* Media Gallery */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 ">
                    <ImImages className="text-primary text-xl" />
                    <h3 className="text-xl text-sm font-semibold tracking-tight  font-semibold">Media Gallery</h3>
                  </div>
                  <span className="rounded-md bg-card px-3 py-1 text-xs font-semibold text-primary-dark border border-border">
                    {images.length}/10
                  </span>
                </div>
                {errors.images && <p className="mb-4 text-xs text-error">{errors.images.message}</p>}

                <div className="group relative flex aspect-4/5 w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary-light">
                  {images.length > 0 ? (
                    <>
                      <span className="absolute left-4 top-4 z-10 rounded-sm bg-dark/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-background backdrop-blur-md">
                        Primary
                      </span>
                      <img src={images[0]} alt="Primary" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(0)} className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 text-error shadow-sm hover:bg-error hover:text-white transition">
                        <RiCloseLine size={18} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 text-muted">
                      <RiImageAddLine className="mx-auto h-10 w-10 mb-3 opacity-50" />
                      <span className="block text-sm font-medium">Add primary image</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.slice(1).map((img: any, idx: any) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
                      <img src={img} alt={`Extra ${idx}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx + 1)} className="absolute inset-0 flex items-center justify-center bg-dark/50 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
                        <RiCloseLine size={24} />
                      </button>
                    </div>
                  ))}

                  {images.length < 10 && (
                    <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-primary-light bg-card text-primary-light hover:bg-primary-light/10 hover:text-primary transition">
                      <RiImageAddLine size={24} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </section>

              {/* Attributes */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
                  <div className="flex items-center gap-2 ">
                    <FaArrowsTurnRight className="text-primary" />
                    <h3 className="text-xl text-sm font-semibold tracking-tight  font-semibold">Attributes</h3>
                  </div>
                  <Button type="button" variant="icon" onClick={() => setShowAttrDraft(!showAttrDraft)}>
                    <span className="material-symbols-outlined">{showAttrDraft ? 'remove' : 'add'}</span>
                  </Button>
                </div>

                {showAttrDraft && (
                  <div className="mb-5 flex flex-col gap-4 rounded-lg border border-primary-light bg-card p-4 sm:flex-row sm:items-end shadow-inner">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">Property</label>
                      <select value={draftAttr.property} onChange={(e) => setDraftAttr({ property: e.target.value, value: "" })} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary">
                        <option value="" disabled>Select</option>
                        {propertyTypeOptions.map((prop) => <option key={prop.value} value={prop.value}>{prop.label}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">Value</label>
                      <select value={draftAttr.value} onChange={(e) => setDraftAttr({ ...draftAttr, value: e.target.value })} disabled={!draftAttr.property} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50">
                        <option value="" disabled>Select</option>
                        {draftAttr.property && propertyValueOptions.map((val) => <option key={val.value} value={val.value}>{val.label}</option>)}
                      </select>
                    </div>
                    <Button type="button" variant="primary" onClick={addAttribute} className="px-5 py-2">Add</Button>
                  </div>
                )}

                {attributes.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-card  text-sm font-semibold tracking-tight  border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Property</th>
                          <th className="px-4 py-3 font-semibold">Value</th>
                          <th className="px-4 py-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {attributes.map((attr: any, index: any) => (
                          <tr key={index} className="hover:bg-card/40 transition">
                            <td className="px-4 py-3 font-medium ">{attr.propertyLabel || attr.property}</td>
                            <td className="px-4 py-3 text-muted">{attr.valueLabel || attr.value}</td>
                            <td className="px-4 py-3 text-right">
                              <button type="button" onClick={() => { const n = [...attributes]; n.splice(index, 1); setValue("attributes", n); }} className="text-muted hover:text-error transition">
                                <MdOutlineDeleteSweep size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-muted text-center py-6 border border-dashed border-border rounded-lg bg-card/50">No attributes assigned.</p>
                )}
              </section>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AllProduct;