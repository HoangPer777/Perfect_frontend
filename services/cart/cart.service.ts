// src/services/cart/cart.service.ts
import { CartResponse } from "@/types/cart";
import api from "@/lib/api";

export const cartService = {
    getCart: async (): Promise<CartResponse> => {
        const response = await api.get("/cart");
        return response.data;
    },

    addToCart: async (data: { productId: string; quantity: number }) => {
        return await api.post("/cart/add", data);
    },

    removeItem: async (productId: string) => {
        return await api.delete(`/cart/remove/${productId}`);
    },

    updateItemQuantity: async (productId: string, quantity: number) => {
        return await api.patch("/cart/update", { productId, quantity });
    },

    clearCart: async () => {
        return await api.delete("/cart/clear");
    },

    countCartItems: async (): Promise<number> => {
        const res = await api.get("/carts/count");
        return res.data;
    },

    addCartItem: async (productId: string, quantity?: number) => {
        try {
            const res = await api.post("/cart/add", {
                productId: productId,
                quantity: quantity || 1
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    }
};
