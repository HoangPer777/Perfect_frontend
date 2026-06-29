// import { productService } from "@/services/products/product.service";
// import { Metadata } from "next";
// import ProductDetailContent from "@/components/products/ProductDetailContent";
//
// interface Props {
//     params: { id: string };
// }
//
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//     try {
//         const product = await productService.getProductDetail(params.id);
//         return {
//             title: `${product.title} | E-Commerce Marketplace`,
//             description: product.description ? product.description.substring(0, 160) : "Chi tiết dịch vụ chỉnh sửa media",
//             openGraph: {
//                 title: product.title,
//                 description: product.description,
//                 images: [product.thumbnailUrl],
//             },
//         };
//     } catch (error) {
//         return {
//             title: "Chi tiết sản phẩm",
//         };
//     }
// }
//
// export default async function Page({ params }: Props) {
//     try {
//         const product = await productService.getProductDetail(params.id);
//
//         if (!product) {
//             return (
//                 <div className="max-w-5xl mx-auto p-12 text-center text-red-500 font-medium">
//                     Không tìm thấy dữ liệu cho sản phẩm này.
//                 </div>
//             );
//         }
//
//         return <ProductDetailContent product={product} />;
//
//     } catch (error) {
//         console.error("Lỗi xảy ra tại Server Component khi fetch data:", error);
//         return (
//             <div className="max-w-5xl mx-auto p-12 text-center text-red-500 font-medium">
//                 Đã có lỗi hệ thống xảy ra khi lấy thông tin sản phẩm.
//             </div>
//         );
//     }
// }

import { productService } from "@/services/products/product.service";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart/cart.service";
import ProductDetailContent from "@/components/products/ProductDetailContent";

interface Props {
    params: { id: string };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const product = await productService.getProductDetail(params.id);

        // Kiểm tra null trước khi truy cập thuộc tính
        if (!product) {
            return { title: "Không tìm thấy sản phẩm" };
        }

        return {
            title: `${product.title} | E-Commerce Marketplace`,
            description: product.description ? product.description.substring(0, 160) : "Chi tiết dịch vụ",
            openGraph: {
                title: product.title,
                description: product.description,
                images: product.images && product.images.length > 0 ? [product.images[0].url] : [],
            },
        };
    } catch (error) {
        return { title: "Chi tiết sản phẩm" };
    }
}
// Thêm phần này vào dưới generateMetadata của bạn
export default async function ProductDetailPage({ params }: Props) {
    // 1. Lấy dữ liệu sản phẩm để truyền vào component nội dung
    const product = await productService.getProductDetail(params.id);

    // 2. Xử lý trường hợp không tìm thấy sản phẩm
    if (!product) {
        return <div className="p-10 text-center">Không tìm thấy sản phẩm này!</div>;
    }

    // 3. Render component nội dung chính
    return <ProductDetailContent product={product} />;
}