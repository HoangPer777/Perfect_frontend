"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {Category, PRICE_TIERS} from "@/types/category";

interface FilterSidebarProps {
    categories: Category[];
    currentCategory: string;
    currentPriceTier: string;
}

export default function FilterSidebar({ categories, currentCategory, currentPriceTier }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Hàm cập nhật URL Params khi người dùng click chọn bộ lọc
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "All" || value === "all") {
            params.delete(key); // Nếu chọn 'All' thì xóa bớt query param cho URL đẹp
        } else {
            params.set(key, value);
        }
        params.delete('page'); // Reset lại về trang đầu tiên khi thay đổi bộ lọc
        router.push(`?${params.toString()}`);
    };

    const handleClearAll = () => {
        router.push('?'); // Xóa sạch các Query params đưa về URL gốc
    };

    return (
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="font-bold text-lg text-slate-900">Filters</h2>
                <button
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                    Clear all
                </button>
            </div>

            {/* Tiêu chí 1: Category */}
            <div>
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Category</span>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => updateFilter("categoryId", "All")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                            currentCategory === "All" ? 'bg-slate-900 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilter("categoryId", cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                                currentCategory === cat.id ? 'bg-slate-900 text-white shadow-md' : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tiêu chí 2: Price Tier */}
            <div className="border-t border-gray-50 pt-5">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Price Tier</span>
                <div className="space-y-3">
                    {PRICE_TIERS.map((tier) => (
                        <label key={tier.id} className="flex items-center gap-3 cursor-pointer group text-sm font-medium text-slate-600 hover:text-slate-900">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="priceTierFilter"
                                    checked={currentPriceTier === tier.id}
                                    onChange={() => updateFilter("priceTier", tier.id)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer appearance-none rounded-full border checked:border-indigo-600 checked:bg-indigo-600 transition-all"
                                />
                                {currentPriceTier === tier.id && (
                                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                            </div>
                            <span className={`transition-colors duration-150 ${currentPriceTier === tier.id ? "text-indigo-600 font-bold" : ""}`}>
                                {tier.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}