import api from "@/lib/api";
import {AddProductRequest, CardProductResponse, ProductResponse} from "@/types/product";
import {Category} from "@/types/category";
import {CardDesignerResponse} from "@/types/designer";

export const productService = {
    getAllLeafCategories: async (): Promise<Category[]> => {
        const res = await api.get("/products/leaf-categories");
        return res.data
    },
    addProduct: async (data: AddProductRequest): Promise<ProductResponse> => {
        const res = await api.post("/products/add", data);
        return res.data
    },
    getMostViewedProducts: async (): Promise<CardProductResponse[]> => {
        const res = await api.get("/products/view", {
            params: {
                limit: 20,
            }
        });
        return res.data
    },
    getHottestDesigners: async (): Promise<CardDesignerResponse[]> => {
        const res = await api.get("/products/hottest", {
            params: {
                limit: 20,
            }
        });
        return res.data
    },
    getNewestProducts: async (): Promise<CardProductResponse[]> => {
        const res = await api.get("/products/newest", {
            params: {
                limit: 20,
            }
        })
        return res.data
    },
    getProductDetail: async (id: string): Promise<ProductResponse> => {
        const res = await api.get(`/products/${id}`);
        return res.data
    }
};