import React, { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import SuggestedProduct from "../Product/component/SuggestedProduct";
import { useLocation, useParams } from "react-router-dom";

import { C } from "./constants";
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
  const [activeChip, setActiveChip] = useState<string | null>(null);
  // const [wished, setWished] = useState<Record<string, boolean>>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState();
  const [productData, setProductData] = useState([]);
  // const [categoryId, setCategoryId] = useState();
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  // const { category } = useParams();
  const location = useLocation();

  let categoryId = location?.state?.categoryId;

  // useEffect(() => {
  //   setCategoryId(location.state?.categoryId);
  // }, [location]);

  const getCategory = () => {
    getQuery({
      url: `${apiUrls.Category.getAll}`,
      onSuccess: (res: any) => {
        setCategories(res.data || []);
      },
      onFail: (res: any) => {
        console.error(res);
      },
    });
  };

  const getColor = () => {
    getQuery({
      url: `${apiUrls.ColorFamily.getAll}`,
      onSuccess: (res: any) => {
        setColors(res.data || []);
      },
      onFail: (res: any) => {
        console.error(res);
      },
    });
  };

  useEffect(() => {
    getCategory();
    getColor();
  }, []);

  useEffect(() => {
    getQuery({
      url: `${apiUrls.SubCategory.getByCategoryId}/${categoryId}`,
      onSuccess: (res: any) => {
        setSubCategories(res.data || []);
      },
      onFail: (res: any) => {
        console.error(res);
      },
    });
  }, [categoryId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams();
    const urlParams = new URLSearchParams(location.search);

    if (page) params.append("page", String(page));
    params.append("limit", "20");

    // 1. search
    const searchVal = urlParams.get("search");
    if (searchVal) params.append("search", searchVal);

    // 2. category
    const categoryVal =
      filterState["category"] || categoryId || urlParams.get("category");
    if (categoryVal) {
      if (Array.isArray(categoryVal) && categoryVal.length > 0) {
        params.append("category", categoryVal.join(","));
      } else if (typeof categoryVal === "string") {
        params.append("category", categoryVal);
      }
    }

    // 3. subCategory
    const subCategoryVal =
      filterState["subCategory"] || urlParams.get("subCategory");
    if (subCategoryVal) {
      if (Array.isArray(subCategoryVal) && subCategoryVal.length > 0) {
        params.append("subCategory", subCategoryVal.join(","));
      } else if (typeof subCategoryVal === "string") {
        params.append("subCategory", subCategoryVal);
      }
    }

    // 4. subcategoryType
    const subcategoryTypeVal = urlParams.get("subcategoryType");
    if (subcategoryTypeVal)
      params.append("subcategoryType", subcategoryTypeVal);

    // 5. brand
    const brandVal = urlParams.get("brand");
    if (brandVal) params.append("brand", brandVal);

    // 6. color
    const colorVal = filterState["color"] || urlParams.get("color");
    if (colorVal) {
      if (Array.isArray(colorVal) && colorVal.length > 0) {
        params.append("color", colorVal.join(","));
      } else if (typeof colorVal === "string") {
        params.append("color", colorVal);
      }
    }

    // 9. minPrice & maxPrice
    const priceVal = filterState["price"];
    if (priceVal && Array.isArray(priceVal)) {
      params.append("minPrice", String(priceVal[0]));
      params.append("maxPrice", String(priceVal[1]));
    } else {
      const minPriceVal = urlParams.get("minPrice");
      if (minPriceVal) params.append("minPrice", minPriceVal);
      const maxPriceVal = urlParams.get("maxPrice");
      if (maxPriceVal) params.append("maxPrice", maxPriceVal);
    }

    // 10. rating
    const ratingVal = filterState["rating"] || urlParams.get("rating");
    if (ratingVal) {
      params.append("rating", String(ratingVal));
    }

    // 11. discount
    const discountVal = filterState["discount"] || urlParams.get("discount");
    if (discountVal) {
      if (Array.isArray(discountVal) && discountVal.length > 0) {
        const minDisc = Math.min(...discountVal.map(Number));
        params.append("discount", String(minDisc));
      } else if (typeof discountVal === "string") {
        params.append("discount", discountVal);
      }
    }

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
            const basePrice =
              item.price && item.price.length > 0 ? item.price[0] : null;

            // 2. Generate badges dynamically based on API flags
            const badges: string[] = [];
            if (basePrice?.isFewLeft) {
              badges.push("Only Few Left");
            }
            if (!basePrice?.isAvailable) {
              // Example condition for "Premium"
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
              rating: item.averageRating || item.rating || 4.5,
              reviews: 120, // Fallback: Not in API
              badges: badges,
              size: basePrice ? basePrice.size._id : null,
              sizeName: basePrice ? basePrice.size.size : null,
            };
          });
          setProductData(formattedProducts);
          setTotalPages(res.pagination.totalPages);
          setPage(res.pagination.currentPage);
        }
      },
      onFail: (res: any) => {
        console.log(res);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, page, categoryId, location.search]);

  const handleFilterChange = useCallback((id: string, value: FilterValue) => {
    setLoading(true);
    setFilterState((prev) => ({ ...prev, [id]: value }));
    setTimeout(() => setLoading(false), 350);
  }, []);

  const clearAll = () => {
    setFilterState({});
    setActiveChip(null);
  };

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

      {/* <Toolbar
        activeCount={8}
        onClearAll={clearAll}
        onOpenFilter={() => setFilterDrawerOpen(true)}
        count={productData.length}
        activeChips={activeChips}
        onRemoveChip={removeChip}
      /> */}

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
          {/* <div className="flex items-center justify-between pb-2">
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
          </div> */}
          <FilterList
            filterState={filterState}
            onChange={handleFilterChange}
            categoryId={categoryId}
            categories={categories}
            subCategories={subCategories}
            colors={colors}
          />
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
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </main>
      </div>

      <SuggestedProduct />
      <Footer />

      <MobileBottomBar
        onFilter={() => setFilterDrawerOpen(true)}
        // activeCount={activeCount}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filterState={filterState}
        onChange={handleFilterChange}
        onClearAll={clearAll}
        resultCount={productData.length}
        categoryId={categoryId}
        categories={categories}
        subCategories={subCategories}
        colors={colors}
      />
    </div>
  );
}
