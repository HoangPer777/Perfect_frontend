import api from "@/lib/api";
import {AddProductRequest, AddProductResponse, CardProductResponse, ProductResponse} from "@/types/product";
import {Category} from "@/types/category";
import {CardDesignerResponse} from "@/types/designer";

export const productService = {
    getAllLeafCategories: async (): Promise<Category[]> => {
        const res = await api.get("/products/leaf-categories");
        return res.data
    },
    addProduct: async (data: AddProductRequest): Promise<AddProductResponse> => {
        const res = await api.post("/products/add", data);
        return res.data
    },
    updateProduct: async (data: AddProductRequest): Promise<AddProductResponse> => {
        const res = await api.put("/products/update", data);
        return res.data
    },
    deleteProduct: async (productId: string): Promise<boolean> => {
      const res = await api.delete(`/products/delete/${productId}`); 
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
    },
    getProductByDesignerIdAndProductId: async (id: string): Promise<AddProductResponse> => {
        const res = await api.get(`/designer/products/${id}`);
        return res.data
    },
    getMyProducts: async (): Promise<AddProductResponse[]> => {
        const res = await api.get("/products/my-products");
        return res.data
    }
};