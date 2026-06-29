"use client";
import React, { useState } from 'react';
import { Star, Heart, MessageSquare, ChevronLeft, ChevronRight, Eye, ShoppingBag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { ProductResponse } from "@/types/product";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart/cart.service";

interface Props {
    product: ProductResponse;
}

export default function ProductDetailContent({ product }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const router = useRouter();

    const handleOrderNow = async () => {
        try {
            await cartService.addToCart({
                productId: product.id,
                quantity: 1
            });
            router.push("/cart");
        } catch (error) {
            console.error("Lỗi thêm vào giỏ:", error);
            alert("Vui lòng đăng nhập để thực hiện tính năng này!");
        }
    };
    // Fallback nếu danh sách images rỗng thì dùng tạm thumbnailUrl
    const displayImages = product.images && product.images.length > 0
        ? product.images.map(img => img.url)
        : [product.thumbnailUrl];

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-12 bg-[#F6F7FA] min-h-screen font-sans text-[#1A1A1A] antialiased">

            {/* HEADER SECTION */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] mb-3">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-white shadow-sm">
                            {product.designer?.avatarUrl ? (
                                <img
                                    src={product.designer.avatarUrl}
                                    alt={product.designer?.username || "Designer"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-[#4f6d7a] to-[#6b5b95] text-white flex items-center justify-center font-bold text-xl uppercase shrink-0 select-none">
                                    {product.designer?.username ? product.designer.username.substring(0, 2) : "DE"}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0F172A]">{product.designer?.username || 'Designer'}</span>
                                <span className="text-emerald-500 text-xs font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Available for work
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center text-[11px] text-gray-400 gap-2 mt-0.5">
                                <span className="flex items-center text-purple-600 font-bold gap-0.5">
                                    <Star size={11} fill="currentColor" /> {product.ratingAvg ? product.ratingAvg.toFixed(1) : "0.0"}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><ShoppingBag size={11} /> {product.soldCount || 0} Đã bán</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5"><Eye size={11} /> {product.viewCount || 0} Lượt xem</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                    <button className="p-3 bg-white border border-gray-200/60 rounded-full text-gray-500 hover:text-red-500 hover:border-red-200 shadow-sm transition-all">
                        <Heart size={18} />
                    </button>
                    <button className="px-5 py-3 bg-white border border-gray-200/80 hover:bg-gray-50 text-[#0F172A] rounded-full text-xs font-bold shadow-2xs transition-all active:scale-[0.98]">
                        Contact Designer
                    </button>
                    <button
                        onClick={handleOrderNow}
                        className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white px-6 py-3 rounded-full text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                    >
                        Order now
                    </button>
                </div>
            </header>

            {/* QUICK CONTACT LINKS */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-8 pb-6 border-b border-gray-200/40">
                <span className="flex items-center gap-1.5 bg-white py-1.5 px-3 rounded-full border border-gray-100 shadow-2xs">
                    <span className="font-medium text-gray-600">{product.designer?.email}</span>
                </span>
            </div>

            {/* MAIN PORTFOLIO CARD */}
            <div className="space-y-8 bg-white p-6 md:p-10 rounded-[40px] shadow-[0_15px_50px_-25px_rgba(0,0,0,0.05)] border border-gray-100/70">

                {/* IMAGE SLIDER SECTION */}
                <div className="space-y-4 relative group">
                    <div className="rounded-[32px] overflow-hidden bg-[#0B0F19] aspect-[16/10] relative shadow-xs">

                        {/* TAG GIÁ TIỀN HIỂN THỊ TRÊN ẢNH */}
                        <div className="absolute top-5 left-5 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-extrabold tracking-wide border border-white/10 shadow-lg select-none">
                            {product.price}$
                        </div>

                        <Swiper
                            spaceBetween={10}
                            navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
                            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                            modules={[FreeMode, Navigation, Thumbs, Pagination]}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            className="w-full h-full"
                        >
                            {displayImages.map((imgUrl, index) => (
                                <SwiperSlide key={index}>
                                    <img src={imgUrl} alt={`${product.title} - Preview ${index + 1}`} className="w-full h-full object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <button className="custom-prev absolute left-5 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md text-gray-700 hover:bg-white transition opacity-0 group-hover:opacity-100"><ChevronLeft size={16} /></button>
                        <button className="custom-next absolute right-5 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-md text-gray-700 hover:bg-white transition opacity-0 group-hover:opacity-100"><ChevronRight size={16} /></button>
                    </div>

                    {/* Thumbnails Swiper */}
                    {displayImages.length > 1 && (
                        <div className="w-full overflow-hidden">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                spaceBetween={12}
                                slidesPerView={4.5}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                breakpoints={{ 640: { slidesPerView: 5.5 }, 768: { slidesPerView: 7.5 } }}
                                className="thumbs-swiper"
                            >
                                {displayImages.map((imgUrl, index) => {
                                    const isCurrentActive = index === activeIndex;

                                    return (
                                        <SwiperSlide key={index} className="cursor-pointer">
                                            <div className={`aspect-square rounded-[20px] overflow-hidden p-0.5 border bg-white transition-all ${
                                                isCurrentActive ? 'border-purple-500 ring-4 ring-purple-50' : 'border-gray-100 hover:border-gray-300'
                                            }`}>
                                                <img src={imgUrl} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover rounded-[16px]" />
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </div>
                    )}
                </div>

                {/* DESCRIPTION */}
                <div className="pt-4 space-y-4">
                    <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">About this service</h2>
                    <p className="text-base md:text-lg text-gray-500/90 leading-relaxed font-light whitespace-pre-line">
                        {product.description}
                    </p>
                </div>

                <hr className="border-gray-100" />

                {/* FOOTER ACTION AREA */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                    <div className="flex flex-wrap items-center gap-3 order-2 md:order-1">
                        <button
                            onClick={handleOrderNow}
                            className="px-6 py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white rounded-[20px] text-xs font-bold shadow-md shadow-purple-100 transition-all active:scale-[0.99]"
                        >
                            Order now
                        </button>
                        <button className="px-5 py-3.5 bg-[#F1F3F6] hover:bg-gray-200/80 text-gray-700 rounded-[20px] text-xs font-bold transition-all flex items-center gap-2">
                            <MessageSquare size={14} />
                            Contact Designer
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 order-1 md:order-2 md:justify-end">
                        {(product.categories || []).map((tag) => (
                            <span key={tag.id} className="px-4 py-2 bg-[#F1F3F6] text-gray-600 rounded-full text-xs font-semibold">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}