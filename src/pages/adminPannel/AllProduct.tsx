import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ImImages } from "react-icons/im";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { RiImageAddLine, RiCloseLine } from "react-icons/ri";

// Import your new reusable components (adjust path as needed)
import { Input, Select, TextArea, Button } from "../../components/ui/FormElements";

// --- Mock Data ---
const COLOR_DATA: Record<string, string[]> = {
  "Earth Tones": ["Olive Green", "Sand", "Rust", "Terracotta"],
  "Monochrome": ["Black", "White", "Warm Grey"],
};

const ATTR_DATA: Record<string, string[]> = {
  Fabric: ["100% French Terry Cotton", "Linen Blend", "Silk"],
  Fit: ["Oversized", "Slim Fit", "Relaxed"],
};

const SIZE_DATA: Record<string, string[]> = {
  Clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  Footwear: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
};

// --- Yup Validation Schema ---
const schema: yup.ObjectSchema<ProductFormValues> = yup.object({
  name: yup.string().required("Product Name is required"),
  category: yup.string().required("Category is required"),
  sizeType: yup.string().required("Size Type is required"),
  colorFamily: yup.string().required("Color Family is required"),
  color: yup.string().required("Color is required"),
  description: yup.string().required("Description is required"),
  images: yup.array().of(yup.string().required()).required("At least one image is required").min(1, "At least one image is required").max(10, "Max 10 images"),
  attributes: yup.array().of(
    yup.object({ property: yup.string().required(), value: yup.string().required() })
  ).default([]),
  variants: yup.array().of(
    yup.object({
      size: yup.string().required(),
      price: yup.number().typeError("Must be a number").required("Required").min(0),
      discountPrice: yup.number().typeError("Must be a number").min(0).nullable(),
      isAvailable: yup.boolean().default(true),
      isFewLeft: yup.boolean().default(false),
    })
  ).min(1, "At least one variant (Size & Price) is required").default([]),
}) as yup.ObjectSchema<ProductFormValues>;

type ProductFormValues = {
  name: string;
  category: string;
  sizeType: string;
  colorFamily: string;
  color: string;
  description: string;
  images: string[];
  attributes: { property: string; value: string }[];
  variants: Array<{
    size: string;
    price: number;
    discountPrice?: number;
    isAvailable?: boolean;
    isFewLeft?: boolean;
  }>;
};

