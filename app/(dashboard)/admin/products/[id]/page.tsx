"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { productService } from "@/services/products/product.service";
import {
    ProductResponse,
    ServicePackageResponse,
} from "@/types/product";

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams();

    const [product, setProduct] =
        useState<ProductResponse | null>(null);

    const [packages, setPackages] =
        useState<ServicePackageResponse[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productData =
                    await productService.getProductDetail(
                        params.id as string
                    );

                setProduct(productData);

                const packageData =
                    await productService.getDesignerPackages(
                        productData.designer.id
                    );

                setPackages(packageData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!product) {
        return <div className="p-6">Product not found.</div>;
    }

    return (
        <div className="mx-auto max-w-6xl p-6">

            <button
                onClick={() => router.back()}
                className="mb-6 rounded-lg border px-4 py-2 hover:bg-gray-100"
            >
                ← Back
            </button>

            <h1 className="mb-8 text-3xl font-bold">
                Product Detail
            </h1>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                <div>
                    <img
                        src={product.thumbnailUrl}
                        alt={product.title}
                        className="h-80 w-full rounded-xl border object-cover"
                    />
                </div>

                <div className="lg:col-span-2 space-y-4">

                    <div>
                        <p className="text-sm text-gray-500">
                            Product Title
                        </p>

                        <h2 className="text-2xl font-bold">
                            {product.title}
                        </h2>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Designer
                        </p>

                        <div className="flex items-center gap-3">

                            <img
                                src={product.designer.avatarUrl}
                                alt={product.designer.username}
                                className="h-10 w-10 rounded-full border object-cover"
                            />

                            <div>
                                <p className="font-semibold">
                                    {product.designer.username}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {product.designer.email}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">

                        <div>
                            <p className="text-sm text-gray-500">
                                Price
                            </p>

                            <p className="font-semibold">
                                {Number(product.price).toLocaleString()} $
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Rating
                            </p>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                    ⭐ {product.ratingAvg}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Views
                            </p>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                     👁 {product.viewCount}
                            </span>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Sold
                            </p>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                  {product.soldCount} Sold
                            </span>
                        </div>

                    </div>

                    <div>

                        <p className="mb-2 text-sm text-gray-500">
                            Categories
                        </p>

                        <div className="flex flex-wrap gap-2">

                            {product.categories.map(category => (

                                <span
                                    key={category.id}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                                >
                                {category.name}
                            </span>

                            ))}

                        </div>

                    </div>

                    <div>

                        <p className="mb-2 text-sm text-gray-500">
                            Description
                        </p>

                        <p className="leading-7 text-gray-700">
                            {product.description}
                        </p>

                    </div>
                    <hr className="my-10" />

                    <h2 className="mb-6 text-2xl font-bold">
                        Designer Service Packages
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                        {packages.map((service) => (

                            <div
                                key={service.id}
                                className="rounded-2xl border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >

                                <div className="mb-4 flex items-center justify-between">

                <span className="rounded-full bg-[#7C3AED]/10 px-3 py-1 text-sm font-semibold text-[#7C3AED]">

                    {service.packageType}

                </span>

                                    <span className="text-xl font-bold">

                    ${service.price}

                </span>

                                </div>

                                <h3 className="mb-2 text-lg font-semibold">

                                    {service.title}

                                </h3>

                                <p className="mb-5 text-sm text-gray-600">

                                    {service.description}

                                </p>

                                <div className="space-y-2 text-sm">

                                    <div className="flex justify-between">

                    <span className="text-gray-500">
                        Delivery
                    </span>

                                        <span>

                        {service.deliveryDays} days

                    </span>

                                    </div>

                                    <div className="flex justify-between">

                    <span className="text-gray-500">
                        Revisions
                    </span>

                                        <span>

                        {service.revisionsLimit}

                    </span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                </div>

            </div>

        </div>

    );
}