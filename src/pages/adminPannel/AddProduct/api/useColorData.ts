import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { ColorApiItem, Option } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";

/** Fetches color families and the specific colors that belong to each one. */
const useColorData = (colorFamilyId: string) => {
  const [color, setColor] = useState<ColorApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addColorLoading } = usePostQuery();

  const getColor = () => {
    if (!colorFamilyId) {
      setColor([]);
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
        console.log(err, "Error fetching colors");
        setIsLoading(false);
      },
    });
  };

  const addColor = (
    colorName: string,
    familyId: string,
    hexCode: string,
    onSuccess?: (newColor: ColorApiItem) => void,
  ) => {
    if (!colorName?.trim() || !familyId || !hexCode?.trim()) return;

    postQuery({
      url: apiUrls.Color.add,
      postData: {
        color: colorName.trim(),
        family: familyId,
        hexCode: hexCode.trim(),
      },
      onSuccess: (res: any) => {
        const newColor = res.data;
        setColor((prevColors) =>
          Array.isArray(newColor) ? newColor : [...prevColors, newColor],
        );
        onSuccess?.(newColor);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating color");
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

  return { color, colorOptions, isLoading, addColor, addColorLoading };
};

export default useColorData;
