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
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTI3NTE5NzJ9.lQcBFoi8xCPfw6yMsuVDCHmfNFB9SaYDVmM5vqfERU8";
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
