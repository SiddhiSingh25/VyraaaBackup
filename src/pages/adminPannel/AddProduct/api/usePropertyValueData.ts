import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { PropertyValueApiItem, Option } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";

/** Fetches color families and the specific colors that belong to each one. */
const usePropertyValueData = (propertyId: string) => {

  console.log("4vfb", propertyId )
  const [propertyData, setPropertyData] = useState<PropertyValueApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();

  const getPropertyValue = () => {
    if (!propertyId) {
      setPropertyData([]);
      console.log("not get", propertyId);
      return;
    }

    setIsLoading(true);
    getQuery({
      url: `${apiUrls.PropertyValues.getByPropertyId}/${propertyId}`,
      
      onSuccess: (res: any) => {
        setPropertyData(res.data);
        setIsLoading(false);
      },
      onFail: (err: any) => {
        console.log(err, "Error fetching color families");
        setIsLoading(false);
      },
    });
  };

useEffect(() => {
  if (!propertyId) {
    setPropertyData([]);
    return;
  }

  getPropertyValue();
}, [propertyId]);

  const propertyValueOptions: Option[] = propertyData.map((cf) => ({
    label: cf.value,
    value: cf._id,
  }));

  return { propertyData, propertyValueOptions, isLoading };
};

export default usePropertyValueData;
