import api from "@/lib/api";
import { AddProductRequest, AddProductResponse, CardProductResponse, ProductResponse } from "@/types/product";
import { Category } from "@/types/category";
import { CardDesignerResponse } from "@/types/designer";

export const productService = {
    getAllLeafCategories: async (): Promise<Category[]> => {
        try {
            const res = await api.get("/products/leaf-categories");
            return res.data;
        } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
            return [];
        }
    },

    addProduct: async (data: AddProductRequest): Promise<AddProductResponse | null> => {
        try {
            const res = await api.post("/products/add", data);
            return res.data;
        } catch (error) {
            console.error("Lỗi thêm sản phẩm:", error);
            return null;
        }
    },

    updateProduct: async (data: AddProductRequest): Promise<AddProductResponse | null> => {
        try {
            const res = await api.put("/products/update", data);
            return res.data;
        } catch (error) {
            console.error("Lỗi cập nhật sản phẩm:", error);
            return null;
        }
    },

    deleteProduct: async (productId: string): Promise<boolean> => {
        try {
            const res = await api.delete(`/products/delete/${productId}`);
            return res.data;
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
            return false;
        }
    },

    getMostViewedProducts: async (): Promise<CardProductResponse[]> => {
        try {
            const res = await api.get("/products/view", { params: { limit: 20 } });
            return res.data;
        } catch (error) {
            console.error("Lỗi tải sản phẩm phổ biến:", error);
            return [];
        }
    },

    getHottestDesigners: async (): Promise<CardDesignerResponse[]> => {
        try {
            const res = await api.get("/products/hottest", { params: { limit: 20 } });
            return res.data;
        } catch (error) {
            console.error("Lỗi tải nhà thiết kế nổi bật:", error);
            return [];
        }
    },

    getNewestProducts: async (): Promise<CardProductResponse[]> => {
        try {
            const res = await api.get("/products/newest", { params: { limit: 20 } });
            return res.data;
        } catch (error) {
            console.error("Lỗi tải sản phẩm mới nhất:", error);
            return [];
        }
    },

    getProductDetail: async (id: string): Promise<ProductResponse | null> => {
        try {
            const res = await api.get(`/products/${id}`);
            return res.data;
        } catch (error) {
            console.error("Lỗi tải chi tiết sản phẩm:", error);
            return null;
        }
    },

    getProductByDesignerIdAndProductId: async (id: string): Promise<AddProductResponse | null> => {
        try {
            const res = await api.get(`/designer/products/${id}`);
            return res.data;
        } catch (error) {
            console.error("Lỗi tải sản phẩm theo designer:", error);
            return null;
        }
    }
};