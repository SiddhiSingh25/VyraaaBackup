import React, { useMemo } from "react";
import FilterSection from "./FilterSection";
import type { FilterChangeHandler, FilterState, FilterSectionConfig } from "../types";

const toSlug = (text: string) => {
  return text ? text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : "";
};

export interface FilterListProps {
  filterState: FilterState;
  onChange: FilterChangeHandler;
  categoryId?: string;
  categories?: any[];
  subCategories?: any[];
  colors?: any[];
}

export default function FilterList({
  filterState,
  onChange,
  categoryId,
  categories = [],
  subCategories = [],
  colors = [],
}: FilterListProps) {

  const filterSections = useMemo((): FilterSectionConfig[] => {
    const sections: FilterSectionConfig[] = [];

    // 0. Category (if options exist)
    if (categories && categories.length > 0) {
      sections.push({
        id: "category",
        title: "Category",
        type: "checkbox",
        searchable: categories.length > 6,
        options: categories.map((cat: any) => ({
          id: toSlug(cat.category),
          label: cat.category || "",
          value: toSlug(cat.category),
        })),
      });
    }

    // 1. Subcategory (if we have any options)
    if (subCategories && subCategories.length > 0) {
      sections.push({
        id: "subCategory",
        title: "Subcategory",
        type: "checkbox",
        searchable: subCategories.length > 6,
        options: subCategories.map((sc: any) => ({
          id: toSlug(sc.subCategory),
          label: sc.subCategory || "",
          value: toSlug(sc.subCategory),
        })),
      });
    }

    // 2. Color
    if (colors && colors.length > 0) {
      sections.push({
        id: "color",
        title: "Color",
        type: "color",
        options: colors.map((c: any) => ({
          id: c._id,
          label: c.colorFamily,
          value: c.colorFamily,
        })),
      });
    }

    // 3. Price Range (represented as a slider range config)
    sections.push({
      id: "price",
      title: "Price",
      type: "range",
      min: 0,
      max: 10000,
      step: 100,
      unit: "₹",
      quickValues: [500, 1000, 2000, 5000],
    });

    // 4. Discount
    sections.push({
      id: "discount",
      title: "Discount",
      type: "checkbox",
      options: [
        { id: "10", label: "10% & above", value: "10" },
        { id: "20", label: "20% & above", value: "20" },
        { id: "30", label: "30% & above", value: "30" },
        { id: "40", label: "40% & above", value: "40" },
        { id: "50", label: "50% & above", value: "50" },
        { id: "60", label: "60% & above", value: "60" },
        { id: "70", label: "70% & above", value: "70" },
      ],
    });

    // 5. Rating
    sections.push({
      id: "rating",
      title: "Rating",
      type: "radio",
      options: [
        { id: "4", label: "4 Stars & above", value: "4" },
        { id: "3", label: "3 Stars & above", value: "3" },
        { id: "2", label: "2 Stars & above", value: "2" },
        { id: "1", label: "1 Star & above", value: "1" },
      ],
    });

    return sections;
  }, [categories, subCategories, colors, categoryId]);

  return (
    <div className="px-1 flex flex-col gap-6">
      {filterSections.map((section) => (
        <FilterSection
          key={section.id}
          section={section}
          value={filterState[section.id]}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

