import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { Option } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";

/**
 * Fetches brands that belong to a given category.
 * Re-fetches whenever `categoryId` changes; skips the call when empty.
 */
const useBrandData = (categoryId: string) => {
  const [brands, setBrands] = useState<any>([]);

  const { getQuery, loading: getBrandLoading } = useGetQuery();
  const { postQuery, loading: addBrandLoading } = usePostQuery();

  const getBrands = () => {
    if (!categoryId) {
      setBrands([]);
      return;
    }

    getQuery({
      url: `${apiUrls.Brand.getByCategoryId}/${categoryId}`,
      onSuccess: (res: any) => {
        setBrands(res.data);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching brands");
      },
    });
  };

  const addBrand = (
    brandName: string,
    onSuccess?: (newBrand: any) => void,
  ) => {
    if (!categoryId || !brandName?.trim()) return;

    postQuery({
      url: apiUrls.Brand.add,
      postData: {
        brand: brandName.trim(),
        category: categoryId,
      },
      onSuccess: (res: any) => {
        const newBrand = res.data;
        setBrands((prevBrands) =>
          Array.isArray(newBrand) ? newBrand : [...prevBrands, newBrand],
        );
        onSuccess?.(newBrand);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating brand");
      },
    });
  };

  useEffect(() => {
    getBrands();
  }, [categoryId]);

  const brandOptions: Option[] = brands.map((b: any) => ({
    label: b.brand,
    value: b._id,
  }));

  return { brands, brandOptions, getBrandLoading, addBrand, addBrandLoading };
};

export default useBrandData;