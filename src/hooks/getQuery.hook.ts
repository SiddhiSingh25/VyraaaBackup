import apiClient from "../apis/apiClient.ts";
// import Toast from "../components/Toast/Toast";

import { useState, useCallback } from "react";

const useGetQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const getQuery = useCallback(async (params: any) => {
    const {
      url,
      onSuccess = () => {
        console.log("onSuccess function");
      },
      onFail = () => {
        console.log("onFail function");
      },
    } = params;
    setLoading(true);
    try {
      const { data: apiData = {} } = await apiClient.get(url);
      setData(apiData);
      await onSuccess(apiData);
      return apiData;
    } catch (err: any) {
      // Toast({
      //   type: "error",
      //   content:
      //     err?.response?.data?.message ||
      //     err?.message ||
      //     err?.data?.message ||
      //     err?.data?.data?.message ||
      //     "Something went wrong",
      // });
      const error = err?.response?.data?.message ||
        err?.message ||
        err?.data?.message ||
        err?.data?.data?.message ||
        console.log(
          err?.response?.data?.message ||
          err?.message ||
          err?.data?.message ||
          err?.data?.data?.message ||
          "Something went wrong",
        )
      onFail(error);
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default useGetQuery;
