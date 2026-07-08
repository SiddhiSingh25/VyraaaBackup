import { useEffect, useState } from "react";
import type { PropertyTypeApiItem, Option } from "../types";
import { apiUrls } from "../../../../apis";
import useGetQuery from "../../../../hooks/getQuery.hook";

/** Fetches attribute properties (e.g. Fabric, Fit) and their possible values. */
const usePropertyTypeData = (subCategoryId : string) => {
  const [attributeData, setAttributeData] = useState<PropertyTypeApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(subCategoryId, "^^^^^^^^^^^^^")

  const { getQuery } = useGetQuery();

  const getAttributeData = () => {
    setIsLoading(true);
    getQuery({
      url: `${apiUrls.Property.getBySubCategoryTypeId}/${subCategoryId}`,
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

useEffect(() => {
  if (!subCategoryId) return;

  getAttributeData();
}, [subCategoryId]);

  const propertyTypeOptions: Option[] = attributeData.map((a) => ({
    label: a.property,
    value: a._id,
  }));

  return { attributeData, propertyTypeOptions, isLoading };
};

export default usePropertyTypeData;
