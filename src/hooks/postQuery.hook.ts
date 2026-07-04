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
      const { data: apiData = {} } = await apiClient.post(url, postData, {
        headers: params.headers || headers,
      });
      setData(apiData);
      await onSuccess(apiData);
      console.log(apiData, "postQuery-success");
    } catch (err: any) {
      // Toast({
      //   type: "error",
      //   content:
      //     err?.response?.data?.message ||
      //     err?.message ||
      //     err?.data?.message ||
      //     err?.response?.data?.message ||
      //     err?.data?.data?.message ||
      //     "Something went wrong",
      // });
      console.log(
        err?.response?.data?.message ||
        err?.message ||
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.data?.data?.message ||
        "Something went wrong",
      );

      onFail(err);
      console.log(err, "postQuery-fail");
      setError(err);
      // setData();
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
