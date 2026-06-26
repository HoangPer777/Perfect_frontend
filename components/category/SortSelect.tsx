"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ currentSortBy }: { currentSortBy: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "recommended") {
            params.delete("sortBy");
        } else {
            params.set("sortBy", value);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort by</span>
            <select
                value={currentSortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-700"
            >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="best-seller">Best Seller</option>
            </select>
        </div>
    );
}