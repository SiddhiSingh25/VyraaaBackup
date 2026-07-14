import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { Option } from "../types";
import usePostQuery from "../../../../hooks/postQuery.hook";
import useGetQuery from "../../../../hooks/getQuery.hook";

/**
 * Fetches subcategory types that belong to a selected subcategory.
 * Re-fetches whenever `subCategoryId` changes; skips the call when empty.
 */
const useSubCategoryTypeData = (subCategoryId: string) => {
  const [subcategoryType, setSubcategoryType] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addSubCategoryTypeLoading } = usePostQuery();

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
        console.log(err, "Error fetching subcategory types");
        setIsLoading(false);
      },
    });
  };

  const addSubCategoryType = (
    typeName: string,
    onSuccess?: (newType: any) => void,
  ) => {
    if (!subCategoryId || !typeName?.trim()) return;

    postQuery({
      url: apiUrls.SubCategoryType.add,
      postData: {
        subCategory: subCategoryId,
        type: typeName.trim(),
      },
      onSuccess: (res: any) => {
        const newType = res.data;
        setSubcategoryType((prev) =>
          Array.isArray(newType) ? newType : [...prev, newType],
        );
        onSuccess?.(newType);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating subcategory type");
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

  return {
    subcategoryType,
    subcategoryTypeOptions,
    isLoading,
    addSubCategoryType,
    addSubCategoryTypeLoading,
  };
};

export default useSubCategoryTypeData;
