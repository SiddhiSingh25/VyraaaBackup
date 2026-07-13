import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { Option, SizeValueApiItem } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";

/**
 * Fetches sizes that belong to a selected size type.
 * Re-fetches whenever `sizeTypeId` changes; skips the call when empty.
 */
const useSizeValueData = (sizeTypeId: string) => {
  const [sizeValue, setSizeValue] = useState<SizeValueApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addSizeValueLoading } = usePostQuery();

  const getTaxonomy = () => {
    if (!sizeTypeId) {
      setSizeValue([]);
      return;
    }
    setIsLoading(true);
    getQuery({
      url: `${apiUrls.Size.getBySizeTypeId}/${sizeTypeId}`,
      onSuccess: (res: any) => {
        setSizeValue(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching sizes");
        setIsLoading(false);
      },
    });
  };

  const addSizeValue = (
    sizeName: string,
    onSuccess?: (newSize: SizeValueApiItem) => void,
  ) => {
    if (!sizeTypeId || !sizeName?.trim()) return;

    postQuery({
      url: apiUrls.Size.add,
      postData: {
        size: sizeName.trim(),
        sizeType: sizeTypeId,
      },
      onSuccess: (res: any) => {
        const newSize = res.data;
        setSizeValue((prev) =>
          Array.isArray(newSize) ? newSize : [...prev, newSize],
        );
        onSuccess?.(newSize);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating size value");
      },
    });
  };

  useEffect(() => {
    if (sizeTypeId) {
      getTaxonomy();
    }
  }, [sizeTypeId]);

  const sizeValueOptions: Option[] = sizeValue.map((t) => ({
    label: t.size,
    value: t._id,
  }));

  return {
    sizeValue,
    sizeValueOptions,
    isLoading,
    addSizeValue,
    addSizeValueLoading,
  };
};

export default useSizeValueData;
