import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { TaxonomyApiItem, Option } from "../types";
import usePostQuery from "../../../../hooks/postQuery.hook";
import useGetQuery from "../../../../hooks/getQuery.hook";

/**
 * Fetches subcategories (and their types) that belong to a given category.
 * Re-fetches whenever `categoryId` changes; skips the call when empty.
 */
const useTaxonomyData = (categoryId: string) => {
  const [taxonomy, setTaxonomy] = useState<TaxonomyApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {getQuery  } = useGetQuery();
  const {postQuery  } = usePostQuery();

  const getTaxonomy = () => {
    if (!categoryId) {
      setTaxonomy([]);
      return;
    }
    setIsLoading(true);
    getQuery({
      url: `${apiUrls.SubCategory.getByCategoryId}/${categoryId}`,
      onSuccess: (res: any) => {
        setTaxonomy(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching subcategories");
        setIsLoading(false);
      },
    });
  };



    const addSubCategory = (
      subCategoryName: string,
      onSuccess?: (newSubCategory: TaxonomyApiItem) => void,
    ) => {
      if (!categoryId || !subCategoryName?.trim()) return;

      postQuery({
        url: apiUrls.SubCategory.add,
        postData: {
          category: categoryId,
          subCategory: subCategoryName.trim(),
        },
        onSuccess: (res: any) => {
          const newSubCategory = res.data;
          setTaxonomy((prevTaxonomy) =>
            Array.isArray(newSubCategory)
              ? newSubCategory
              : [...prevTaxonomy, newSubCategory],
          );
          onSuccess?.(newSubCategory);
        },
        onFail: (err: any) => {
          console.log(err, "Error creating subcategory");
        },
      });
    };


  useEffect(() => {
    getTaxonomy();
  }, [categoryId]);

  const subcategoryOptions: Option[] = taxonomy.map((t) => ({
    label: t.subCategory,
    value: t._id,
  }));

  return { taxonomy, subcategoryOptions, addSubCategory, isLoading };
};

export default useTaxonomyData;
