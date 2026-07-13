import { useEffect, useState } from "react";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";
import { apiUrls } from "../../../../apis";
import type { ColorFamilyApiItem, Option } from "../types";

/** Fetches color families and the specific colors that belong to each one. */
const useColorFamilyData = () => {
  const [colorFamily, setColorFamily] = useState<ColorFamilyApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addColorFamilyLoading } = usePostQuery();

  const getColorFamily = () => {
    setIsLoading(true);
    getQuery({
      url: apiUrls.ColorFamily.getAll,
      onSuccess: (res: any) => {
        setColorFamily(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching color families");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    getColorFamily();
  }, []);

  const addColorFamily = (
    colorFamilyName: string,
    onSuccess?: (newFamily: ColorFamilyApiItem) => void,
  ) => {
    if (!colorFamilyName?.trim()) return;

    postQuery({
      url: apiUrls.ColorFamily.add,
      postData: { colorFamily: colorFamilyName.trim() },
      onSuccess: (res: any) => {
        const newFamily = res.data;
        if (newFamily) {
          setColorFamily((prev) =>
            Array.isArray(newFamily) ? newFamily : [...prev, newFamily],
          );
        } else {
          getColorFamily();
        }
        onSuccess?.(newFamily);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating color family");
      },
    });
  };

  const colorFamilyOptions: Option[] = colorFamily.map((cf) => ({
    label: cf.colorFamily,
    value: cf._id,
  }));


  return { colorFamily, colorFamilyOptions, isLoading, addColorFamily, addColorFamilyLoading };
};

export default useColorFamilyData;
