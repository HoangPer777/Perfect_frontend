"use client";

import React from "react";
import { CheckCircle2, ShoppingCart, Zap } from "lucide-react";
import {ServicePackageResponse} from "@/types/service";


interface ServicePackageListProps {
    services: ServicePackageResponse[];
    onAddToCart: (pkg: ServicePackageResponse) => void;
    onOrderNow: (pkg: ServicePackageResponse) => void;
}

export default function ServicePackageList({ services, onAddToCart, onOrderNow }: ServicePackageListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
            {services.map((pkg) => {
                const isRecommended = pkg.packageType?.toUpperCase() === "STANDARD";

                return (
                    <div
                        key={pkg.id}
                        className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between
                            ${isRecommended
                            ? "border-purple-500 shadow-xl ring-2 ring-purple-500 ring-opacity-10 transform md:-translate-y-2"
                            : "border-gray-200 shadow-sm hover:shadow-md"
                        }`}
                    >
                        {/* Nhãn Recommended */}
                        {isRecommended && (
                            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold tracking-wider px-4 py-1 rounded-full uppercase shadow-md">
                                Recommended
                            </div>
                        )}

                        <div>
                            {/* Tiêu đề gói & Giá */}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-800 capitalize">
                                    {pkg.title}
                                </h3>
                            </div>

                            <div className="text-3xl font-black text-purple-700 my-3">
                                ${pkg.price}
                            </div>

                            {/* Mô tả ngắn */}
                            <p className="text-sm text-gray-500 mb-4 min-h-[45px] leading-relaxed">
                                {pkg.description}
                            </p>

                            <hr className="border-gray-100 my-4" />

                            {/* Danh sách tính năng đi kèm */}
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-sm text-gray-600 gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span>{pkg.revisionsLimit} lần sửa đổi</span>
                                </li>
                                <li className="flex items-center text-sm text-gray-600 gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span>Giao hàng trong {pkg.deliveryDays} ngày</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => onAddToCart(pkg)}
                                title="Thêm vào giỏ hàng"
                                className="p-3 rounded-xl border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors duration-200 flex items-center justify-center"
                            >
                                <ShoppingCart className="w-5 h-5"/>
                            </button>

                            <button
                                className={`flex-1 py-3 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 border transition-all duration-200 active:scale-[0.98]
                                            border-purple-400 text-purple-600 hover:bg-purple-50 shadow-xs shadow-purple-50/50
                               `}
                            >
                                <Zap size={13} className={"text-purple-500"}/>
                                Order Now
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}