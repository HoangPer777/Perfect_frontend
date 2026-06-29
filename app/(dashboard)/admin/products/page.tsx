"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/products/product.service";
import {AdminProductListResponse, ServicePackageResponse, } from "@/types/product";
import AdminSidebar from "@/components/admin/AdminSidebar";
const PAGE_SIZE = 5;


export default function AdminProductsPage() {
    const router = useRouter();

    const [products, setProducts] = useState<AdminProductListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);

    const [selectedPackage, setSelectedPackage] =
        useState<ServicePackageResponse | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAdminProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch admin products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const keywordValue = keyword.toLowerCase();

            const matchKeyword =
                product.title.toLowerCase().includes(keywordValue) ||
                product.designerName.toLowerCase().includes(keywordValue);

            const matchStatus = status === "ALL" || product.status === status;

            return matchKeyword && matchStatus;
        });
    }, [products, keyword, status]);

    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

    const currentProducts = filteredProducts.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const getStatusClass = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return "bg-green-100 text-green-700";
            case "ARCHIVED":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };
    const renderPackageButton = (
        service: ServicePackageResponse | null
    ) => {
        if (!service) {
            return (
                <span className="text-gray-400">
                -
            </span>
            );
        }

        return (
            <button
                onClick={() => setSelectedPackage(service)}
                className="rounded bg-[#7C3AED] px-3 py-1 text-sm font-medium text-white transition hover:bg-[#6D28D9]"
            >
                View
            </button>
        );
    };


    if (loading) {
        return <div className="p-6">Loading products...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-semibold">Product Management</h1>
                    <p className="text-sm text-gray-500">
                        Manage marketplace products and service packages
                    </p>
                </div>

                <div className="flex gap-3">
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by product or designer..."
                        className="w-full rounded-lg border px-4 py-2"
                    />

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border px-4 py-2"
                    >
                        <option value="ALL">All</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">Designer</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Basic</th>
                            <th className="px-4 py-3">Pro</th>
                            <th className="px-4 py-3">VIP</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    No products found
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((product) => (
                                <tr key={product.id} className="border-t">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.thumbnailUrl}
                                                alt={product.title}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                            <span className="font-medium">
                                                    {product.title}
                                                </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        {product.designerName}
                                    </td>

                                    <td className="px-4 py-3">
                                        ${product.price}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderPackageButton(product.basic)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderPackageButton(product.pro)}
                                    </td>

                                    <td className="px-4 py-3">
                                        {renderPackageButton(product.vip)}
                                    </td>

                                    <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                    product.status
                                                )}`}
                                            >
                                                {product.status}
                                            </span>
                                    </td>

                                    <td className="px-4 py-3">
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() =>
                                                router.push(`/admin/products/${product.id}`)
                                            }
                                            className="rounded-lg bg-black px-3 py-2 text-white"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Total: {filteredProducts.length} products
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-2 text-sm">
                            Page {page} / {totalPages || 1}
                        </span>

                        <button
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(page + 1)}
                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {selectedPackage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[500px] rounded-xl bg-white p-6 shadow-xl">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    {selectedPackage.title}
                                </h2>

                                <button
                                    onClick={() => setSelectedPackage(null)}
                                    className="text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-3">
                                <p>
                                    <strong>Package:</strong> {selectedPackage.packageType}
                                </p>

                                <p>
                                    <strong>Price:</strong> ${selectedPackage.price}
                                </p>

                                <p>
                                    <strong>Delivery:</strong> {selectedPackage.deliveryDays} days
                                </p>

                                <p>
                                    <strong>Revision:</strong> {selectedPackage.revisionsLimit}
                                </p>

                                <p>
                                    <strong>Description:</strong><br />
                                    {selectedPackage.description}
                                </p>
                            </div>

                            <div className="mt-6 text-right">
                                <button
                                    onClick={() => setSelectedPackage(null)}
                                    className="rounded bg-black px-5 py-2 text-white"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}