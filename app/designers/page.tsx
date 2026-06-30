import React from 'react';
import { productService } from "@/services/products/product.service";
import { CardDesignerResponse } from "@/types/designer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DesignersPage() {
    let designers: CardDesignerResponse[] = [];

    try {
        designers = await productService.getHottestDesigners();
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Header Tiêu đề */}
                <div className="text-center md:text-left mb-12 border-b border-gray-100 pb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                        Top Creator & Designers
                    </h1>
                    <p className="text-slate-500 text-base">
                        Bảng xếp hạng những nhà thiết kế xuất sắc hàng đầu hệ thống dựa trên lượt bán.
                    </p>
                </div>

                {/* Kiểm tra danh sách trống */}
                {!designers || designers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-medium">Hiện tại chưa có nhà thiết kế nổi bật nào.</p>
                    </div>
                ) : (
                    // Cấu trúc danh sách xếp chồng theo hàng dọc (List Layout)
                    <div className="space-y-4">
                        {designers.map((designer: any, index) => {
                            const rank = index + 1;

                            // Thiết kế màu sắc riêng biệt và hiệu ứng viền cho Top 3
                            const isTop3 = rank <= 3;
                            const cardStyles =
                                rank === 1 ? "border-amber-200 bg-gradient-to-r from-amber-50/30 to-white hover:border-amber-300" :
                                    rank === 2 ? "border-slate-200 bg-gradient-to-r from-slate-50/40 to-white hover:border-slate-300" :
                                        rank === 3 ? "border-amber-600/20 bg-gradient-to-r from-amber-900/5 to-white hover:border-amber-600/40" :
                                            "border-gray-100 bg-white hover:border-gray-200";

                            const rankBadgeStyles =
                                rank === 1 ? "bg-amber-500 text-white ring-4 ring-amber-100" :
                                    rank === 2 ? "bg-slate-400 text-white ring-4 ring-slate-100" :
                                        rank === 3 ? "bg-amber-700 text-white ring-4 ring-amber-900/10" :
                                            "bg-slate-100 text-slate-500";

                            return (
                                <Link href={`/designers/${designer.id}`}
                                    key={designer.id}
                                    className={`relative border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4 ${cardStyles}`}
                                >
                                    {/* Bên trái: Thứ hạng + Avatar + Thông tin cá nhân */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        {/* Huy hiệu xếp hạng dạng số gọn gàng */}
                                        <div className={`w-9 h-9 ${rankBadgeStyles} rounded-xl flex items-center justify-center font-black text-sm shrink-0 tracking-tight`}>
                                            {rank}
                                        </div>

                                        {/* Khối Ảnh đại diện */}
                                        <div className="relative shrink-0">
                                            {designer.avatarUrl ? (
                                                <img
                                                    src={designer.avatarUrl}
                                                    alt={designer.username}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-inner border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-800 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                                    {designer.username ? designer.username.substring(0, 2).toUpperCase() : "DE"}
                                                </div>
                                            )}

                                            {/* Chấm vương miện nhỏ hoặc hiệu ứng cho Top 1 */}
                                            {rank === 1 && (
                                                <span className="absolute -top-1.5 -right-1.5 text-base select-none">👑</span>
                                            )}
                                        </div>

                                        {/* Thông tin chữ (Tên, Nickname) */}
                                        <div className="min-w-0">
                                            <h2 className="text-base font-bold text-slate-800 truncate flex items-center gap-1.5">
                                                {designer.username ? designer.username.split('@')[0] : 'Unknown'}
                                                {isTop3 && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-white border font-medium text-slate-500 scale-95 origin-left">
                                                        Top {rank}
                                                    </span>
                                                )}
                                            </h2>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                @{designer.username || 'designer'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bên phải: Khối thống số sản phẩm bán ra */}
                                    <div className="text-right shrink-0 bg-slate-50/80 border border-slate-100/50 rounded-xl px-4 py-2 min-w-[120px]">
                                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                                            Đã bán
                                        </span>
                                        <span className="text-base font-black text-indigo-600">
                                            {(designer.totalSold || 0).toLocaleString()} <span className="text-xs font-normal text-slate-500">SP</span>
                                        </span>
                                    </div>

                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}