"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const searchParams = useSearchParams();

    // Nếu không có trang nào hoặc chỉ có 1 trang duy nhất thì không hiển thị
    if (totalPages <= 1) return null;

    // Hàm tự động tạo chuỗi URL chính xác cho từng số trang (?page=0, ?page=1,...)
    const buildPageUrl = (pageIndex: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (pageIndex === 0) {
            params.delete('page'); // Trang đầu tiên xóa param "page" cho URL gọn đẹp
        } else {
            params.set('page', pageIndex.toString());
        }
        return `?${params.toString()}`;
    };

    return (
        <div className="mt-12 flex items-center justify-center gap-2 w-full">

            {/* Nút Previous (Trang trước) */}
            {currentPage > 0 ? (
                <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <span className="text-base">&larr;</span> Previous
                </Link>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-100 bg-gray-50 text-slate-400 cursor-not-allowed opacity-60"
                >
                    <span className="text-base">&larr;</span> Previous
                </button>
            )}

            {/* Danh sách các số trang */}
            <div className="flex items-center gap-1.5 mx-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                    const isActive = index === currentPage;
                    return (
                        <Link
                            key={index}
                            href={buildPageUrl(index)}
                            className={`flex items-center justify-center w-10 h-10 text-sm font-bold rounded-xl transition-all ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-slate-600 hover:border-slate-400'
                            }`}
                        >
                            {index + 1}
                        </Link>
                    );
                })}
            </div>

            {/* Nút Next (Trang tiếp theo) */}
            {currentPage < totalPages - 1 ? (
                <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    Next <span className="text-base">&rarr;</span>
                </Link>
            ) : (
                <button
                    disabled
                    className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-100 bg-gray-50 text-slate-400 cursor-not-allowed opacity-60"
                >
                    Next <span className="text-base">&rarr;</span>
                </button>
            )}

        </div>
    );
}