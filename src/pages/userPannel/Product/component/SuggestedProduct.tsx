import useGetQuery from "@/hooks/getQuery.hook";
import { jacket, shirts } from "../../../../assets/assets";
import OutlinedButton from "../../../../components/Common/Button/OutlinedButton";
import Heading from "../../../../components/Common/Heading";
import ProductCard from "./ProductCard";
import { apiUrls } from "@/apis";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

interface SuggestedProductProps {
  category?: string;
  categoryId?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  currentProductId?: string;
  limit?: number;
}

export default function SuggestedProduct({
  categoryId: propCategoryId,
  subCategoryId: propSubCategoryId,
  subCategoryName: propSubCategoryName,
  currentProductId,
  limit = 8,
}: SuggestedProductProps) {
  const location = useLocation();

  const categoryId = propCategoryId || location.state?.categoryId;
  const subCategoryId = propSubCategoryId || location.state?.subCategoryId;
  const subCategoryName = propSubCategoryName || location.state?.subCategoryName;

  const text = `More ${subCategoryName || ""}`;

  const { getQuery } = useGetQuery();

  const [productLoading, setProductLoading] = useState(true); // initial load
  const [loadingMore, setLoadingMore] = useState(false); // "load more" click
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [productData, setProductData] = useState<any[]>([]);

  const fetchProducts = (pageToFetch: number, append: boolean) => {
    if (!categoryId || !subCategoryId) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setProductLoading(true);
    }

    getQuery({
      url: `${apiUrls.Product.home}?page=${pageToFetch}&limit=${limit}&category=${categoryId}&subCategory=${subCategoryId}`,
      onSuccess: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          // Filter out the current product from suggestions
          const filtered = currentProductId
            ? res.data.filter((p: any) => p._id !== currentProductId)
            : res.data;
          setProductData((prev) =>
            append ? [...prev, ...filtered] : filtered
          );
          setTotalPages(res.pagination?.totalPages || 1);
          setPage(res.pagination?.currentPage || pageToFetch);
        }
        setProductLoading(false);
        setLoadingMore(false);
      },
      onFail: (res: any) => {
        console.log(res);
        setProductLoading(false);
        setLoadingMore(false);
      },
    });
  };

  useEffect(() => {
    if (categoryId && subCategoryId && currentProductId) {
      fetchProducts(1, false);
    } else {
      setProductData([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, subCategoryId, limit, currentProductId]);



  const handleLoadMore = () => {
    if (page >= totalPages || loadingMore) return;
    fetchProducts(page + 1, true);
  };

  const hasMore = page < totalPages;

  return (
    <section className="bg-surface py-16">
      <div className="px-5 sm:px-10 lg:px-20 ">
        <Heading
          value={{
            text: "Similar Products",
            position: "start",
          }}
        />

        {/* Products grid */}
        <div className=" mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {productLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : productData.length ? (
            productData.map((p: any) => <ProductCard key={p?._id} product={p} />)
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="w-14 h-14 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                No Products Available
              </h3>
              <p className="mt-2 text-gray-500">
                There are no products to display at the moment.
              </p>
            </div>
          )}



        </div>

        {hasMore && (
          <div className="flex items-center justify-center gap-5">
            <OutlinedButton
              text={loadingMore ? "Loading..." : text}
              onClick={handleLoadMore}
              disabled={loadingMore}
            />
          </div>
        )}
      </div>
    </section>
  );
}
