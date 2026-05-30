"use client"; 

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import ProductForm from "@/components/products/ProductForm";
import MultiUploadBox from "@/components/products/UploadBox";
import { productService } from "@/services/products/product.service";
import {AddProductResponse} from "@/types/product";

export default function EditProductPage() {
    const params = useParams();
    const productId = params?.id as string;

    const [product, setProduct] = useState<AddProductResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProductData() {
            try {
                setLoading(true);
                const data = await productService.getProductByDesignerIdAndProductId(productId);
                setProduct(data);
            } catch (err: any) {
                setError(err?.response?.data?.error || "Đã có lỗi hệ thống xảy ra khi lấy thông tin sản phẩm.");
            } finally {
                setLoading(false);
            }
        }

        if (productId) {
            fetchProductData();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8faff]">
                <div className="text-center text-gray-500 font-medium">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
                    Loading product...
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-5xl mx-auto p-12 text-center text-red-500 font-medium">
                {error || "Không tìm thấy dữ liệu cho sản phẩm này."}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f8faff]">
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
                    <button className="text-sm text-gray-500 hover:text-violet-600">
                        ← Back
                    </button>
                    <h2 className="text-lg font-bold text-slate-700">Edit Product Blueprint</h2>
                    <div className="w-8 h-8 rounded-full bg-orange-100" />
                </header>

                <div className="p-10 max-w-4xl mx-auto w-full overflow-y-auto">

                    <MultiUploadBox
                        isEditMode={true}
                        initialImages={product.images || []}
                        initialThumbnailUrl={product.thumbnailUrl || ""}
                    />

                    <ProductForm
                        isEditMode={true}
                        initialData={{
                            id:  product.id,
                            title: product.title || "",
                            description: product.description || "",
                            categories: (product.categories || []).map((cat: any) => ({
                                id: cat.id,
                                name: cat.name
                            })),
                            status:  product.status || "UNKNOWN",
                            createdAt: product.createdAt,
                            updatedAt: product.updatedAt,
                            images: product.images || [],
                            thumbnailUrl: product.thumbnailUrl || "",
                            viewCount: product.viewCount,
                            ratingAvg: product.ratingAvg,
                            soldCount: product.soldCount,
                        }}
                        onSaveSuccess={(data) => setProduct(data)}
                    />

                </div>
            </main>
        </div>
    );
}