import React from 'react';
import CardProduct from "@/components/products/CardProduct";
import { searchService } from "@/services/products/search.service";
import FilterSidebar from "@/components/search/FilterSidebar";
import SortSelect from "@/components/search/SortSelect";
import Pagination from "@/components/search/Pagination"; 
import { PRICE_TIERS } from "@/types/category";

interface PageProps {
    searchParams: Promise<{
        keyword?: string;
        categoryId?: string;
        priceTier?: string;
        sortBy?: string;
        page?: string;
    }>;
}

export default async function CategoryPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Fallback default values for synchronization between Client Components and Back-end API
    const currentKeyword = params.keyword || "";
    const currentCategory = params.categoryId || "All";
    const currentPriceTier = params.priceTier || "all";
    const currentSortBy = params.sortBy || "recommended";
    const currentPage = params.page ? parseInt(params.page) : 0;

    // 1. Find min/max price range based on the selected priceTier
    const selectedTier = PRICE_TIERS.find(t => t.id === currentPriceTier) || PRICE_TIERS[0];

    // 2. Fetch data in parallel directly from Server to Back-end API
    const [categories, productPage] = await Promise.all([
        searchService.getAllRootCategories(),
        searchService.getFilteredProducts({
            keyword: currentKeyword,
            categoryIdStr: currentCategory,
            sortBy: currentSortBy,
            minPrice: selectedTier.minPrice,
            maxPrice: selectedTier.maxPrice,
            page: currentPage,
            size: 20
        })
    ]);

    const products = productPage?.content || [];

    // Đọc thông tin phân trang từ object Spring Boot Page trả về
    const totalPages = productPage?.totalPages || 0;
    const totalElements = productPage?.totalElements || 0;

    return (
        <div className="min-h-screen bg-[#f8f9fc] text-slate-800 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">

                {/* Header & Sorting */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                            {totalElements} results for <span className="text-indigo-600">"Photo Editing"</span>
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Curated professional editors and retouching ateliers.</p>
                    </div>

                    {/* Sorting Dropdown (Small Client Component) */}
                    <SortSelect currentSortBy={currentSortBy} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* FILTER SIDEBAR (Small Client Component for fast URL routing) */}
                    <FilterSidebar
                        categories={categories}
                        currentCategory={currentCategory}
                        currentPriceTier={currentPriceTier}
                    />

                    {/* PRODUCT GRID WITH PAGINATION */}
                    <div className="lg:col-span-3">
                        {products.length > 0 ? (
                            // Bọc cụm danh sách và phân trang vào flex-col để xếp dọc
                            <div className="flex flex-col items-center">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                                    {products.map((product) => (
                                        <div key={product.id} className="relative group">
                                            <CardProduct {...product} />
                                        </div>
                                    ))}
                                </div>

                                {/* THANH PHÂN TRANG HIỂN THỊ TẠI ĐÂY */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                                <p className="text-gray-400 text-lg">No products found matching the current filters.</p>
                                <a
                                    href="?"
                                    className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                                >
                                    Clear filters to reset
                                </a>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}