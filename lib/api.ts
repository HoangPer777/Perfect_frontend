import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiBaseUrl =
    typeof window === "undefined"
        ? process.env.API_INTERNAL_URL ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:8080/api/v1"
        : "/api/v1";

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? useAuthStore.getState().token : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== "undefined" && error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;
