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

  const { getQuery, loading : getCategoryLoading } = useGetQuery();
  const { postQuery, loading : addCategoryLoading } = usePostQuery();

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

  const addCategory = (category : any) => {
    postQuery({
      url: apiUrls.Category.add,
      postData  : {category },
      onSuccess: (res: any) => {
        setCategory(res.data);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching categories");
      },
    });
  };

  useEffect(() => {
    getCategory();
  }, []);
console.log(category , "88888888888888888888888888888888");

  const categoryOptions: Option[] = category.map((c) => ({
    label: c.category,
    value: c._id,
  }));

  return { category, categoryOptions, addCategoryLoading, addCategory, getCategoryLoading, refetch: getCategory };
};

export default useCategoryData;
