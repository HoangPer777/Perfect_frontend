import {CreateServicePackageRequest, ServicePackageResponse, UpdateServicePackageRequest} from "@/types/service";
import api from "@/lib/api";

export const servicePackageService = {
    getAllServicePackagesByProductId: async (productId: string): Promise<ServicePackageResponse[]> => {
        const res = await api.get("/services/get", {
            params: {
                productId: productId
            }
        })
        return res.data
    },

    getMyPackages: async (productId: string): Promise<ServicePackageResponse[]> => {
        const res = await api.get(`/services/my-packages/${productId}`)
        return res.data
    },

    createServicePackage: async (request: CreateServicePackageRequest): Promise<ServicePackageResponse> => {
        const res = await api.post("/services/create", request)
        return res.data
    },

    updateServicePackage: async (id: string, request: UpdateServicePackageRequest): Promise<ServicePackageResponse> => {
        const res = await api.put(`/services/${id}`, request)
        return res.data
    },

    deleteServicePackage: async (id: string): Promise<void> => {
        await api.delete(`/services/${id}`)
    }
}