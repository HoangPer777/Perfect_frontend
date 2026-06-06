import {PageResponse} from "@/types/common/page";
import {AddCartItemResponse, CartItemResponse} from "@/types/cart";
import api from "@/lib/api";

export const cartService = {
    getCarts: async (page: number, size: number): Promise<PageResponse<CartItemResponse>> => {
        const res = await api.get("/carts/get", {
            params: {
                page: page - 1,
                size: size
            }
        });
        return res.data;
    },
    addCartItem: async (serviceId: string): Promise<AddCartItemResponse> => {
        const res = await api.post(`/carts/add`, serviceId);
        return res.data
    },
    countCartItems: async (): Promise<number> => {
        const res = await api.get(`/carts/count`);
        return res.data
    },
    deleteCartItem: async (serviceId: string): Promise<Boolean> => {
        const res = await api.delete(`/carts/delete/${serviceId}`);
        return res.data
    }
}