import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type {  Option, SizeValueApiItem } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";

/**
 * Fetches subcategories (and their types) that belong to a given category.
 * Re-fetches whenever `categoryId` changes; skips the call when empty.
 */
const useSizeValueData = (sizeTypeId: string) => {
  const [sizeValue, setSizeValue] = useState<SizeValueApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getTaxonomy = () => {
    if (!sizeTypeId) {
      setSizeValue([]);
      return;
    }
    setIsLoading(true);
    getQuery({
      url: `${apiUrls.SizeTypeValue.getBySizeTypeId}/${sizeTypeId}`,
      onSuccess: (res: any) => {
        setSizeValue(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching subcategories");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (sizeTypeId) {
      getTaxonomy();
    }
  }, [sizeTypeId]);

  const sizeValueOptions : Option[] = sizeValue.map((t) => ({
    label: t.size,
    value: t._id,
  }));

  return { sizeValue, sizeValueOptions, isLoading };
};

export default useSizeValueData;
