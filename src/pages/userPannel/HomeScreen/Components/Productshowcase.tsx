import { useEffect, useState } from "react";
import ProductCard from "../../Product/component/ProductCard";
import { apiUrls } from "../../../../apis";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "@/components/Common/Headers/SectionHeader";
import SkeletonCard from "../../Product/component/SkeletonCard";

const GENDERS = ["Men", "Women", "Unisex", "Child"] as const;
type Gender = (typeof GENDERS)[number] | "";

// 1. Optional but recommended: Define a quick interface for your category
interface Category {
  _id: string;
  category: string;
  image: string;
}

export default function ProductShowcase() {
  const navigate = useNavigate();
  const { getQuery } = useGetQuery();
  const [gender, setGender] = useState<Gender>("");

  // 2. FIX: Tell TypeScript this is an array of Categories (or any[]) instead of never[]
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [pageNum, setPageNum] = useState<string>("");
  const [limit, setLimit] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [productLoading, setProductLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  function CategorySkeletonItem() {
    return (
      <div className="flex flex-col items-center gap-3 flex-shrink-0 snap-center">
        {/* Image Container Skeleton */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl animate-pulse bg-card border border-border/50 shadow-sm" />

        {/* Text Label Skeleton */}
        <div className="flex flex-col items-center gap-1.5">
          {/* Simulates the uppercase text */}
          <div className="h-2.5 w-12 sm:w-16 rounded animate-pulse bg-card" />

          {/* Simulates the active indicator pill */}
          <div className="h-[3px] w-4 rounded-full animate-pulse bg-card/50" />
        </div>
      </div>
    );
  }



interface CategoryCardProps {
  cat: Category;
  isActive: boolean;
  onClick: (cat: Category) => void;
}



  function CategoryCard({ cat, isActive, onClick }: CategoryCardProps){
    return(
      <button
                key={cat?._id}
                onClick={() => {
                  const routeParam = cat?.category
                    ?.toLowerCase()
                    .replace(/\s+/g, "-");
                  navigate(`/${routeParam}`, {
                    state: {
                      categoryId: cat?._id,
                      fullCategoryData: cat,
                    },
                  });
                }}
                // 'group' enables synchronized hover effects on children
                className="group flex flex-col items-center gap-3 flex-shrink-0 snap-center focus:outline-none"
              >
                {/* Image Container */}
                <div
                  className={`relative flex items-center justify-center overflow-hidden transition-all duration-300 ease-out
            w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl
            ${
              isActive
                ? "ring-2 ring-primary ring-offset-2 shadow-md"
                : "border border-border/50 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 group-hover:border-primary/50"
            } bg-card`}
                >
                  {/* Subtle dark overlay on hover for a tactile feel */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />

                  <img
                    src={cat?.image}
                    alt={cat?.category}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out
              ${isActive ? "scale-105" : "group-hover:scale-110"}`}
                    style={{ objectPosition: "center" }}
                  />
                </div>

                {/* Text Label */}
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`text-[11px] sm:text-xs font-semibold tracking-widest uppercase transition-colors duration-300
              ${
                isActive
                  ? "text-primary"
                  : "text-admin-text/70 group-hover:text-admin-text"
              }`}
                  >
                    {cat?.category}
                  </span>

                  {/* Premium Active Indicator (replaces the old border-b) */}
                  <div
                    className={`h-[3px] rounded-full transition-all duration-300 ease-out ${
                      isActive ? "w-4 bg-primary" : "w-0 bg-transparent"
                    }`}
                  />
                </div>
              </button>
    )
  }

  // Fetch Categories on Mount
  useEffect(() => {
    setCategoryLoading(true)
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        setCategories(res.data);
        setCategoryLoading(false)
      },
      onFail: (res: any) => {
        console.log(res);
         setCategoryLoading(false)
      },
    });
  }, [getQuery]);

  // Fetch Products whenever filters change
  useEffect(() => {
    setProductLoading(true);
    const params = new URLSearchParams();

    if (pageNum) params.append("page", pageNum);
    if (limit) params.append("limit", limit);
    if (gender) params.append("gender", gender);
    if (selectedCategory) params.append("category", selectedCategory);

    const queryString = params.toString();
    const finalUrl = queryString
      ? `${apiUrls.Product.home}?${queryString}`
      : apiUrls.Product.home;

    getQuery({
      url: finalUrl,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data);
          setProductLoading(false);
        }
      },
      onFail: (res: any) => {
        console.log(res);
        setProductLoading(false);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, limit, gender, selectedCategory]);

  const handleGender = (g: Gender) => {
    setGender(g);
  };

  const handleCategoryClick = (cat: Category) => {
    const routeParam = cat.category?.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${routeParam}`, {
      state: {
        categoryId: cat._id,
        fullCategoryData: cat,
      },
    });
  };

  return (
    <section className="bg-surface/50 py-10">
      <div className="px-5 sm:px-10 lg:px-20 ">
        <h2 className="font-serif text-center mb-8 font-light text-neutral-900 dark:text-neutral-50 text-[clamp(28px,4.5vw,48px)] leading-[1.15] tracking-tight sm:-tracking-[0.02em]">
          Categories
        </h2>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-4 mb-8 justify-start md:justify-center px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeletonItem key={i} />
            ))
          ) : categories?.length ? (
            categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                cat={cat}
                isActive={cat._id === selectedCategory}
                onClick={handleCategoryClick}
              />
            ))
          ) : (
            <p className="text-center w-full text-admin-text/70">No categories found</p>
          )}
        </div>

        {/* Gender tabs */}
        {/* <div className="flex justify-center mb-8">
          <div className="flex bg-card rounded-full p-1 gap-0.5 border border-heading/10">
            <button
              key={"ALL"}
              onClick={() => handleGender("")}
              className={`text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-2 rounded-full transition-all duration-200 flex items-center justify-center
                  ${
                    "" === gender
                      ? "bg-dark text-gray-50 shadow-sm font-bold"
                      : "text-admin-text/90 hover:text-admin-text font-semibold"
                  }`}
            >
              All
            </button>
            {GENDERS.map((g) => (
              <button
                key={g}
                onClick={() => handleGender(g)}
                className={`text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-2 rounded-full transition-all duration-200 flex items-center justify-center
                  ${
                    g === gender
                      ? "bg-dark text-gray-50 shadow-sm font-bold"
                      : "text-admin-text/90 hover:text-admin-text font-semibold"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div> */}

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {productLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length ? (
            products.map((p: any) => <ProductCard key={p?.id} product={p} />)
          ) : (
            <h1>No data</h1>
          )}
       
        </div>

        <div className="text-center mt-10">
          <Link
            to="/all-product"
            className="inline-block border border-heading/30 text-admin-text px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-heading hover:text-white transition-all duration-400"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
