import { useEffect, useState } from "react";
import ProductCard from "../../Product/component/ProductCard";
import { apiUrls } from "../../../../apis";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { useNavigate } from "react-router-dom";

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

  // Fetch Categories on Mount
  useEffect(() => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        setCategories(res.data);
      },
      onFail: (res: any) => {
        console.log(res);
      },
    });
  }, [getQuery]);

  // Fetch Products whenever filters change
  useEffect(() => {
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
          const formattedProducts = res.data.map((item: any) => {
            return {
              id: item._id,
              name: item.title,
              img: item.image,
              price: item.price && item.price.length > 0
                ? item.price[0].amount
                : "N/A"
            };
          });
          setProducts(formattedProducts);
        }
      },
      onFail: (res: any) => {
        console.log(res);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, limit, gender, selectedCategory]);

  const handleGender = (g: Gender) => {
    setGender(g);
  };

  return (
    <section className="bg-surface/50 py-10">
      <div className="px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto">

        {/* Sub-category pills */}
        <div className="flex gap-4 overflow-x-auto pb-1 mb-10 justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories?.map((cat) => (
            <button
              key={cat?._id}
              onClick={() => {
                // Keep your local state update if needed for UI before route transition
                // setSelectedCategory(cat?._id);

                // 3. Redirect to /:category and pass data 
                // We convert category name to lowercase/slug for a cleaner URL
                const routeParam = cat?.category?.toLowerCase().replace(/\s+/g, '-');

                navigate(`/${routeParam}`, {
                  state: {
                    categoryId: cat?._id,
                    fullCategoryData: cat
                  }
                });
              }}
              className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0"
            >
              <div
                className={`w-[52px] h-[52px] sm:w-[40px] sm:h-[40px] lg:w-[90px] lg:h-[90px] rounded-full flex items-center justify-center overflow-hidden border-1 transition-all duration-200 bg-card
              ${cat?._id === selectedCategory ? "border-primary" : "border-transparent"}`}
              >
                <img
                  src={cat?.image}
                  alt={cat?.category}
                  className="w-[95%] h-[95%] object-contain"
                  style={{ objectPosition: "top" }}
                />
              </div>
              <span
                className={`text-[10px] font-medium tracking-wider uppercase
              ${cat?._id === selectedCategory
                    ? "text-admin-text border-b-[1px] pb-1 px-2 border-body "
                    : "text-admin-text/70"
                  }`}
              >
                {cat?.category}
              </span>
            </button>
          ))}
        </div>


        {/* Gender tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-card rounded-full p-1 gap-0.5 border border-heading/10">
            <button
              key={"ALL"}
              onClick={() => handleGender("")}
              className={`text-[11px] font-medium tracking-[0.18em] uppercase px-5 py-2 rounded-full transition-all duration-200 flex items-center justify-center
                  ${"" === gender
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
                  ${g === gender
                    ? "bg-dark text-gray-50 shadow-sm font-bold"
                    : "text-admin-text/90 hover:text-admin-text font-semibold"
                  }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}

          {products.length === 0 && (
            <p className="col-span-full text-center text-muted text-sm py-10">
              No products found for these filters.
            </p>
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-block border border-heading/30 text-admin-text px-8 sm:px-10 py-3 sm:py-3.5 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-heading hover:text-white transition-all duration-400"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}