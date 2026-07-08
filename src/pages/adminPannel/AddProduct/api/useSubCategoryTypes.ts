import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { TaxonomyApiItem, Option } from "../types";
import usePostQuery from "../../../../hooks/postQuery.hook";
import useGetQuery from "../../../../hooks/getQuery.hook";

/**
 * Fetches subcategories (and their types) that belong to a given category.
 * Re-fetches whenever `categoryId` changes; skips the call when empty.
 */
const useSubCategoryTypeData = (subCategoryId: string) => {
  const [subcategoryType, setSubcategoryType] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getSubCategoryType = () => {
    if (!subCategoryId) {
      setSubcategoryType([]);
      return;
    }
    setIsLoading(true);
    getQuery({
      url: `${apiUrls.SubCategoryType.getBySubCategoryId}/${subCategoryId}`,
      onSuccess: (res: any) => {
        setSubcategoryType(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching subcategories");
        setIsLoading(false);
      },
    });
  };



  useEffect(() => {
    getSubCategoryType();
  }, [subCategoryId]);

  const subcategoryTypeOptions: Option[] = subcategoryType.map((t) => ({
    label: t.type,
    value: t._id,
  }));

  return { subcategoryType,  subcategoryTypeOptions,  isLoading };
};

export default useSubCategoryTypeData;
