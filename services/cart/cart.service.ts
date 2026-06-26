// src/services/cart/cart.service.ts
import axios from "axios";
import { CartResponse } from "@/types/cart";
import { AddToCartRequest } from "@/types/cart";

const API_URL = "http://localhost:8080/api/v1/cart";


const getAuthHeader = () => {
    const authData = localStorage.getItem("auth-storage");
    if (!authData) return {};

    try {
        const parsedData = JSON.parse(authData);
        // Kiểm tra xem token có phải là null/undefined không
        const token = parsedData.state?.token;

        if (!token) {
            console.error("Token bị rỗng trong localStorage!");
            return {};
        }

        return { headers: { Authorization: `Bearer ${token}` } };
    } catch (e) {
        return {};
    }
};

export const cartService = {
    getCart: async (): Promise<CartResponse> => {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    },

    addToCart: async (data: { productId: string; quantity: number }) => {
        const config = getAuthHeader();
        console.log("Config headers gửi đi:", config);

        return await axios.post(`${API_URL}/add`, data, config);
    },

    removeItem: async (productId: string) => {
        return await axios.delete(`${API_URL}/remove/${productId}`, getAuthHeader());
    },

    updateItemQuantity: async (productId: string, quantity: number) => {
        return await axios.patch(`${API_URL}/update`, { productId, quantity }, getAuthHeader());
    },

    clearCart: async () => {
        return await axios.delete(`${API_URL}/clear`, getAuthHeader());
    }
};