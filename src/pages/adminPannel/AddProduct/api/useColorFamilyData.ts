import { useEffect, useState } from "react";
import useGetQuery from "../../../../hooks/getQuery.hook";
import { apiUrls } from "../../../../apis";
import type { ColorFamilyApiItem, Option } from "../types";

/** Fetches color families and the specific colors that belong to each one. */
const useColorFamilyData = () => {
  const [colorFamily, setColorFamily] = useState<ColorFamilyApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getColorFamily = () => {
    setIsLoading(true);
    getQuery({
      url: apiUrls.ColorFamily.getAll,
      onSuccess: (res: any) => {
        console.log(res.data, " 777777777777777777")
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

  const colorFamilyOptions: Option[] = colorFamily.map((cf) => ({
    label: cf.colorFamily,
    value: cf._id,
  }));


  return { colorFamily, colorFamilyOptions, isLoading };
};

export default useColorFamilyData;
