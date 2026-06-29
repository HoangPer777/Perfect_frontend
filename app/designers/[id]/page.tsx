import React from 'react';
import { productService } from "@/services/products/product.service";
import { SnapshotProductResponse } from "@/types/product";
import {authService} from "@/services/auth.service";
import {UserInfoResponse} from "@/types/admin";
import Link from "next/link";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function DesignerInfo({ params }: Props) {
    // Unbox params theo chuẩn Next.js mới
    const { id } = await params;

    let designer: UserInfoResponse | null = null;
    let products: SnapshotProductResponse[] = [];
    let errorOccurred = false;

    try {
        // Gọi song song cả 2 API để tối ưu thời gian phản hồi (Parallel Data Fetching)
        const [designerRes, productsRes] = await Promise.all([
            authService.getDesignerInfo(id),
            productService.getProductsDesigner(id)
        ]);

        designer = designerRes;
        products = productsRes;
    } catch (err) {
        console.error("Lỗi khi tải thông tin chi tiết Designer:", err);
        errorOccurred = true;
    }

    // Phòng vệ nếu không tìm thấy designer hoặc lỗi mạng
    if (errorOccurred || !designer) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
                    <span className="text-4xl">⚠️</span>
                    <h2 className="text-xl font-bold text-slate-800 mt-4 mb-2">Không tìm thấy nhà thiết kế</h2>
                    <p className="text-sm text-gray-500">Tài khoản nhà thiết kế không tồn tại hoặc đã bị khóa khỏi hệ thống.</p>
                </div>
            </div>
        );
    }

    // Tách chuỗi kỹ năng (skills) thành mảng để render dạng Badge gọn gàng
    const skillList = designer.skills ? designer.skills.split(',').map(s => s.trim()) : [];

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* ================= CỘT TRÁI: HỒ SƠ DESIGNER (PROFILE CARD) ================= */}
                <div className="lg:w-1/3 flex flex-col gap-6 shrink-0">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
                        {/* Huy hiệu Verified xác thực chính chủ */}
                        {designer.isVerified && (
                            <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-100">
                                <span>✓</span> Verified
                            </div>
                        )}

                        {/* Avatar & Tên tuổi */}
                        <div className="flex flex-col items-center text-center mt-4">
                            {designer.avatarUrl ? (
                                <img
                                    src={designer.avatarUrl}
                                    alt={designer.fullName}
                                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-50 shadow-md mb-4"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-700 to-indigo-950 text-white flex items-center justify-center font-black text-3xl mb-4 shadow-md">
                                    {designer.fullName ? designer.fullName.substring(0, 2).toUpperCase() : "DE"}
                                </div>
                            )}

                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                {designer.fullName}
                            </h1>
                            <p className="text-sm text-gray-400 font-medium mt-0.5">
                                @{designer.username}
                            </p>

                            {/* Chức danh chuyên môn */}
                            <span className="mt-3 px-3 py-1 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg uppercase tracking-wider">
                                {designer.specialization || "Digital Creator"}
                            </span>
                        </div>

                        {/* Thông số cơ bản */}
                        <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-50">
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Kinh nghiệm</span>
                                <span className="text-sm font-extrabold text-slate-700">{designer.experienceYears || 0} Năm</span>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Trạng thái</span>
                                <span className={`text-sm font-extrabold uppercase ${designer.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {designer.status}
                                </span>
                            </div>
                        </div>

                        {/* Giới thiệu bản thân (Bio) */}
                        <div className="mt-6 pt-6 border-t border-slate-50">
                            <h3 className="text-sm font-bold text-slate-800 mb-2">Giới thiệu</h3>
                            <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                                {designer.bio || "Chưa có thông tin giới thiệu bản thân."}
                            </p>
                        </div>

                        {/* Kỹ năng nghiệp vụ (Skills) */}
                        {skillList.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-50">
                                <h3 className="text-sm font-bold text-slate-800 mb-2.5">Kỹ năng chuyên môn</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {skillList.map((skill, index) => (
                                        <span key={index} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Liên kết & Địa chỉ */}
                        <div className="mt-6 pt-6 border-t border-slate-50 space-y-2.5 text-sm text-slate-600">
                            {designer.city && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">📍</span>
                                    <span className="truncate">{designer.detailedAddress ? `${designer.detailedAddress}, ` : ""}{designer.city}</span>
                                </div>
                            )}
                            {designer.portfolioUrl && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">🌐</span>
                                    <a href={designer.portfolioUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate">
                                        {designer.portfolioUrl.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">✉️</span>
                                <span className="truncate">{designer.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= CỘT PHẢI: CHI TIẾT SẢN PHẨM (PRODUCTS VIEW) ================= */}
                <div className="flex-grow flex flex-col gap-6">
                    {/* Thống kê hiệu năng tổng quát */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="p-2">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng sản phẩm</span>
                            <span className="text-2xl font-black text-slate-800">{products.length}</span>
                        </div>
                        <div className="p-2 border-l border-gray-100">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng lượt xem</span>
                            <span className="text-2xl font-black text-slate-800">
                                {products.reduce((acc, p) => acc + (p.viewCount || 0), 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="p-2 border-t sm:border-t-0 sm:border-l border-gray-100 col-span-2 sm:col-span-1">
                            <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Tổng lượt bán</span>
                            <span className="text-2xl font-black text-indigo-600">
                                {products.reduce((acc, p) => acc + (p.soldCount || 0), 0).toLocaleString()} SP
                            </span>
                        </div>
                    </div>

                    {/* Danh sách lưới sản phẩm */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex-grow">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
                            <h2 className="text-lg font-extrabold text-slate-800">Kho tài nguyên Thiết kế</h2>
                            <span className="text-xs font-bold text-gray-400">Cập nhật liên tục</span>
                        </div>

                        {products.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                <p className="text-sm font-medium text-gray-400">Nhà thiết kế này chưa đăng bán sản phẩm nào.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link href={`/products/${product.id}`}
                                        key={product.id}
                                        className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        {/* Ảnh sản phẩm + Trạng thái */}
                                        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                                            <img
                                                src={product.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                                                alt={product.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Badge trạng thái sản phẩm */}
                                            <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                product.status === 'PUBLISHED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </div>

                                        {/* Nội dung tóm tắt sản phẩm */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors">
                                                {product.title}
                                            </h3>

                                            {/* Lượt thống kê của Single Product */}
                                            <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <span>👁</span>
                                                    <span>{product.viewCount || 0} Lượt xem</span>
                                                </div>
                                                <div className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                                                    Đã bán: {product.soldCount || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}