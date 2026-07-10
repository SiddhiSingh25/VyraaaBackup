import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxRulerSquare } from "react-icons/rx";
import { TbCategoryPlus } from "react-icons/tb";
import { FiPlus, FiCheck, FiX } from "react-icons/fi";

// Reusable components (ensure path matches your project)
import { Input, Select, Button } from "../../components/ui/FormElements";

// --- YUP VALIDATION SCHEMA ---
const schema = yup.object().shape({
  category: yup.string().required("Category is required"),
  subcategory: yup.string().required("Subcategory is required"),
  subcategoryType: yup.string().required("Subcategory Type is required"),
  
  properties: yup.array().of(
    yup.object().shape({
      property: yup.string().required(),
      value: yup.string().required(),
    })
  ).default([]),
  
  colorFamily: yup.string().required("Color Family is required"),
  colors: yup.array().of(yup.string().required()).min(1, "Add at least one color").default([]),
  
  sizeType: yup.string().required("Size Type is required"),
  sizes: yup.array().of(yup.string().required()).min(1, "Add at least one size").default([]),
});

type MasterFormValues = yup.InferType<typeof schema>;

const MasterChannel = () => {
  // --- DYNAMIC MASTER DATA STATE ---
  const [masterData, setMasterData] = useState({
    categories: ["Clothes", "Shoes", "Bags"],
    subcategories: {
      Clothes: ["T-Shirt", "Shirt", "Jeans", "Kurta"],
      Shoes: ["Sneakers", "Formal"],
      Bags: ["Tote", "Backpack"],
    } as Record<string, string[]>,
    subcategoryTypes: ["Top", "Bottom", "Set", "Single Piece"],
    colorFamilies: ["Earth Tones", "Monochrome"],
    sizeTypes: ["Topwear (Alpha)", "Bottomwear (Numeric)"],
  });

  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<MasterFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { properties: [], colors: [], sizes: [] }
  });

  // --- WATCHERS ---
  const selectedCategory = watch("category");
  const selectedColorFamily = watch("colorFamily");
  const selectedSizeType = watch("sizeType");
  
  const properties = watch("properties") || [];
  const colors = watch("colors") || [];
  const sizes = watch("sizes") || [];

  // --- DEPENDENCY RESET LOGIC ---
  useEffect(() => {
    setValue("subcategory", "");
    setValue("properties", []);
  }, [selectedCategory, setValue]);

  useEffect(() => {
    setValue("colors", []);
  }, [selectedColorFamily, setValue]);

  useEffect(() => {
    setValue("sizes", []);
  }, [selectedSizeType, setValue]);

  // --- DRAFT STATES FOR INLINE CREATION ---
  const [draftProperty, setDraftProperty] = useState({ property: "", value: "" });
  const [draftColor, setDraftColor] = useState("");
  const [draftSize, setDraftSize] = useState("");

  // --- ADD TO ARRAY HANDLERS (Properties, Colors, Sizes) ---
  const addProperty = () => {
    if (draftProperty.property && draftProperty.value) {
      setValue("properties", [...properties, draftProperty]);
      setDraftProperty({ property: "", value: "" });
    }
  };

  const addColor = () => {
    if (draftColor && !colors.includes(draftColor)) {
      setValue("colors", [...colors, draftColor]);
      setDraftColor("");
    }
  };

  const addSize = () => {
    if (draftSize && !sizes.includes(draftSize)) {
      setValue("sizes", [...sizes, draftSize]);
      setDraftSize("");
    }
  };

  const removeItem = (field: "properties" | "colors" | "sizes", index: number) => {
    const currentArr = watch(field) as any[];
    setValue(field, currentArr.filter((_, i) => i !== index) as any);
  };

  // --- INLINE ADDER COMPONENT (Local Helper) ---
  const InlineAdder = ({ 
    label, options, formKey, error, disabled = false, onSave 
  }: { 
    label: string, options: string[], formKey: any, error?: string, disabled?: boolean, onSave: (val: string) => void 
  }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newVal, setNewVal] = useState("");

    const handleSave = () => {
      if (newVal.trim()) {
        onSave(newVal.trim());
        setValue(formKey, newVal.trim()); // Auto-select the newly added value
        setNewVal("");
        setIsAdding(false);
      }
    };

    if (isAdding) {
      return (
        <div className="w-full animate-in fade-in zoom-in-95 duration-200">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-primary">New {label}</label>
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder={`Enter new ${label.toLowerCase()}`}
              className="w-full rounded-md border border-primary bg-background px-4 py-2 text-sm text-admin-text outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="button" onClick={handleSave} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-success text-white hover:bg-success/90 transition shadow-sm">
              <FiCheck />
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted hover:bg-card transition shadow-sm">
              <FiX />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-end gap-2 w-full">
        <div className="flex-1">
          <Select
            label={label}
            disabled={disabled}
            error={error}
            {...register(formKey)}
            options={options.map(opt => ({ label: opt, value: opt }))}
          />
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsAdding(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-primary hover:bg-primary hover:text-white transition disabled:opacity-50 disabled:hover:bg-surface disabled:hover:text-primary shadow-sm"
          title={`Add new ${label}`}
        >
          <FiPlus size={18} />
        </button>
      </div>
    );
  };

  // --- FORM SUBMISSION ---
  const onSubmit = (data: MasterFormValues) => {
    console.log("Master Configuration Saved:", data);
    alert("Configuration mapped successfully!");
    reset();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-body font-body selection:bg-rose-gold/30">
      <main className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex h-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold text-admin-text font-heading tracking-wide">Master Builder</h2>
              <p className="text-sm text-muted mt-1">Dynamically create and link categories, properties, and variants.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button type="button" variant="secondary" onClick={() => reset()}>Reset Form</Button>
              <Button type="submit" variant="primary">Save Configuration</Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* COLUMN 1: Classification & Properties */}
            <div className="flex flex-col gap-8">
              
              {/* Classification Setup */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <TbCategoryPlus className="text-primary text-2xl" />
                  <h3 className="text-xl text-admin-text font-heading">Classification</h3>
                </div>
                
                <div className="flex flex-col gap-6">
                  <InlineAdder 
                    label="Parent Category" 
                    formKey="category"
                    options={masterData.categories}
                    error={errors.category?.message}
                    onSave={(val) => setMasterData(prev => ({ ...prev, categories: [...prev.categories, val], subcategories: { ...prev.subcategories, [val]: [] } }))}
                  />
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <InlineAdder 
                      label="Subcategory" 
                      formKey="subcategory"
                      disabled={!selectedCategory}
                      options={selectedCategory ? (masterData.subcategories[selectedCategory] || []) : []}
                      error={errors.subcategory?.message}
                      onSave={(val) => setMasterData(prev => ({ ...prev, subcategories: { ...prev.subcategories, [selectedCategory]: [...(prev.subcategories[selectedCategory] || []), val] } }))}
                    />
                    
                    <InlineAdder 
                      label="Subcategory Type" 
                      formKey="subcategoryType"
                      disabled={!selectedCategory}
                      options={masterData.subcategoryTypes}
                      error={errors.subcategoryType?.message}
                      onSave={(val) => setMasterData(prev => ({ ...prev, subcategoryTypes: [...prev.subcategoryTypes, val] }))}
                    />
                  </div>
                </div>
              </section>

              {/* Dependent Properties Setup */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <FaArrowsTurnRight className="text-primary text-xl" />
                  <h3 className="text-xl text-admin-text font-heading">Dependent Properties</h3>
                </div>

                <div className="mb-5 rounded-lg border border-border bg-card p-4">
                  <p className="mb-3 text-xs text-muted">Bind attributes strictly to <strong>{watch("subcategory") || "the selected subcategory"}</strong>.</p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Input label="Property Key" placeholder="e.g. Fabric" value={draftProperty.property} onChange={(e) => setDraftProperty({...draftProperty, property: e.target.value})} disabled={!watch("subcategory")} />
                    </div>
                    <div className="flex-1">
                      <Input label="Value" placeholder="e.g. 100% Cotton" value={draftProperty.value} onChange={(e) => setDraftProperty({...draftProperty, value: e.target.value})} disabled={!watch("subcategory")} />
                    </div>
                    <Button type="button" variant="secondary" onClick={addProperty} disabled={!draftProperty.property || !draftProperty.value}>
                      Add
                    </Button>
                  </div>
                </div>

                {properties.length > 0 && (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-card text-admin-text font-heading border-b border-border">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Property</th>
                          <th className="px-4 py-3 font-semibold">Value</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {properties.map((attr, index) => (
                          <tr key={index} className="hover:bg-card/40 transition text-body">
                            <td className="px-4 py-3 font-medium">{attr.property}</td>
                            <td className="px-4 py-3">{attr.value}</td>
                            <td className="px-4 py-3 text-right">
                              <button type="button" onClick={() => removeItem("properties", index)} className="text-muted hover:text-error transition"><MdOutlineDeleteSweep size={20} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

            </div>

            {/* COLUMN 2: Colors & Sizes */}
            <div className="flex flex-col gap-8">
              
              {/* Color Setup */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <IoColorPaletteOutline className="text-primary text-2xl" />
                  <h3 className="text-xl text-admin-text font-heading">Color Standards</h3>
                </div>
                
                <InlineAdder 
                  label="Color Family" 
                  formKey="colorFamily"
                  options={masterData.colorFamilies}
                  error={errors.colorFamily?.message}
                  onSave={(val) => setMasterData(prev => ({ ...prev, colorFamilies: [...prev.colorFamilies, val] }))}
                />

                <div className="mt-5 rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Input label="Add Specific Color" placeholder="e.g. Olive Green" value={draftColor} onChange={(e) => setDraftColor(e.target.value)} disabled={!selectedColorFamily} />
                    </div>
                    <Button type="button" variant="secondary" onClick={addColor} disabled={!draftColor}>Add to Lineup</Button>
                  </div>
                </div>
                {errors.colors && colors.length === 0 && <p className="mt-2 text-xs text-error">{errors.colors.message}</p>}

                {colors.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {colors.map((color, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-admin-text shadow-sm font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary/40 block"></span>
                        {color}
                        <button type="button" onClick={() => removeItem("colors", idx)} className="text-muted hover:text-error transition leading-none ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Sizes Setup */}
              <section className="rounded-xl border border-border bg-surface p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <RxRulerSquare className="text-primary text-2xl" />
                  <h3 className="text-xl text-admin-text font-heading">Sizing Standards</h3>
                </div>

                <InlineAdder 
                  label="Size Type" 
                  formKey="sizeType"
                  options={masterData.sizeTypes}
                  error={errors.sizeType?.message}
                  onSave={(val) => setMasterData(prev => ({ ...prev, sizeTypes: [...prev.sizeTypes, val] }))}
                />

                <div className="mt-5 rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Input label="Add Specific Size" placeholder="e.g. XL, 32, UK 8" value={draftSize} onChange={(e) => setDraftSize(e.target.value)} disabled={!selectedSizeType} />
                    </div>
                    <Button type="button" variant="secondary" onClick={addSize} disabled={!draftSize}>Add Size</Button>
                  </div>
                </div>
                {errors.sizes && sizes.length === 0 && <p className="mt-2 text-xs text-error">{errors.sizes.message}</p>}

                {sizes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sizes.map((size, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-sm font-semibold text-admin-text shadow-sm">
                        {size}
                        <button type="button" onClick={() => removeItem("sizes", idx)} className="text-muted hover:text-error transition leading-none font-normal ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default MasterChannel;