import { useState } from "react";
import apiClient from "../apis/apiClient";
import { logger } from "../utils/logger";
import "react-toastify/dist/ReactToastify.css";
import Toast from "../components/Toast/Toast";

const headers = {
  "Content-Type": "application/json",
};

const usePutQuery = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null); // Initialize as null
  const [error, setError] = useState(null); // Initialize as null

  const putQuery = async (params) => {
    const {
      url,
      onSuccess = () => {
        logger.log("onSuccess function");
      },
      onFail = () => {
        logger.log("onFail function");
      },
      putData,
    } = params;

    setLoading(true);
    setError(null); // Reset error state before making the request
    try {
      const response = await apiClient.put(url, putData, { headers });
      const apiData = response.data || {}; // Extract data from response
      setData(apiData);
      await onSuccess(apiData);
      logger.log(apiData, "putQuery-success");
      return { data: apiData, error: null };
    } catch (err) {
      Toast({
        type: "error",
        content:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
      });
      onFail(err);
      logger.log(err, "putQuery-fail");
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    putQuery,
    loading,
    setLoading,
    data,
    setData,
    error,
    setError,
  };
};

export default usePutQuery;
