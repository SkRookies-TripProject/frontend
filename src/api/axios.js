import axios from "axios";
import { getStoredAccessToken } from "./authStorage";

const instance = axios.create({
  baseURL: "http://25.2.109.64:8080/api",
});

// 요청마다 토큰 자동 추가
instance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