const AllProduct = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      sizeType: "",
      colorFamily: "",
      color: "",
      description: "",
      images: [],
      attributes: [],
      variants: [],
    }
  });

  const selectedColorFamily = watch("colorFamily");
  const selectedSizeType = watch("sizeType");
  const images = watch("images") || [];
  const attributes = watch("attributes") || [];
  const variants = watch("variants") || [];

  useEffect(() => { setValue("color", ""); }, [selectedColorFamily, setValue]);

  // --- Draft States ---
  const [showAttrDraft, setShowAttrDraft] = useState(false);
  const [draftAttr, setDraftAttr] = useState({ property: "", value: "" });

  const [showVariantDraft, setShowVariantDraft] = useState(false);
  const [draftVariant, setDraftVariant] = useState({ size: "", price: "", discountPrice: "", isAvailable: true, isFewLeft: false });

  // --- Handlers ---
  const addAttribute = () => {
    if (draftAttr.property && draftAttr.value) {
      setValue("attributes", [...attributes, draftAttr]);
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
    if (e.target.files && images.length < 10) {
      setValue("images", [...images, URL.createObjectURL(e.target.files[0])]);
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    console.log("Payload:", data);
    alert("Product saved successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-body font-body selection:bg-rose-gold/30">
      <main className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex h-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold text-heading font-heading tracking-wide">Add Product</h2>
              <p className="text-sm text-muted mt-1">Curate a new piece for your collection.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button type="button" variant="secondary" onClick={() => reset()}>Reset</Button>
              <Button type="submit" variant="primary">Save Product</Button>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
            {/* Left Column */}
            <div className="flex flex-col gap-8">

              {/* Basic Details */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <h3 className="text-xl text-heading font-heading mb-6 border-b border-border pb-4">Basic Details</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input label="Product Name" required placeholder="e.g. Silk Blend Evening Dress" {...register("name")} error={errors.name?.message} />
                  </div>
                  <Select
                    label="Category"
                    required
                    {...register("category")}
                    error={errors.category?.message}
                    options={[
                      { label: "Apparel & Outerwear", value: "apparel" },
                      { label: "Footwear", value: "footwear" },
                      { label: "Accessories", value: "accessories" }
                    ]}
                  />
                  <Select
                    label="Size Type"
                    required
                    {...register("sizeType")}
                    error={errors.sizeType?.message}
                    options={Object.keys(SIZE_DATA).map(type => ({ label: type, value: type }))}
                  />
                  <div className="hidden sm:block"></div> {/* Spacer */}
                  <div className="sm:col-span-2 grid gap-6 md:grid-cols-2">
                    <Select
                      label="Color Family"
                      required
                      {...register("colorFamily")}
                      error={errors.colorFamily?.message}
                      options={Object.keys(COLOR_DATA).map(f => ({ label: f, value: f }))}
                    />
                    <Select
                      label="Specific Color"
                      required
                      disabled={!selectedColorFamily}
                      {...register("color")}
                      error={errors.color?.message}
                      options={selectedColorFamily ? COLOR_DATA[selectedColorFamily].map(c => ({ label: c, value: c })) : []}
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
                    <h3 className="text-xl text-heading font-heading">Variants & Pricing</h3>
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
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Size</label>
                        <select value={draftVariant.size} onChange={(e) => setDraftVariant({ ...draftVariant, size: e.target.value })} disabled={!selectedSizeType} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50">
                          <option value="" disabled>Select Size</option>
                          {selectedSizeType && SIZE_DATA[selectedSizeType].map(size => <option key={size} value={size}>{size}</option>)}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Price</label>
                        <input type="number" value={draftVariant.price} onChange={(e) => setDraftVariant({ ...draftVariant, price: e.target.value })} placeholder="0.00" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary" />
                      </div>
                      <div className="w-full">
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Discount</label>
                        <input type="number" value={draftVariant.discountPrice} onChange={(e) => setDraftVariant({ ...draftVariant, discountPrice: e.target.value })} placeholder="Optional" className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary" />
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
                          <input type="checkbox" checked={draftVariant.isAvailable} onChange={(e) => setDraftVariant({ ...draftVariant, isAvailable: e.target.checked })} className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary" />
                          Available
                        </label>
                        <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
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
                      <thead className="bg-card text-heading border-b border-border font-heading">
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
                            <td className="px-5 py-4 font-medium">{v.size}</td>
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
                  <div className="flex items-center gap-2 text-heading">
                    <ImImages className="text-primary text-xl" />
                    <h3 className="text-xl font-heading font-semibold">Media Gallery</h3>
                  </div>
                  <span className="rounded-md bg-card px-3 py-1 text-xs font-semibold text-primary-dark border border-border">
                    {images.length}/10
                  </span>
                </div>
                {errors.images && <p className="mb-4 text-xs text-error">{errors.images.message}</p>}

                {/* Primary Image */}
                <div className="group relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary-light">
                  {images.length > 0 ? (
                    <>
                      <span className="absolute left-4 top-4 z-10 rounded-sm bg-dark/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-background backdrop-blur-md">
                        Primary
                      </span>
                      <img src={images[0]} alt="Primary" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => { const n = [...images]; n.splice(0, 1); setValue("images", n); }} className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 text-error shadow-sm hover:bg-error hover:text-white transition">
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

                {/* Sub Images */}
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.slice(1).map((img: any, idx: any) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card">
                      <img src={img} alt={`Extra ${idx}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => { const n = [...images]; n.splice(idx + 1, 1); setValue("images", n); }} className="absolute inset-0 flex items-center justify-center bg-dark/50 text-white opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-sm">
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
                  <div className="flex items-center gap-2 text-heading">
                    <FaArrowsTurnRight className="text-primary" />
                    <h3 className="text-xl font-heading font-semibold">Attributes</h3>
                  </div>
                  <Button type="button" variant="icon" onClick={() => setShowAttrDraft(!showAttrDraft)}>
                    <span className="material-symbols-outlined">{showAttrDraft ? 'remove' : 'add'}</span>
                  </Button>
                </div>

                {showAttrDraft && (
                  <div className="mb-5 flex flex-col gap-4 rounded-lg border border-primary-light bg-card p-4 sm:flex-row sm:items-end shadow-inner">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Property</label>
                      <select value={draftAttr.property} onChange={(e) => setDraftAttr({ property: e.target.value, value: "" })} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary">
                        <option value="" disabled>Select</option>
                        {Object.keys(ATTR_DATA).map(prop => <option key={prop} value={prop}>{prop}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-muted">Value</label>
                      <select value={draftAttr.value} onChange={(e) => setDraftAttr({ ...draftAttr, value: e.target.value })} disabled={!draftAttr.property} className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-body outline-none focus:border-primary disabled:opacity-50">
                        <option value="" disabled>Select</option>
                        {draftAttr.property && ATTR_DATA[draftAttr.property].map(val => <option key={val} value={val}>{val}</option>)}
                      </select>
                    </div>
                    <Button type="button" variant="primary" onClick={addAttribute} className="px-5 py-2">Add</Button>
                  </div>
                )}

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
                        {attributes.map((attr: any, index: any) => (
                          <tr key={index} className="hover:bg-card/40 transition">
                            <td className="px-4 py-3 font-medium text-heading">{attr.property}</td>
                            <td className="px-4 py-3 text-muted">{attr.value}</td>
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