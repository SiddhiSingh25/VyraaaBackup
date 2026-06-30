import axios from "axios";
import axiosRetry from "axios-retry";

import { apiBaseUrl } from "./index";
import { logger } from "../utils/logger";

const apiInstance = () => {
  const api = axios.create({
    baseURL: apiBaseUrl,
  });

  axiosRetry(api, { retries: 3 });

  api.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("token");
    config.xsrfCookieName = "token";
    if (accessToken) {
      config.headers["authorization"] = `Bearer ${accessToken}`;
    }
    logger.log("REQUEST", config);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      logger.log(response);
      console.log(response.data);
      document.cookie = `token=${response.data.token}; max-age=3600`;
      return response;
    },
    (error) => {
      logger.log("ERROR", error.response.data.detail);
      throw error;
    }
  );

  return api;
};

const apiClient = apiInstance();

export default apiClient;
