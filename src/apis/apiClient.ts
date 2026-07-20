import axios from "axios";
import axiosRetry from "axios-retry";

import { apiBaseUrl } from "./index.ts";
// import { console } from "../utils/console";

const apiInstance = () => {
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
      console.log("ERROR", error.response?.data?.detail || error.message);

      const isAuthExpired =
        error.response?.status === 401 ||
        error.response?.data?.error === "Authentication failed: jwt expired" ||
        ((error.response?.data?.message || "") && error.response.data.message.includes("jwt expired"));

      if (isAuthExpired) {
        console.log("AUTH EXPIRED");
        localStorage.removeItem("token");
        document.cookie = "token=; max-age=0; path=/";
        // Dynamically import store and logout to prevent circular dependency
        import("../redux/store").then(({ store }) => {
          import("../redux/slices/authSlice").then(({ logout }) => {
            store.dispatch(logout());
          });
        });
      }

      throw error;
    }
  );

  return api;
};

const apiClient = apiInstance();

export default apiClient;
