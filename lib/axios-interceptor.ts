"use client";

import axios from "axios";

export const API_BASE_URL = "https://n2.omnisenti.net";

const axiosInterceptor = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token from next-auth session
axiosInterceptor.interceptors.request.use(
  async (config) => {
    const token = "";
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInterceptor.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    return Promise.reject(error);
  }
);

export default axiosInterceptor;
