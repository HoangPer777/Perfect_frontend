import { Metadata } from "next";
import ProductDetailContent from "@/components/products/ProductDetailContent";
import { productService } from "@/services/products/product.service";

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const product = await productService.getProductDetail(params.id);

        if (!product) {
            return { title: "Product not found" };
        }

        return {
            title: `${product.title} | E-Commerce Marketplace`,
            description: product.description
                ? product.description.substring(0, 160)
                : "Product detail",
            openGraph: {
                title: product.title,
                description: product.description,
                images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
            },
        };
    } catch (error) {
        return { title: "Product detail" };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    try {
        const product = await productService.getProductDetail(params.id);

        if (!product) {
            return <div className="p-10 text-center">Khong tim thay san pham nay!</div>;
        }

        return <ProductDetailContent product={product} />;
    } catch (error) {
        console.error("Failed to load product detail:", error);
        return (
            <div className="max-w-5xl mx-auto p-12 text-center text-red-500 font-medium">
                Da co loi khi lay thong tin san pham.
            </div>
        );
    }
}
