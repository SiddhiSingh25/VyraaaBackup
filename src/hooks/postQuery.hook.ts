import { useState } from "react";
import apiClient from "../apis/apiClient";
// import { console } from "../utils/console";
// import Toast from "../components/Toast/Toast";

const headers = {
  "Content-Type": "application/json",
};

const usePostQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [error, setError] = useState();

  const postQuery = async (params: any) => {
    const {
      url,
      onSuccess = () => {
        console.log("onSuccess function");
      },
      onFail = () => {
        console.log("onFail function");
      },
      postData,
    } = params;
    setLoading(true);
    try {
      const requestHeaders = params.headers ?? (postData instanceof FormData ? undefined : headers);
      const { data: apiData = {} } = await apiClient.post(url, postData, {
        headers: requestHeaders,
      });
      setData(apiData);
      await onSuccess(apiData);
      console.log(apiData, "postQuery-success");
      return apiData;
    } catch (err: any) {
      console.log(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong",
      );

      onFail(err?.response);
      console.log(err, "postQuery-fail");
      setError(err?.response);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    postQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default usePostQuery;
