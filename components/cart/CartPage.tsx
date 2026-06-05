// app/cart/CartPageClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CartItemResponse } from '@/types/cart';
import { PageResponse } from "@/types/common/page";
import { ChevronRight, Trash2, Clock, RefreshCw, ShoppingCart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { cartService } from '@/services/cart/cart.service'; // Đảm bảo đường dẫn này đúng với project của bạn

export default function CartPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1. Quản lý trạng thái dữ liệu bằng React State
    const [cartData, setCartData] = useState<PageResponse<CartItemResponse> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Đọc số trang hiện tại từ URL query (Mặc định là trang 1 nếu không truyền)
    const currentPage = Number(searchParams.get('page')) || 1;
    const size = 10; // Đặt kích thước cố định là 10 phần tử/trang

    // 2. Fetch data từ API khi số trang (currentPage) thay đổi
    useEffect(() => {
        const loadCartData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Gọi hàm API của bạn (Hàm này bên trong đã tự xử lý logic trừ 1 để khớp với Spring Boot)
                const data = await cartService.getCarts(currentPage, size);
                setCartData(data);
            } catch (err: any) {
                console.error("Lỗi lấy dữ liệu giỏ hàng:", err);
                setError(err?.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại!");
            } finally {
                setLoading(false);
            }
        };

        loadCartData();
    }, [currentPage]); // Chạy lại hiệu ứng này mỗi khi số trang thay đổi

    // 3. Xử lý chuyển trang bằng cách push param lên URL thanh địa chỉ
    const handlePageChange = (newPage: number) => {
        if (!cartData || newPage < 1 || newPage > cartData.totalPages) return;
        router.push(`/cart?page=${newPage}`);
    };

    // 4. Xử lý xóa item khỏi giỏ hàng
    const handleDeleteItem = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này khỏi giỏ hàng?")) {
            try {
                // TODO: Bật hàm delete thực tế của bạn ở đây
                // await cartService.deleteCartItem(id);
                alert(`Xóa thành công item: ${id}`);

                // Tải lại dữ liệu trang hiện tại sau khi xóa thành công
                const data = await cartService.getCarts(currentPage, size);
                setCartData(data);
            } catch (err) {
                alert("Xóa thất bại, vui lòng kiểm tra lại!");
            }
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getPackageBadgeClass = (type: string) => {
        switch (type) {
            case 'VIP': return 'bg-purple-100 text-purple-700 font-semibold';
            case 'PRO': return 'bg-blue-100 text-blue-700 font-semibold';
            case 'BASIC': return 'bg-gray-100 text-gray-700 font-semibold';
            default: return 'bg-amber-100 text-amber-700 font-semibold';
        }
    };

    // --- CÁC TRẠNG THÁI HIỂN THỊ ĐẶC BIỆT ---

    // Trạng thái đang tải dữ liệu (Loading skeleton/spinner)
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Loading your cart...</p>
            </div>
        );
    }

    // Trạng thái gặp lỗi khi gọi API
    if (error) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center max-w-sm">
                    <p className="text-rose-500 font-semibold mb-3">Đã xảy ra lỗi</p>
                    <p className="text-sm text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Mảng items thực tế lấy ra từ state
    const items = cartData?.content || [];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] py-10 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] flex items-center gap-2">
                        <ShoppingCart className="w-8 h-8 text-indigo-600" />
                        My Shopping Cart
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Review your selected photo editing service packages and complete your order seamlessly.
                    </p>
                </div>

                {/* Tab Filter */}
                <div className="flex border-b border-slate-200 mb-6 text-sm font-medium overflow-x-auto gap-6">
                    <button className="border-b-2 border-indigo-600 py-3 text-indigo-600 px-1 whitespace-nowrap">
                        All Items ({cartData?.totalElements || 0})
                    </button>
                    <button className="text-slate-400 py-3 px-1 hover:text-slate-600 whitespace-nowrap">Saved for Later</button>
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                        <p className="text-slate-400 font-medium">Giỏ hàng của bạn hiện đang trống.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* List Cart Items */}
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200"
                            >
                                {/* Khối bên trái: Ảnh + Thông tin */}
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                        <Image
                                            src={item.product.thumbnailUrl || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500'}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="space-y-1 min-w-0">
                                        <span className="text-[10px] tracking-wider uppercase text-slate-400 block font-semibold">
                                            ID: {item.id.slice(0, 8).toUpperCase()}
                                        </span>
                                        <h3 className="font-semibold text-slate-800 text-base truncate max-w-xs md:max-w-md">
                                            {item.product.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                            <span className="font-medium text-slate-700">Editor: @{item.product.designerUsername}</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.deliveryDays}d delivery</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {item.revisionsLimit} revs</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Khối bên phải: Badge, Giá & Hành động */}
                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                    <div className="text-left sm:text-right space-y-1.5">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-wide ${getPackageBadgeClass(item.packageType)}`}>
                                            {item.packageType}
                                        </span>
                                        <div className="text-xs text-slate-400 font-medium">{item.title}</div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-xs text-slate-400 block uppercase font-medium">Amount</span>
                                            <span className="text-xl font-bold text-indigo-600">{formatPrice(item.price)}</span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Xóa khỏi giỏ hàng"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-colors hidden sm:block">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Điều hướng phân trang */}
                        {cartData && cartData.totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-6 text-sm text-slate-500">
                                <div>
                                    Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{cartData.totalPages}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === cartData.totalPages}
                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}