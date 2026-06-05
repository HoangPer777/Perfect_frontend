import {ServicePackageResponse} from "@/types/service";
import api from "@/lib/api";

export const servicePackageService = {
    getAllServicePackagesByProductId: async (productId: string): Promise<ServicePackageResponse[]> => {
        const res = await api.get("/services/get", {
            params: {
                productId: productId
            }
        })
        return res.data
    }
}