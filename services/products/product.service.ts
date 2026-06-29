import api from "@/lib/api";
import {
    AddProductRequest,
    AddProductResponse,
    CardProductResponse,
    ProductResponse,
    SnapshotProductResponse,
    DesignerServiceGroupResponse,
    ServicePackageResponse,
    AdminProductListResponse

} from "@/types/product";
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

    // addProduct: async (data: AddProductRequest): Promise<AddProductResponse | null> => {
    //     try {
    //         const res = await api.post("/products/add", data);
    //         return res.data;
    //     } catch (error) {
    //         console.error("Lỗi thêm sản phẩm:", error);
    //         return null;
    //     }
    // },
    //
    // updateProduct: async (data: AddProductRequest): Promise<AddProductResponse | null> => {
    //     try {
    //         const res = await api.put("/products/update", data);
    //         return res.data;
    //     } catch (error) {
    //         console.error("Lỗi cập nhật sản phẩm:", error);
    //         return null;
    //     }
    // },

    addProduct: async (data: AddProductRequest): Promise<AddProductResponse | null> => {
        try {
            // Chuẩn hóa dữ liệu thô (Sanitization) gửi từ Form để khớp hoàn toàn với Backend DTO
            const sanitizedData: AddProductRequest = {
                ...data,
                // 1. Đảm bảo price luôn là kiểu Number (phòng trường hợp Form truyền String "49.99")
                price: Number(data.price),

                // 2. Đảm bảo status luôn có giá trị hợp lệ
                status: data.status || "PUBLISHED",

                // 3. Chuẩn hóa mảng danh mục về mảng các chuỗi ID thuần túy string[]
                categories: Array.isArray(data.categories)
                    ? data.categories.map((c: any) => typeof c === 'object' ? (c.id || c.value) : c)
                    : [],

                // 4. Chuẩn hóa mảng hình ảnh bổ sung về mảng các chuỗi URL thuần túy string[]
                images: Array.isArray(data.images)
                    ? data.images.map((img: any) => typeof img === 'object' ? (img.url || img.src) : img)
                    : []
            };

            const res = await api.post("/products/add", sanitizedData);
            return res.data;
        } catch (error: any) {
            // Bóc tách phản hồi lỗi Validation (400 Bad Request) chi tiết của Spring Boot
            if (error.response && error.response.data) {
                console.error(" CHI TIẾT LỖI TỪ BACKEND:", JSON.stringify(error.response.data, null, 2));
            } else {
                console.error(" Lỗi hệ thống khi gọi API thêm sản phẩm:", error);
            }
            return null;
        }
    },

    updateProduct: async (data: AddProductRequest): Promise<AddProductResponse | null> => {
        try {
            // Áp dụng chuẩn hóa tương tự cho hàm cập nhật sản phẩm
            const sanitizedData: AddProductRequest = {
                ...data,
                price: Number(data.price),
                status: data.status || "PUBLISHED",
                categories: Array.isArray(data.categories)
                    ? data.categories.map((c: any) => typeof c === 'object' ? (c.id || c.value) : c)
                    : [],
                images: Array.isArray(data.images)
                    ? data.images.map((img: any) => typeof img === 'object' ? (img.url || img.src) : img)
                    : []
            };

            const res = await api.put("/products/update", sanitizedData);
            return res.data;
        } catch (error: any) {
            console.error("Lỗi cập nhật sản phẩm:", error.response?.data || error);
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
    },
//
// <<<<<<< HEAD
//     getMyProducts: async (): Promise<SnapshotProductResponse[]> => { // <-- Thay đổi ở đây
//         try {
//             const res = await api.get("/products/my-products");
//             return res.data;
//         } catch (error) {
//             console.error("Lỗi tải danh sách sản phẩm cá nhân:", error);
//             return [];
//         }
//     }
// =======
//     getMyProducts: async (): Promise<SnapshotProductResponse[]> => {
//         const res = await api.get("/products/my-products");
//         return res.data
//     },
//     getDesignerServiceGroups: async (): Promise<DesignerServiceGroupResponse[]> => {
//         const res = await api.get("/services/designers");
//         return res.data;
//     },
//
//     getDesignerPackages: async (designerId: string): Promise<ServicePackageResponse[]> => {
//         const res = await api.get(`/services/designers/${designerId}`);
//         return res.data;
//     },
//
//     getAdminProducts: async (): Promise<AdminProductListResponse[]> => {
//         const res = await api.get("/products/admin");
//         return res.data;
//     },
// >>>>>>> e4c44b3356ab98d9c5645077b7c4c4478843da9f
// };
    getMyProducts: async (): Promise<SnapshotProductResponse[]> => {
        try {
            const res = await api.get("/products/my-products");
            return res.data;
        } catch (error) {
            console.error("Lỗi tải danh sách sản phẩm cá nhân:", error);
            return [];
        }
    },

    getDesignerServiceGroups: async (): Promise<DesignerServiceGroupResponse[]> => {
        try {
            const res = await api.get("/services/designers");
            return res.data;
        } catch (error) {
            console.error("Lỗi tải nhóm dịch vụ:", error);
            return [];
        }
    },

    getDesignerPackages: async (designerId: string): Promise<ServicePackageResponse[]> => {
        try {
            const res = await api.get(`/services/designers/${designerId}`);
            return res.data;
        } catch (error) {
            console.error("Lỗi tải các gói dịch vụ:", error);
            return [];
        }
    },

    getAdminProducts: async (): Promise<AdminProductListResponse[]> => {
        try {
            const res = await api.get("/products/admin");
            return res.data;
        } catch (error) {
            console.error("Lỗi tải danh sách sản phẩm admin:", error);
            return [];
        }
    },
};