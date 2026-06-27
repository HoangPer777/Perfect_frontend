"use client";

import React from "react";
import { CheckCircle2, ShoppingCart, Zap } from "lucide-react";
import { ServicePackageResponse } from "@/types/service";

interface ServicePackageListProps {
    services: ServicePackageResponse[];
    onAddToCart: (pkg: ServicePackageResponse) => void;
    onOrderNow: (pkg: ServicePackageResponse) => void;
}

export default function ServicePackageList({ services, onAddToCart, onOrderNow }: ServicePackageListProps) {

    // Hàm Helper trả về màu sắc Badge tương ứng cho từng loại Package Type (Tone tím/slate/amber)
    const getTierBadgeStyles = (type: ServicePackageResponse['packageType']) => {
        switch (type?.toUpperCase()) {
            case 'BASIC':
                return 'bg-slate-50 text-slate-600 border-slate-200';
            case 'MEDIUM':
                return 'bg-sky-50 text-sky-600 border-sky-200';
            case 'PREMIUM':
            case 'PRO':
                return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'PRO_MAX':
            case 'VIP':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'CUSTOM':
                return 'bg-pink-50 text-pink-600 border-pink-100';
            default:
                return 'bg-purple-50 text-purple-600 border-purple-100';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto p-4">
            {services.map((pkg) => {
                const isRecommended = pkg.packageType?.toUpperCase() === "PREMIUM" || pkg.packageType?.toUpperCase() === "PRO";

                return (
                    <div
                        key={pkg.id}
                        className={`relative rounded-3xl p-6 bg-white border transition-all duration-300 flex flex-col justify-between
                            ${isRecommended
                            ? "border-purple-500 shadow-xl ring-2 ring-purple-500 ring-opacity-10 transform md:-translate-y-2"
                            : "border-gray-200 shadow-sm hover:shadow-md"
                        }`}
                    >
                        {/* Recommended Badge Alert */}
                        {isRecommended && (
                            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold tracking-wider px-4 py-1 rounded-full uppercase shadow-md">
                                Recommended
                            </div>
                        )}

                        <div>
                            {/* Title & Package Type Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h3 className="text-xl font-bold text-gray-800 capitalize">
                                    {pkg.title}
                                </h3>

                                {/* DISPLAY PACKAGE TYPE BADGE */}
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full uppercase tracking-wider ${getTierBadgeStyles(pkg.packageType)}`}>
                                    {pkg.packageType}
                                </span>
                            </div>

                            {/* Dynamic Price */}
                            <div className="text-3xl font-black text-purple-700 my-3">
                                ${pkg.price}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-500 mb-4 min-h-[45px] leading-relaxed">
                                {pkg.description}
                            </p>

                            <hr className="border-gray-100 my-4" />

                            {/* Feature Checklist (English) */}
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center text-sm text-gray-600 gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span>{pkg.revisionsLimit} {pkg.revisionsLimit === 1 ? 'Revision' : 'Revisions'} Included</span>
                                </li>
                                <li className="flex items-center text-sm text-gray-600 gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                                    <span>{pkg.deliveryDays} {pkg.deliveryDays === 1 ? 'Day' : 'Days'} Delivery Time</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Row */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => onAddToCart(pkg)}
                                title="Add to Cart"
                                className="p-3 rounded-xl border border-purple-100 text-purple-600 hover:bg-purple-50 active:scale-95 transition-all flex items-center justify-center shadow-xs"
                            >
                                <ShoppingCart className="w-5 h-5"/>
                            </button>

                            <button
                                onClick={() => onOrderNow(pkg)}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all duration-200 active:scale-[0.97]
                                    ${isRecommended
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-transparent shadow-md shadow-purple-100'
                                    : 'border-purple-200 text-purple-600 hover:bg-purple-50 bg-white'
                                }`}
                            >
                                <Zap size={13} className={isRecommended ? "text-purple-200 fill-purple-200" : "text-purple-500"}/>
                                Order Now
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}