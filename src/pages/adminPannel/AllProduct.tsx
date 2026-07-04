import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImImages } from "react-icons/im";
import { FaArrowsTurnRight } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineDeleteSweep } from "react-icons/md";

const AllProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    altText: "",
  });

  const productAttributes: any = [
    { label: "Fabric", value: "100% French Terry Cotton" },
    { label: "Neck Type", value: "Drawstring Hood" },
    { label: "Weight", value: "450 GSM" },
  ];

  const handleChange = (field: keyof typeof productData) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setProductData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Create product", productData);
  };

  const resetForm = () => {
    setProductData({
      name: "",
      sku: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      altText: "",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">

      <main className="flex-1 overflow-hidden">
        <div className="mx-auto flex h-full max-w-6xl flex-col gap-5 px-6 py-6">
          <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
            <form onSubmit={handleSubmit} className="rounded-xs border border-border bg-surface-bright p-5 shadow-sm shadow-black/5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Add Product</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={resetForm} className="rounded-xs border border-outline-variant/40 bg-surface px-4 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-primary transition hover:bg-surface-container-low">
                    Reset
                  </button>
                  <button type="submit" className="rounded-xs bg-primary px-5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-primary/90">
                    Save Product
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                    Product Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={productData.name}
                    onChange={handleChange("name")}
                    placeholder="Enter product name"
                    className="luxury-input w-full rounded-xs border border-border bg-surface-container-low px-2 py-2 text-xs hover:border-primary focus:outline-primary focus:outline-1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                    Category
                  </label>
                  <select value={productData.category} onChange={handleChange("category")} className="luxury-input w-full rounded-xs border border-border bg-surface-container-low px-2 py-2 text-xs hover:border-primary focus:outline-primary focus:outline-1">
                    <option value="">Select category</option>
                    <option value="apparel">Apparel & Outerwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                    Color Family
                  </label>
                  <select value={productData.category} onChange={handleChange("category")} className="luxury-input w-full rounded-xs border border-border bg-surface-container-low px-2 py-2 text-xs">
                    <option value="">Color Family</option>
                    <option value="apparel">Apparel & Outerwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                    Color
                  </label>
                  <select value={productData.category} onChange={handleChange("category")} className="luxury-input w-full rounded-xs border border-border bg-surface-container-low px-2 py-2 text-xs">
                    <option value="">Select category</option>
                    <option value="apparel">Apparel & Outerwear</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>



                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={productData.description}
                    onChange={handleChange("description")}
                    placeholder="Write a short product description"
                    className="luxury-input w-full resize-y rounded-xs border border-border bg-surface-container-low px-2 py-2 text-xs"
                  />
                </div>
              </div>
            </form>

            <section className="rounded-xs border border-border bg-surface-bright p-5 shadow-sm shadow-black/5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary"><ImImages /></span>
                  <div>
                    <h3 className="text-base font-semibold">Media Gallery</h3>
                  </div>
                </div>
                <span className="rounded-xs bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                  4/10
                </span>
              </div>
              <div className="group relative mt-4 overflow-hidden rounded-xs border border-border bg-surface-container-low">
                <span className="absolute left-4 top-4 rounded-xs border border-border bg-background/90 px-3 py-1 text-[10px] uppercase text-on-background backdrop-blur">
                  Primary
                </span>
                <img
                  className="h-80 object-contain p-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD33iAfRNio4ph1JrPEVaqs3u0Py7_4qq9CsU1joT7mBVL0NZnYSYyTmLfJQisekqZXpDKaA-M47wwhKojEjK3r-b9u37iT-va15GO6XK3zl1E4AGgt2D6EMC3QoMkji7eFW9JLTTy8skiV6iYsgmV0mwppA2P2EqkMZtsjx-GlMU7c1Wb5HvkttZjAaHZjYNU-xBdkQAWXldw1Z5Ziw8a3a7HO9qii-IyJYutlIH_HuR28BWpwHexIYw"
                  alt="Premium black hoodie"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-xs bg-surface px-3 py-2 text-primary shadow-sm">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="aspect-square overflow-hidden rounded-xs border-2 border-primary bg-surface-container-low">
                  <img
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpCDM5S9Ihd_ro_KWj9Hh-UgvIClg1Jc40tdDivJA46B8mqah2WA6gOjvNHnZQO5uSaFckqMD1mxPLY-NHhKtTMbMn67Q2uJyH9KpbKGSOvlkUztjJy5nxyvN4gS3AqyqksdCP8Alkb-82pnqYLL04c-TQrGgp-gp3YutBwP_MTYbHkivclLaFCo_WA2gyIa1cmC4l28KxXgKmcPsMySX4ECFfuds5hF9WXr-kMMqWnR9pSFYFnV0Fpw"
                    alt="Close up shot of hoodie texture"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-xs border border-outline-variant bg-surface-container-low opacity-70 transition-opacity hover:opacity-100">
                  <img
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCXOWr6234AXZZou_WDyrAgB2bJJ2ic98Isqk_FY32MhLNZqQQeB0d9viqx2m9LbPDUkblVey9FHnA1v9VZPrfSJ_UMxgKilYQokNXcfqTyTCo5aFFLOs-Fk_8y7JFQvqyoRpUTF5Q3xM81h3GX9XR1GAmnF9sVsdee0DOXodZkAIaNqsMsVlVBLbqHKyMH3s4baUVWpSBhpP_pcum10-0TI0wU9AolgsaE4q_YCnZITpik_XIRj4HGA"
                    alt="Model wearing black hoodie"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-xs border border-outline-variant bg-surface-container-low opacity-70 transition-opacity hover:opacity-100">
                  <img
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgEFr6QKuDCh4IV8VfG3kXzG3cRpKOkI2ZR82NpbgsGGxeHBO7iIJ24G1nX38ZMyco9YoW6nlIxXIaoCHfv8QEUEg5jb6N2xjK8j0PQTAVi7UqSkN9lmUboZg3J2X8QyxZ6yRKfTc8ceMGL4zlnZvXNEHR1whRWE21RgLk9Y9xrpyodsm90IMciz5Gp0Zdmghhyo-rdC3yqd1Sa3FXLaoqUS6lg32U7rf249rKdrON6TDBExgua2a-cg"
                    alt="Detail shot of zipper and drawstrings"
                  />
                </div>
                <button className="flex aspect-square items-center justify-center rounded-xs border border-dashed border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-highest">
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                </button>
              </div>

            </section>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <section className="rounded-xs border border-border bg-surface-bright p-5 shadow-sm shadow-black/5">
            <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary"><FaArrowsTurnRight /></span>
                <div>
                  <h3 className="text-base font-semibold">Attributes</h3>
                </div>
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary transition hover:bg-surface-container-low ">
                <span className="material-symbols-outlined text-base leading-none font-semibold">+</span>
              </button>
            </div>
            <div className="mt-4">
              <div className="overflow-hidden rounded-lg border border-border bg-surface-container-low">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-high bg-border/20 px-4 border-b border-border">
                      <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-on-surface-variant">Property</th>
                      <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-on-surface-variant">Value</th>
                      <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-on-surface-variant">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productAttributes.map((attr: any) => (
                      <tr key={attr.label} className="border-b border-border last:border-b-0">
                        <td className="py-3 px-4 align-top">
                          <div className="text-sm font-medium">{attr.label}</div>
                        </td>
                        <td className="py-3 px-4 align-top">
                          <div className="text-sm text-on-background">{attr.value}</div>
                        </td>
                        <td className="py-3 px-4 align-top">
                          <div className="flex gap-2">
                            <button type="button" className="inline-flex p-2 items-center justify-center rounded-lg border border-border bg-surface text-primary hover:bg-surface-container-low">
                              <span className="material-symbols-outlined text-sm"><CiEdit /></span>
                            </button>
                            <button type="button" className="inline-flex p-2 items-center justify-center rounded-lg border border-border bg-surface text-error hover:bg-surface-container-low">
                              <span className="material-symbols-outlined text-sm"><MdOutlineDeleteSweep /></span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AllProduct