import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Header/Navbar";
import SuggestedProduct from "../Product/component/SuggestedProduct";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

import { C } from "./constants";
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

const toSlug = (text: string) => {
  return text ? text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") : "";
};

/* ============================================================================
   VYRAAA — Product Listing Page
   Production-ready, API-ready, fully data-driven filter architecture.
============================================================================ */

const getInitialFilterState = (params: URLSearchParams): FilterState => {
  const state: FilterState = {};

  const checkAndSetSingle = (key: string) => {
    const val = params.get(key);
    if (val) state[key] = val;
  };

  const checkAndSetNumberArray = (key: string, param1: string, param2: string) => {
    const p1 = params.get(param1);
    const p2 = params.get(param2);
    if (p1 && p2) {
      state[key] = [Number(p1), Number(p2)];
    }
  };

  checkAndSetSingle("category");
  checkAndSetSingle("subCategory");
  checkAndSetSingle("subcategoryType");
  checkAndSetSingle("brand");
  checkAndSetSingle("color");
  checkAndSetSingle("gender");
  checkAndSetSingle("size");
  checkAndSetSingle("rating");
  checkAndSetSingle("discount");
  checkAndSetSingle("sort");

  checkAndSetNumberArray("price", "minPrice", "maxPrice");

  return state;
};

