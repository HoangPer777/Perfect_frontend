// import axios from "axios";
// import { useAuthStore } from "@/store/authStore";
//
// const apiBaseUrl =
//   typeof window === "undefined"
//     ? process.env.API_INTERNAL_URL ||
//       process.env.NEXT_PUBLIC_API_URL ||
//       "http://localhost:8080/api/v1"
//     : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
//
// const api = axios.create({
//   baseURL: apiBaseUrl,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
//
// // Add a request interceptor to include the JWT token
// api.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
//
// // Add a response interceptor to handle errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Clear auth state on unauthorized
//       useAuthStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );
//
// export default api;


import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
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
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;