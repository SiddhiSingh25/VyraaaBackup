import { useEffect, useState } from "react";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { apiUrls } from "../../../../apis";
import type { CategoryApiItem, Option } from "../types";
import usePostQuery from "../../../../hooks/postQuery.hook";

/**
 * Fetches the list of product categories.
 * Mirrors the original inline category fetch, moved into its own hook.
 */
const useCategoryData = () => {
  const [category, setCategory] = useState<CategoryApiItem[]>([]);

  const { getQuery, loading: getCategoryLoading } = useGetQuery();
  const { postQuery, loading: addCategoryLoading } = usePostQuery();

  const getCategory = () => {
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        setCategory(res.data);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching categories");
      },
    });
  };

  const addCategory = (
    category: string,
    onSuccess?: (newCategory: CategoryApiItem) => void,
  ) => {
    postQuery({
      url: apiUrls.Category.add,
      postData: { category },
      onSuccess: (res: any) => {
        const newCategory = res.data;
        setCategory((prevCategories) =>
          Array.isArray(newCategory)
            ? newCategory
            : [...prevCategories, newCategory],
        );
        onSuccess?.(newCategory);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching categories");
      },
    });
  };

  useEffect(() => {
    getCategory();
  }, []);

  const categoryOptions: Option[] = category.map((c) => ({
    label: c.category,
    value: c._id,
  }));

  return { category, categoryOptions, addCategoryLoading, addCategory, getCategoryLoading, refetch: getCategory };
};

export default useCategoryData;
