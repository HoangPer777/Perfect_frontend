import { create } from "zustand";
import { CreateServicePackageRequest } from "@/types/service";

interface ServiceFormState {
    title: string;
    description: string;
    packageType: 'BASIC' | 'MEDIUM' | 'PREMIUM' | 'PRO_MAX' | 'CUSTOM';
    price: number;
    deliveryDays: number;
    revisionsLimit: number;
    
    // Actions
    setField: (field: keyof Omit<ServiceFormState, 'setField' | 'resetForm'>, value: any) => void;
    resetForm: () => void;
}

export const useServiceFormStore = create<ServiceFormState>((set) => ({
    title: "",
    description: "",
    packageType: "BASIC",
    price: 0,
    deliveryDays: 1,
    revisionsLimit: 1,
    
    setField: (field, value) => set((state) => ({ ...state, [field]: value })),
    
    resetForm: () => set({
        title: "",
        description: "",
        packageType: "BASIC",
        price: 0,
        deliveryDays: 1,
        revisionsLimit: 1,
    }),
}));
