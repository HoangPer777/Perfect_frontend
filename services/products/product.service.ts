import api from "@/lib/api";
import {AddProductRequest, ProductResponse} from "@/types/product";
import {Category} from "@/types/category";

export const productService = {
    getAllLeafCategories: async (): Promise<Category[]> => {
        const res = await api.get("/products/leaf-categories");
        return res.data
    },
    addProduct: async (data: AddProductRequest): Promise<ProductResponse> => {
        const res = await api.post("/products/add", data);
        return res.data
    }
};