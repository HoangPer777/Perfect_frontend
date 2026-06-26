"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categoryService } from "@/services/products/category.service";
import { Category } from "@/types/category";

export default function CategoryRow() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [categories, setCategories] = useState<Category[]>([]);

    // Lấy categoryId hiện tại trên URL (nếu có) để highlight nút active tương ứng
    const currentCategoryId = searchParams.get('categoryId') || "For You";

    useEffect(() => {
        categoryService.getAllRootCategories()
            .then(data => setCategories(data || []))
            .catch(err => console.error("Failed to load categories:", err));
    }, []);

    return (
        // mt-12 hoặc mt-16 để tạo khoảng cách rộng rãi, thoáng đãng bên dưới các nút CTA giống như hình mẫu
        <div className="w-full max-w-4xl mx-auto mt-14 mb-10">
            <div
                className="flex items-center justify-center gap-3 overflow-x-auto no-scrollbar py-2 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Nút mặc định "For You" (tương đương All Categories cũ nhưng ngắn gọn theo chuẩn UI mẫu) */}
                <button
                    onClick={() => router.push('/')}
                    className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        currentCategoryId === "For You"
                            ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                            : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-800'
                    }`}
                >
                    For You
                </button>

                {/* Danh sách danh mục động map từ API */}
                {categories.map((cat) => {
                    const isActive = currentCategoryId === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => router.push(`/category?categoryId=${cat.id}`)}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                                isActive
                                    ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:text-slate-800'
                            }`}
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}