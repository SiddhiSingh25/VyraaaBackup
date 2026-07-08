import { useEffect, useState } from "react";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { apiUrls } from "../../../../apis";
import type { CategoryApiItem, Option } from "../types";

/**
 * Fetches the list of product categories.
 * Mirrors the original inline category fetch, moved into its own hook.
 */
const useCategoryData = () => {
  const [category, setCategory] = useState<CategoryApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getCategory = () => {
    setIsLoading(true);
    getQuery({
      url: apiUrls.Category.getAll,
      onSuccess: (res: any) => {
        setCategory(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching categories");
        setIsLoading(false);
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

  return { category, categoryOptions, isLoading, refetch: getCategory };
};

export default useCategoryData;
