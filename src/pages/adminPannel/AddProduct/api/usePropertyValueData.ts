import { useEffect, useState } from "react";
import { apiUrls } from "../../../../apis";
import type { PropertyValueApiItem, Option } from "../types";
import useGetQuery from "../../../../hooks/getQuery.hook";
import usePostQuery from "../../../../hooks/postQuery.hook";

/** Fetches property values for a selected property. */
const usePropertyValueData = (propertyId: string) => {
  const [propertyData, setPropertyData] = useState<PropertyValueApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getQuery } = useGetQuery();
  const { postQuery, loading: addPropertyValueLoading } = usePostQuery();

  const getPropertyValue = () => {
    if (!propertyId) {
      setPropertyData([]);
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
        console.log(err, "Error fetching property values");
        setIsLoading(false);
      },
    });
  };

  const addPropertyValue = (
    valueName: string,
    propertyIdValue: string,
    onSuccess?: (newValue: PropertyValueApiItem) => void,
  ) => {
    if (!propertyIdValue || !valueName?.trim()) return;

    postQuery({
      url: apiUrls.PropertyValues.add,
      postData: {
        property: propertyIdValue,
        value: valueName.trim(),
      },
      onSuccess: (res: any) => {
        const newValue = res.data;
        setPropertyData((prev) =>
          Array.isArray(newValue) ? newValue : [...prev, newValue],
        );
        onSuccess?.(newValue);
      },
      onFail: (err: any) => {
        console.log(err, "Error creating property value");
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

  return {
    propertyData,
    propertyValueOptions,
    isLoading,
    addPropertyValue,
    addPropertyValueLoading,
  };
};

export default usePropertyValueData;
