import { useEffect, useState } from "react";
import type { SizeTypeApiItem, Option } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import { apiUrls } from "../../../../apis";

/** Fetches size types (e.g. Topwear/Alpha) and the sizes within each one. */
const useSizeTypeData = () => {
  const [sizeType, setSizeType] = useState<SizeTypeApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addSizeTypeLoading } = usePostQuery();

  const getSizeType = () => {
    setIsLoading(true);
    getQuery({
      url: apiUrls.SizeType.getAll,
      onSuccess: (res: any) => {
        setSizeType(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching size types");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    getSizeType();
  }, []);

  const addSizeType = (
    sizeTypeName: string,
    onSuccess?: (newType: SizeTypeApiItem) => void,
  ) => {
    if (!sizeTypeName?.trim()) return;

    postQuery({
      url: apiUrls.SizeType.add,
      postData: { sizeType: sizeTypeName.trim() },
      onSuccess: (res: any) => {
        const newType = res.data;
        setSizeType((prev) =>
          Array.isArray(newType) ? newType : [...prev, newType],
        );
        onSuccess?.(newType);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating size type");
      },
    });
  };

  const sizeTypeOptions: Option[] = sizeType.map((st) => ({
    label: st.sizeType,
    value: st._id,
  }));

  return { sizeType, sizeTypeOptions, isLoading, addSizeType, addSizeTypeLoading };
};

export default useSizeTypeData;
