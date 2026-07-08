import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { ColorApiItem, Option } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";

/** Fetches color families and the specific colors that belong to each one. */
const useColorData = (colorFamilyId: string) => {
  console.log("jfghufhg", colorFamilyId);
  const [color, setColor] = useState<ColorApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getColor = () => {
    if (!colorFamilyId) {
      setColor([]);
      console.log("not get", colorFamilyId);
      return;
    }

    setIsLoading(true);
    getQuery({
      url: `${apiUrls.Color.getByColorFamilyId}/${colorFamilyId}`,

      onSuccess: (res: any) => {
        setColor(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching color families");
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (!colorFamilyId) {
      setColor([]);
      return;
    }

    getColor();
  }, [colorFamilyId]);

  const colorOptions: Option[] = color.map((cf) => ({
    label: cf.color,
    value: cf._id,
  }));

  return { color, colorOptions, isLoading };
};

export default useColorData;
