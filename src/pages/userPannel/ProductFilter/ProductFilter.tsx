import React, { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import SuggestedProduct from "../Product/component/SuggestedProduct";
import { useLocation, useParams } from "react-router-dom";

import { C, FILTERS, PRODUCTS } from "./constants";
import { pct } from "./utils";
import type { ActiveChip, FilterState, FilterValue } from "./types";

import Toolbar from "./components/Toolbar";
import FilterList from "./components/FilterList";
import ProductCard from "./components/ProductCard";
import SkeletonCard from "./components/SkeletonCard";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import SortSheet from "./components/SortSheet";
import FilterDrawer from "./components/FilterDrawer";
import MobileBottomBar from "./components/MobileBottomBar";
import useGetQuery from "../../../hooks/getQuery.hook";
import { apiUrls } from "../../../apis";

/* ============================================================================
   VYRAAA — Product Listing Page
   Production-ready, API-ready, fully data-driven filter architecture.
============================================================================ */

export default function ProductFilter() {
  const { getQuery } = useGetQuery();
  const [filterState, setFilterState] = useState<FilterState>({});
  const [sort, setSort] = useState("recommended");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  // const [wished, setWished] = useState<Record<string, boolean>>({});
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState();
  const [productData, setProductData] = useState([])

  // const { category } = useParams();
  const location = useLocation();
  const categoryId = location.state?.categoryId;

  useEffect(() => {
    window.scrollTo(0, 0)
    const params = new URLSearchParams();

    if (page) params.append("page", String(page));
    params.append("limit", "16");
    if (gender) params.append("gender", gender);
    if (categoryId) params.append("category", categoryId);

    const queryString = params.toString();
    const finalUrl = queryString
      ? `${apiUrls.Product.home}?${queryString}`
      : apiUrls.Product.home;

    getQuery({
      url: finalUrl,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {

          const formattedProducts = res.data.map((item: any) => {
            // 1. Safely extract the first available price object
            const basePrice = item.price && item.price.length > 0 ? item.price[0] : null;

            // 2. Generate badges dynamically based on API flags
            const badges: string[] = [];
            if (basePrice?.isFewLeft) {
              badges.push("Only Few Left");
            }
            if (!basePrice?.isAvailable) { // Example condition for "Premium"
              badges.push("Not Available");
            }

            // 3. Return strictly typed object for ProductCard
            return {
              id: item._id,
              name: item.title,
              img: item.image,
              img2: item.image, // Fallback to same image since API doesn't provide img2
              brand: item.brand?.brand || "Vyraa", // Safe check, fallback if missing
              price: basePrice ? basePrice.amount : 0, // Must be a number for money()
              mrp: basePrice ? basePrice.markupPrice : 0, // Must be a number for pct()
              rating: 4.5, // Fallback: Not in API
              reviews: 120, // Fallback: Not in API
              badges: badges,
              size: basePrice ? basePrice.size._id : null,
              sizeName: basePrice ? basePrice.size.size : null
            };
          });
          setProductData(formattedProducts)
          setTotalPages(res.pagination.totalPages)
          setPage(res.pagination.currentPage)
          // console.log("Formatted for Card:", formattedProducts);
          // setProducts(formattedProducts);
        }
      },
      onFail: (res: any) => {
        console.log(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, gender, location]);

  const handleFilterChange = useCallback((id: string, value: FilterValue) => {
    setLoading(true);
    setFilterState((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => setLoading(false), 350);
  }, []);

  const clearAll = () => {
    setFilterState({});
    setActiveChip(null);
  };

  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];
    FILTERS.forEach((s) => {
      const v = filterState[s.id];
      if (!v) return;
      if (s.type === "radio" && typeof v === "string") {
        const opt = s.options?.find((o) => o.id === v);
        if (opt) {
          chips.push({
            key: `${s.id}:${v}`,
            label: opt.label,
            sectionId: s.id,
            remove: null,
          });
        }
      } else if (Array.isArray(v)) {
        if (s.type === "range") return; // shown separately if needed
        (v as string[]).forEach((id) => {
          const opt = s.options?.find((o) => o.id === id);
          if (opt) {
            chips.push({
              key: `${s.id}:${id}`,
              label: opt.label,
              sectionId: s.id,
              remove: id,
            });
          }
        });
      }
    });
    return chips;
  }, [filterState]);

  const removeChip = (chip: ActiveChip) => {
    if (chip.remove === null) {
      setFilterState((prev) => {
        const n = { ...prev };
        delete n[chip.sectionId];
        return n;
      });
    } else {
      setFilterState((prev) => ({
        ...prev,
        [chip.sectionId]: (prev[chip.sectionId] as string[]).filter(
          (v) => v !== chip.remove,
        ),
      }));
    }
  };

  const activeCount = activeChips.length;

  // Demo filtering: only category-radio and brand actually filter the small mock set,
  // everything else is fully wired for real API integration.
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    const brandSel = filterState.brand as string[] | undefined;
    if (brandSel && brandSel.length) {
      list = list.filter(
        (p) =>
          brandSel.includes(p.brand.toLowerCase().replace(/\s+/g, "-")) ||
          brandSel.some((b) => p.brand.toLowerCase().includes(b.split("-")[0])),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      list.sort((a, b) => pct(b.price, b.mrp) - pct(a.price, a.mrp));
    return list;
  }, [filterState, sort]);

  return (
    <div
      className="min-h-screen w-full pb-20 lg:pb-0"
      style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        input[type="range"] { -webkit-appearance: none; height: 3px; border-radius: 999px; background: ${C.border}; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${C.primary}; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2); cursor: pointer; }
        ::selection { background: ${C.primaryLight}; color: #fff; }
      `}</style>

      <Navbar />

      <Toolbar
        sort={sort}
        setSort={setSort}
        activeCount={activeCount}
        onClearAll={clearAll}
        onOpenSort={() => setSortSheetOpen(true)}
        onOpenFilter={() => setFilterDrawerOpen(true)}
        count={filtered.length}
        activeChips={activeChips}
        onRemoveChip={removeChip}
      />

      <div className=" px-4 md:px-8 flex gap-8 py-3 md:py-5">
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:block w-[268px] shrink-0 sticky self-start"
          style={{
            top: "80px",
            maxHeight: "calc(100vh - 160px)",
            overflowY: "auto",
          }}
        >
          <div className="flex items-center justify-between pb-2">
            <span
              className="text-[13px] font-semibold uppercase tracking-wide"
              style={{ color: C.heading }}
            >
              Filters
            </span>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-[12px] underline"
                style={{ color: C.rose }}
              >
                Clear all
              </button>
            )}
          </div>
          <FilterList filterState={filterState} onChange={handleFilterChange} />
        </aside>

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : productData.length ? (
              productData.map((p: any) => (
                <ProductCard
                  key={p?.id}
                  product={p}
                // wished={!!wished[p.id]}
                // onToggleWish={(id) =>
                //   setWished((w) => ({ ...w, [id]: !w[id] }))
                // }
                />
              ))
            ) : (
              <EmptyState onClear={clearAll} />
            )}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </main>
      </div>

      <SuggestedProduct />
      <Footer />

      <MobileBottomBar
        onSort={() => setSortSheetOpen(true)}
        onFilter={() => setFilterDrawerOpen(true)}
        activeCount={activeCount}
      />
      <SortSheet
        open={sortSheetOpen}
        onClose={() => setSortSheetOpen(false)}
        sort={sort}
        setSort={setSort}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterState={filterState}
        onChange={handleFilterChange}
        onClearAll={clearAll}
        resultCount={filtered.length}
      />
    </div>
  );
}
