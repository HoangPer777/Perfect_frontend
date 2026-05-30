"use client"
import React from 'react';
import {CardProductResponse} from "@/types/product";
import Link from "next/link";

export default function CardProduct(product: CardProductResponse) {
    return (
        <Link href={`/products/${product.id}`} className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Ảnh Thumbnail */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                    src={product.thumbnailUrl || 'https://via.placeholder.com/600x450'}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    alt={product.title}
                />
                {/* Giá tiền nổi bật trên ảnh */}
                {/*<div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">*/}
                {/*    <span className="text-sm font-bold text-slate-900">*/}
                {/*        ${product.price.toLocaleString()}*/}
                {/*    </span>*/}
                {/*</div>*/}
            </div>

            {/* Nội dung Card */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>
                </div>

                {/* Rating và Lượt bán */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                    <div className="flex items-center text-yellow-500">
                        <span className="font-bold mr-1">{product.ratingAvg}</span>
                        <span>★</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500 text-xs font-medium">
                        Sold: {product.soldCount}
                    </span>
                </div>

                {/* Thông tin Designer */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={product.avatarUrlDesigner || 'https://via.placeholder.com/100'}
                            className="w-7 h-7 rounded-full object-cover border border-gray-100"
                            alt={product.usernameDesigner}
                        />
                        <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">
                            {product.usernameDesigner}
                        </span>
                    </div>
                    <button className="text-[10px] font-bold uppercase tracking-wider text-primary hover:text-slate-900 transition-colors">
                        Details
                    </button>
                </div>
            </div>
        </Link>
    );
}