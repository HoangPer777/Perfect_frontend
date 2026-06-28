import api from "@/lib/api";
import {CardProductResponse} from "@/types/product";
import {PageResponse} from "@/types/common/page";

interface ProductFilterParams {
    keyword?: string;
    categoryIdStr?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    size?: number;
}

export const searchService = {
    getAllRootCategories: async () => {
        const res = await api.get(`/products/root-categories`);
        return res.data;
    },
    getFilteredProducts: async (filterParams: ProductFilterParams): Promise<PageResponse<CardProductResponse>> => {
        const res = await api.get(`/products/search-filtered`, {
            params: {
                keyword: filterParams.keyword,
                categoryIdStr: filterParams.categoryIdStr,
                minPrice: filterParams.minPrice,
                maxPrice: filterParams.maxPrice,
                sortBy: filterParams.sortBy,
                page: filterParams.page,  
                size: filterParams.size    
            }
        });
        return res.data; 
    }
}