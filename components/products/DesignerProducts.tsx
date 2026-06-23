"use client"
import React, { useEffect, useState } from 'react';
import { Eye, ShoppingBag, Plus, SlidersHorizontal, ChevronDown, UploadCloud, Calendar, Edit2, ArrowUpRight, ArrowUpDown } from 'lucide-react';
import { SnapshotProductResponse } from "@/types/product";
import { productService } from "@/services/products/product.service";
import { notFound, useRouter } from "next/navigation";

export default function ProductGrid() {
    const [data, setData] = useState<SnapshotProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);

    const [isLatestFirst, setIsLatestFirst] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await productService.getMyProducts();
                setData(res);
            } catch (error) {
                setIsNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggleSortOrder = () => {
        setIsLatestFirst(prev => !prev);
        setData(prevData => [...prevData].reverse()); 
    };

    if (isNotFound) {
        notFound();
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const formatCount = (count: number) => {
        return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 bg-[#f8fafc]">

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Portfolio</h2>
                    <p className="text-gray-500 mt-1">Manage your digital assets and creative outputs. Monitor performance through real-time analytics.</p>
                </div>

                {/* Actions & Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Nút lọc đổi trạng thái động */}
                    <button
                        onClick={handleToggleSortOrder}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition shadow-sm
                            ${isLatestFirst
                            ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                        }`}
                    >
                        {isLatestFirst ? 'Latest First' : 'Oldest First'}
                        <SlidersHorizontal size={16} className={isLatestFirst ? 'text-gray-500' : 'text-indigo-600'} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition shadow-md shadow-indigo-100"
                        onClick={() => router.push(`/products/add`)}
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {/* Card 1 */}
                {data.length > 0 && renderProductCard(data[0])}

                {/* Card 2: Grow your Gallery static block */}
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[420px] shadow-sm">
                    <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-inner overflow-hidden">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-700 to-slate-400 opacity-80 blur-[1px]"></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Grow your Gallery</h3>
                    <p className="text-xs text-gray-400 max-w-[180px] mt-2 mb-6">
                        New designs increase your curator ranking by 15%
                    </p>
                    <button onClick={() => router.push(`/products/add`)} className="flex items-center gap-2 px-5 py-2 border border-gray-300 hover:border-gray-900 rounded-full text-xs font-semibold text-gray-700 hover:text-gray-900 transition bg-white shadow-sm">
                        <UploadCloud size={14}/>
                        Upload Design
                    </button>
                </div>

                {/* Remaining Cards */}
                {data.slice(1).map((product) => renderProductCard(product))}

            </div>
        </div>
    );

    function renderProductCard(product: SnapshotProductResponse) {
        if (!product) return null;
        return (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full min-h-[420px] relative">

                {/* THUMBNAIL AREA */}
                <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                    <img
                        src={product.thumbnailUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* STATUS BADGE */}
                    <span className={`absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm z-10
                        ${product.status === 'Premium'
                        ? 'bg-sky-100/90 text-sky-700'
                        : 'bg-emerald-100/90 text-emerald-700'
                    }`}
                    >
                        {product.status}
                    </span>

                    {/* ACTION HOVER OVERLAY */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4 backdrop-blur-[2px] z-20">
                        <button
                            onClick={() => router.push(`products/${product.id}/edit`)}
                            className="w-full max-w-[160px] flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 hover:bg-gray-100 rounded-full text-xs font-bold transition shadow-sm"
                        >
                            View Details <ArrowUpRight size={14} />
                        </button>
                        <button
                            onClick={() => router.push(`/designer/service-package/${product.id}`)}
                            className="w-full max-w-[160px] flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full text-xs font-bold transition shadow-sm"
                        >
                            Edit Package <Edit2 size={13} />
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                        {/* TITLE */}
                        <h3 className="font-bold text-gray-800 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {product.title}
                        </h3>

                        {/* CREATED AT */}
                        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                            <Calendar size={12} />
                            <span>Created: {formatDate(product.createdAt)}</span>
                        </div>
                    </div>

                    {/* METRICS ROW */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-4 text-xs font-semibold text-gray-500">
                        {/* VIEW COUNT */}
                        <div className="flex items-center gap-1.5">
                            <Eye size={14} className="text-gray-400" />
                            <span>{formatCount(product.viewCount)} <span className="font-normal text-gray-400">views</span></span>
                        </div>

                        {/* SOLD COUNT */}
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <ShoppingBag size={13} className="text-gray-400 group-hover:text-indigo-500" />
                            <span>{formatCount(product.soldCount)} <span className="font-normal text-gray-400 group-hover:text-indigo-400">sold</span></span>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}