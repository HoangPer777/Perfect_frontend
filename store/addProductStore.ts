import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FilePreview } from "@/types/file";
import {Category} from "@/types/category";

interface ProductState {
    title: string;
    description: string;
    images: string[];
    thumbnailId: string | null;
    previews: FilePreview[];
    categories: Category[];
    
    // Actions
    toggleCategory: (category: Category) => void;
    setField: (field: keyof Omit<ProductState, 'setField' | 'resetForm' | 'toggleCategory'>, value: any) => void;
    resetForm: () => void;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set) => ({
            title: "",
            description: "",
            images: [],
            thumbnailId: null,
            previews: [],
            categories: [],

            // Hàm cập nhật field chung
            setField: (field, value) => set((state) => ({ ...state, [field]: value })),

            // Logic Toggle hoàn chỉnh
            toggleCategory: (category) => set((state) => {
                const isExist = state.categories.some(item => item.id === category.id);
                return {
                    categories: isExist
                        ? state.categories.filter(item => item.id !== category.id)
                        : [...state.categories, category]
                };
            }),

            resetForm: () => set({
                title: "",
                description: "",
                images: [],
                thumbnailId: null,
                previews: [],
                categories: []
            }),
        }),
        {
            name: "product-storage"
        }
    )
);