export default function ProductFilter() {
  const { getQuery } = useGetQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const categoryId = location?.state?.categoryId;
  const subCategoryId = location?.state?.subCategoryId;

  const filterState = useMemo(() =>
    getInitialFilterState(searchParams),
    [searchParams]
  );

  const [activeChip, setActiveChip] = useState<string | null>(null);
  const isInitialSyncDone = useRef(false);
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

  // Synchronize initial categoryId and subCategoryId from location state into URL search params
  useEffect(() => {
    if (isInitialSyncDone.current) return;

    let initialCategory = location?.state?.categoryId
    let initialSubCategory = location?.state?.subCategoryId;
    let hasChanged = false;

    if (initialCategory || initialSubCategory) {
      isInitialSyncDone.current = true;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (initialCategory && !next.get("category")) {
          next.set("category", initialCategory);
          hasChanged = true;
        }
        if (initialSubCategory && !next.get("subCategory")) {
          next.set("subCategory", initialSubCategory);
          hasChanged = true;
        }
        return hasChanged ? next : prev;
      }, { replace: true, state: location.state });
    }
  }, [location?.state, setSearchParams]);

  const handleFilterChange = useCallback((id: string, value: FilterValue) => {
    setLoading(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value === null || value === undefined) {
        next.delete(id);
      } else if (id === "price" && Array.isArray(value)) {
        next.set("minPrice", String(value[0]));
        next.set("maxPrice", String(value[1]));
      } else {
        next.set(id, String(value));
      }
      return next;
    }, { replace: true, state: location.state });
    setPage(1);
    setTimeout(() => setLoading(false), 350);
  }, [setSearchParams, location.state]);

  const clearAll = () => {
    setSearchParams(new URLSearchParams(), { replace: true, state: location.state });
    setActiveChip(null);
    setPage(1);
  };

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

  const resolvedCategoryId = useMemo(() => {
    const param = filterState["category"] || categoryId;
    if (!param) return undefined;
    if (/^[0-9a-fA-F]{24}$/.test(param)) return param;
    const match = categories.find((c) => toSlug(c.category) === param || c._id === param);
    return match?._id;
  }, [filterState, categoryId, categories]);

  const resolvedSubCategoryId = useMemo(() => {
    const param = filterState["subCategory"] || subCategoryId;
    if (!param) return undefined;
    if (/^[0-9a-fA-F]{24}$/.test(param)) return param;
    const match = subCategories.find((sc) => toSlug(sc.subCategory) === param || sc._id === param);
    return match?._id;
  }, [filterState, subCategoryId, subCategories]);

  const activeCategoryId = resolvedCategoryId;

  useEffect(() => {
    if (!activeCategoryId) {
      setSubCategories([]);
      return;
    }
    setSubCategories([])
    getQuery({
      url: `${apiUrls.SubCategory.getByCategoryId}/${activeCategoryId}`,
      onSuccess: (res: any) => {
        setSubCategories(res.data || []);
      },
      onFail: (res: any) => {
        console.error(res);
      },
    });
  }, [activeCategoryId]);

  const prevActiveCategoryIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      prevActiveCategoryIdRef.current &&
      activeCategoryId &&
      prevActiveCategoryIdRef.current !== activeCategoryId
    ) {
      handleFilterChange("subCategory", null);
      handleFilterChange("subcategoryType", null);
    }
    if (activeCategoryId) {
      prevActiveCategoryIdRef.current = activeCategoryId;
    }
  }, [activeCategoryId, handleFilterChange]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const isSyncPending = !isInitialSyncDone.current && (
      location?.state?.categoryId ||
      location?.state?.subCategoryId ||
      location?.state?.fullCategoryData?.category ||
      location?.state?.fullSubCategoryData?.subCategory
    );

    const categoryParam = filterState["category"] || categoryId;
    const isCategorySlug = categoryParam && !/^[0-9a-fA-F]{24}$/.test(categoryParam);
    const isCategoryUnresolved = isCategorySlug && !resolvedCategoryId;

    const subCategoryParam = filterState["subCategory"] || subCategoryId;
    const isSubCategorySlug = subCategoryParam && !/^[0-9a-fA-F]{24}$/.test(subCategoryParam);
    const isSubCategoryUnresolved = isSubCategorySlug && !resolvedSubCategoryId;

    if (isCategoryUnresolved || isSubCategoryUnresolved || isSyncPending) {
      console.log("DEBUG: Product list fetch skipped", {
        isCategoryUnresolved,
        isSubCategoryUnresolved,
        isSyncPending,
      });
      return;
    }

    const params = new URLSearchParams();
    const urlParams = new URLSearchParams(location.search);

    console.log("DEBUG: Product list fetch trigger", {
      resolvedCategoryId,
      resolvedSubCategoryId,
      filterState,
    });

    if (page) params.append("page", String(page));
    params.append("limit", "20");

    // 1. search
    const searchVal = urlParams.get("search");
    if (searchVal) params.append("search", searchVal);

    // 2. category
    if (resolvedCategoryId) {
      params.append("category", resolvedCategoryId);
    }

    // 3. subCategory
    if (resolvedSubCategoryId) {
      params.append("subCategory", resolvedSubCategoryId);
    }

    // 4. subcategoryType
    const subcategoryTypeVal =
      filterState["subcategoryType"] || urlParams.get("subcategoryType");
    if (subcategoryTypeVal) {
      if (Array.isArray(subcategoryTypeVal) && subcategoryTypeVal.length > 0) {
        params.append("subcategoryType", subcategoryTypeVal.join(","));
      } else if (typeof subcategoryTypeVal === "string") {
        params.append("subcategoryType", subcategoryTypeVal);
      }
    }

    // 5. brand
    const brandVal = filterState["brand"] || urlParams.get("brand");
    if (brandVal) {
      if (Array.isArray(brandVal) && brandVal.length > 0) {
        params.append("brand", brandVal.join(","));
      } else if (typeof brandVal === "string") {
        params.append("brand", brandVal);
      }
    }

    // 6. color
    const colorVal = filterState["color"] || urlParams.get("color");
    if (colorVal) {
      if (Array.isArray(colorVal) && colorVal.length > 0) {
        params.append("color", colorVal.join(","));
      } else if (typeof colorVal === "string") {
        params.append("color", colorVal);
      }
    }

    // 7. gender
    const genderVal = filterState["gender"] || urlParams.get("gender");
    if (genderVal) {
      if (Array.isArray(genderVal) && genderVal.length > 0) {
        params.append("gender", genderVal.join(","));
      } else if (typeof genderVal === "string") {
        params.append("gender", genderVal);
      }
    }

    // 8. size
    const sizeVal = filterState["size"] || urlParams.get("size");
    if (sizeVal) {
      if (Array.isArray(sizeVal) && sizeVal.length > 0) {
        params.append("size", sizeVal.join(","));
      } else if (typeof sizeVal === "string") {
        params.append("size", sizeVal);
      }
    }

    // 9. minPrice & maxPrice
    const priceVal = filterState["price"];
    if (priceVal && Array.isArray(priceVal) && priceVal.length === 2) {
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

    // 12. sort
    const sortVal = filterState["sort"] || urlParams.get("sort");
    if (sortVal) {
      params.append("sort", String(sortVal));
    }

    const queryString = params.toString();
    const finalUrl = queryString
      ? `${apiUrls.Product.home}?${queryString}`
      : apiUrls.Product.home;

    console.log("FETCH_TRIGGER: calling API with url:", finalUrl);

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
  }, [resolvedCategoryId, resolvedSubCategoryId, page, location.search]);

  const activeChips = useMemo((): ActiveChip[] => {
    const chips: ActiveChip[] = [];

    const getOptionLabel = (options: any[], val: string) => {
      const match = options.find((o) => o._id === val || toSlug(o.category || o.subCategory) === val);
      return match ? (match.category || match.subCategory || match.colorFamily || match.brand || val) : val;
    };

    Object.entries(filterState).forEach(([key, value]) => {
      if (!value) return;

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

      if (key === "sort" || key === "search" || key === "page") return;

      let label = String(value);
      if (key === "category") {
        label = getOptionLabel(categories, String(value));
      } else if (key === "subCategory") {
        label = getOptionLabel(subCategories, String(value));
      } else if (key === "color") {
        label = getOptionLabel(colors, String(value));
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
      }

      chips.push({
        key: `${key}-${value}`,
        label: label,
        sectionId: key,
        remove: String(value),
      });
    });

    return chips;
  }, [filterState, categories, subCategories, colors]);

  const removeChip = useCallback((chip: ActiveChip) => {
    handleFilterChange(chip.sectionId, null);
  }, [handleFilterChange]);

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
        activeCount={activeChips.length}
        onClearAll={clearAll}
        onOpenFilter={() => setFilterDrawerOpen(true)}
        count={productData.length}
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
