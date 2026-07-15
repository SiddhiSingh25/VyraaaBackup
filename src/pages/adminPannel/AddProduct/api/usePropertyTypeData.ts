import { useEffect, useState } from "react";
import type { PropertyTypeApiItem, Option } from "../types";
import { apiUrls } from "../../../../apis";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";

/** Fetches attribute properties (e.g. Fabric, Fit) and their possible values. */
const usePropertyTypeData = (subCategoryId: string) => {
  const [attributeData, setAttributeData] = useState<PropertyTypeApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addPropertyTypeLoading } = usePostQuery();

  const getAttributeData = () => {
    setIsLoading(true);
    getQuery({
      url: `${apiUrls.Property.getBySubCategoryId}/${subCategoryId}`,
      onSuccess: (res: any) => {
        setAttributeData(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching attributes");
        setIsLoading(false);
      },
    });
  };

  const addPropertyType = (
    propertyName: string,
    onSuccess?: (newProperty: PropertyTypeApiItem) => void,
  ) => {
    if (!subCategoryId || !propertyName?.trim()) return;

    postQuery({
      url: apiUrls.Property.add,
      postData: {
        property: propertyName.trim(),
        subCategory: subCategoryId,
      },
      onSuccess: (res: any) => {
        const newProperty = res.data;
        setAttributeData((prev) =>
          Array.isArray(newProperty) ? newProperty : [...prev, newProperty],
        );
        onSuccess?.(newProperty);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating property type");
      },
    });
  };

useEffect(() => {
  if (!subCategoryId) return;

  getAttributeData();
}, [subCategoryId]);

  const propertyTypeOptions: Option[] = attributeData.map((a) => ({
    label: a.property,
    value: a._id,
  }));

  return {
    attributeData,
    propertyTypeOptions,
    isLoading,
    addPropertyType,
    addPropertyTypeLoading,
  };
};

export default usePropertyTypeData;
