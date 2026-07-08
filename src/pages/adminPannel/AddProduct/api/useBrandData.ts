import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type {  Option } from "../types"; // Updated type
import useGetQuery from "../../../../hooks/getQuery.hook";
// Removed usePostQuery since it wasn't being used in the original hook

/**
 * Fetches brands that belong to a given category.
 * Re-fetches whenever `categoryId` changes; skips the call when empty.
 */
const useBrandData = (categoryId: string) => {
  const [brands, setBrands] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getBrands = () => {
    if (!categoryId) {
      setBrands([]);
      return;
    }
    
    setIsLoading(true);
    
    getQuery({
      // Ensure this endpoint exists in your apiUrls object
      url: `${apiUrls.Brand.getByCategoryId}/${categoryId}`, 
      onSuccess: (res: any) => {
        setBrands(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching brands");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    getBrands();
  }, [categoryId]);

  const brandOptions: Option[] = brands.map((b : any) => ({
    // Update 'b.name' if your API returns the brand name under a different key (e.g., b.brandName)
    label: b.brand, 
    value: b._id,
  }));

  return { brands, brandOptions, isLoading };
};

export default useBrandData;