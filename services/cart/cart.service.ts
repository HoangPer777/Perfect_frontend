import {PageResponse} from "@/types/common/page";
import {CartItemResponse} from "@/types/cart";
import api from "@/lib/api";
import {AddProductRequest} from "@/types/product";

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
    addCartItem: async (serviceId: string): Promise<CartItemResponse> => {
        const res = await api.post(`/carts/add`, serviceId);
        return res.data
    },
    updateCartItem: async (oldServiceId: string, newServiceId: string): Promise<CartItemResponse> => {
        const res = await api.put(`/carts/update`, {
            oldServiceId: oldServiceId, 
            newServiceId: newServiceId,
        });
        return res.data
    },
    deleteCartItem: async (serviceId: string): Promise<Boolean> => {
        const res = await api.delete(`/carts/delete/${serviceId}`);
        return res.data
    }
}