import React, { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import { useLocation, useNavigate } from "react-router-dom";

import { C } from "./constants";
import type { ActiveChip, FilterState, FilterValue } from "./types";

import Toolbar from "./components/Toolbar";
import FilterList from "./components/FilterList";
import ProductCard from "./components/ProductCard";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import FilterDrawer from "./components/FilterDrawer";
import MobileBottomBar from "./components/MobileBottomBar";
import useGetQuery from "../../../hooks/getQuery.hook";
import { apiUrls } from "../../../apis";

/* ============================================================================
   VYRAAA — Product Listing Page
   State-driven filter architecture. No query/search params — everything
   lives in local React state, seeded once from navigation `state` on mount.
   Refreshing the page clears that state, so it falls back to "all products".
============================================================================ */

interface NavState {
  categoryId?: string;
  subCategoryId?: string;
  fullCategoryData?: any;
  fullSubCategoryData?: any;
  search?: string;
}

export default function ProductFilter() {
  const { getQuery } = useGetQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const navState = (location.state || {}) as NavState;

  // ---- reference data (loaded once, independent of filters) ----
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);

  // ---- single source of truth for every filter ----
  // Seeded ONCE from navigation state at mount. A hard refresh loses
  // location.state, so this correctly falls back to {} (all products).
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const seeded: FilterState = {};
    if (navState.categoryId) seeded.category = navState.categoryId;
    if (navState.subCategoryId) seeded.subCategory = navState.subCategoryId;
    return seeded;
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [productData, setProductData] = useState<any[]>([]);

  const activeCategoryId = filterState.category as string | undefined;
  const activeSubCategoryId = filterState.subCategory as string | undefined;

  // ---------------------------------------------------------------------
  // Reference data — categories & colors, once.
  // ---------------------------------------------------------------------
  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => setCategories(res.data || []),
      onFail: (res: any) => console.error(res),
    });
    getQuery({
      url: apiUrls.ColorFamily.getAll,
      onSuccess: (res: any) => setColors(res.data || []),
      onFail: (res: any) => console.error(res),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------
  // Subcategories — fetch ONLY when the selected category actually changes.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!activeCategoryId) {
      setSubCategories([]);
      return;
    }
    getQuery({
      url: `${apiUrls.SubCategory.getByCategoryId}/${activeCategoryId}`,
      onSuccess: (res: any) => setSubCategories(res.data || []),
      onFail: (res: any) => console.error(res),
    });
  }, [activeCategoryId]);

  // ---------------------------------------------------------------------
  // Products — driven entirely by filterState + page. No URL involved.
  // ---------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
    setProductLoading(true);

    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", "20");

    if (filterState.category) params.append("category", String(filterState.category));
    if (filterState.subCategory) params.append("subCategory", String(filterState.subCategory));
    if (filterState.subcategoryType) params.append("subcategoryType", String(filterState.subcategoryType));
    if (filterState.brand) params.append("brand", String(filterState.brand));
    if (filterState.color) params.append("color", String(filterState.color));
    if (filterState.gender) params.append("gender", String(filterState.gender));
    if (filterState.size) params.append("size", String(filterState.size));
    if (filterState.rating) params.append("rating", String(filterState.rating));
    if (filterState.discount) params.append("discount", String(filterState.discount));
    if (filterState.sort) params.append("sort", String(filterState.sort));
    if (filterState.search) params.append("search", String(filterState.search));

    const priceVal = filterState.price as [number, number] | undefined;
    if (priceVal && Array.isArray(priceVal)) {
      params.append("minPrice", String(priceVal[0]));
      params.append("maxPrice", String(priceVal[1]));
    }

    const finalUrl = `${apiUrls.Product.home}?${params.toString()}`;

    getQuery({
      url: finalUrl,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
        
          setProductData(res.data);
          setTotalPages(res.pagination?.totalPages || 1);
          setPage(res.pagination?.currentPage || 1);
        }
        setProductLoading(false);
      },
      onFail: (res: any) => {
        console.log(res);
        setProductLoading(false);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterState.category,
    filterState.subCategory,
    filterState.subcategoryType,
    filterState.brand,
    filterState.color,
    filterState.gender,
    filterState.size,
    filterState.rating,
    filterState.discount,
    filterState.sort,
    filterState.search,
    JSON.stringify(filterState.price),
    page,
  ]);


  useEffect(() => {
  if (navState.search === undefined) return;
  setFilterState((prev) => ({ ...prev, search: navState.search }));
  setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [navState.search]);

  // ---------------------------------------------------------------------
  // Single handler for every filter change. Toolbar / FilterList /
  // ActiveChips all read from this same `filterState` — they can't drift.
  // ---------------------------------------------------------------------
  const handleFilterChange = useCallback((id: string, value: FilterValue) => {
    setFilterState((prev) => {
      const next = { ...prev };
      if (value === null || value === undefined || value === "") {
        delete next[id];
      } else {
        next[id] = value;
      }
      // Changing category invalidates whatever subCategory was selected.
      if (id === "category") {
        delete next.subCategory;
        delete next.subcategoryType;
      }
      return next;
    });
    setPage(1);

    if (id === "search" && (value === null || value === undefined || value === "")) {
      navigate(location.pathname, { replace: true, state: { ...location.state, search: undefined } });
    }
  }, [location.pathname, location.state, navigate]);

  const clearAll = useCallback(() => {
    setFilterState({});
    setPage(1);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, navigate]);

  // ---------------------------------------------------------------------
  // Active chips — derived purely from filterState + reference lists.
  // ---------------------------------------------------------------------
  const activeChips = useMemo((): ActiveChip[] => {
    const chips: ActiveChip[] = [];

    const getOptionLabel = (options: any[], val: string, field: string, fallback?: any) => {
      const match = options.find((o) => o._id === val);
      if (match) return match[field] || val;
      // Reference list may not have loaded yet — fall back to the data
      // handed to us via navigation state so the chip still reads correctly.
      if (fallback?._id === val) return fallback[field] || val;
      return null;
    };

    Object.entries(filterState).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (key === "sort") return;

      if (key === "price") {
        const range = value as [number, number];
        if (range[0] > 0 || range[1] < 10000) {
          chips.push({
            key: `price-${range[0]}-${range[1]}`,
            label: `₹${range[0]} - ₹${range[1]}`,
            sectionId: "price",
            remove: null,
          });
        }
        return;
      }

      let label = String(value);
      if (key === "category") {
        label = getOptionLabel(categories, String(value), "category", navState.fullCategoryData) || String(value);
      } else if (key === "subCategory") {
        label = getOptionLabel(subCategories, String(value), "subCategory", navState.fullSubCategoryData) || String(value);
      } else if (key === "color") {
        label = getOptionLabel(colors, String(value), "colorFamily") || String(value);
      } else if (key === "rating") {
        label = `${value} Stars & above`;
      } else if (key === "discount") {
        label = `${value}% & above`;
      } else if (key === "size") {
        label = `Size: ${value}`;
      } else if (key === "brand") {
        label = `Brand: ${value}`;
      } else if (key === "gender") {
        label = `Gender: ${value}`;
      } else if (key === "search") {
        label = `Search: "${value}"`;
      }

      chips.push({ key: `${key}-${value}`, label, sectionId: key, remove: String(value) });
    });

    return chips;
  }, [filterState, categories, subCategories, colors, navState.fullCategoryData, navState.fullSubCategoryData]);

  const removeChip = useCallback((chip: ActiveChip) => {
    handleFilterChange(chip.sectionId, null);
  }, [handleFilterChange]);

  return (
    <div className="min-h-screen w-full pb-20 lg:pb-0" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        input[type="range"] { -webkit-appearance: none; height: 3px; border-radius: 999px; background: ${C.border}; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${C.primary}; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: pointer; }
        ::selection { background: ${C.primaryLight}; color: #fff; }
      `}</style>

      <Navbar />

      <Toolbar
        activeCount={activeChips.length}
        onClearAll={clearAll}
        onOpenFilter={() => setFilterDrawerOpen(true)}
        count={productData.length}
        activeChips={activeChips}
        onRemoveChip={removeChip}
      />

      <div className="px-4 md:px-8 flex gap-8 py-3 md:py-5">
        <aside
          className="hidden lg:block w-[268px] shrink-0 sticky self-start"
          style={{ top: "80px", maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}
        >
          <FilterList
            filterState={filterState}
            onChange={handleFilterChange}
            categoryId={activeCategoryId}
            categories={categories}
            subCategories={subCategories}
            colors={colors}
          />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5">
            {productLoading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productData.length ? (
              productData.map((p: any) => <ProductCard key={p?.id} product={p} />)
            ) : (
              <EmptyState onClear={clearAll} />
            )}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </main>
      </div>
      <Footer />

      <MobileBottomBar onFilter={() => setFilterDrawerOpen(true)} />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterState={filterState}
        onChange={handleFilterChange}
        onClearAll={clearAll}
        resultCount={productData.length}
        categoryId={activeCategoryId}
        categories={categories}
        subCategories={subCategories}
        colors={colors}
      />
    </div>
  );
}