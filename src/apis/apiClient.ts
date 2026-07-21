import axios from "axios";
import axiosRetry from "axios-retry";

import { apiBaseUrl } from "./index.ts";
// import { console } from "../utils/console";

const apiInstance = () => {
  let isRedirecting = false;
  const api = axios.create({
    baseURL: apiBaseUrl,
  });

  axiosRetry(api, { retries: 3 });

  api.interceptors.request.use(async (config: any) => {
    const accessToken = localStorage.getItem("token");
    config.xsrfCookieName = "token";
    if (accessToken) {
      config.headers["authorization"] = `Bearer ${accessToken}`;
    }
    console.log("REQUEST", config);
    return config;
  });

  api.interceptors.response.use(
    (response: any) => {
      console.log(response);
      console.log(response.data);
      if (response?.data?.token) {
        document.cookie = `token=${response.data.token}; max-age=3600; path=/`;
      }
      return response;
    },
    (error: any) => {
      console.log("ERROR", error.status);
      if (error?.status === 401 && !isRedirecting) {
        isRedirecting = true;
        // Clear authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("root");

        // Redirect to login page
        window.location.replace("/");
      }

      throw error;
    },
  );

  return api;
};

const apiClient = apiInstance();

export default apiClient;
