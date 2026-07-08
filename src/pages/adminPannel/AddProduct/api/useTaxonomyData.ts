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



  useEffect(() => {
    getTaxonomy();
  }, [categoryId]);

  const subcategoryOptions: Option[] = taxonomy.map((t) => ({
    label: t.subCategory,
    value: t._id,
  }));

  return { taxonomy, subcategoryOptions,  isLoading };
};

export default useTaxonomyData;
