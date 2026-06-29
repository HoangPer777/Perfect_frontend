"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CardProduct from "./CardProduct";
import {useEffect, useState} from "react";
import {productService} from "@/services/products/product.service";
import {CardProductResponse} from "@/types/product";
import {CardDesignerResponse} from "@/types/designer";

const SwiperContainer = Swiper as any;
const SwiperItem = SwiperSlide as any;

export default function ListProduct() {
    const [mostViewedProducts, setMostViewedProducts] = useState<CardProductResponse[]>([]);
    const [newestProducts, setNewestProducts] = useState<CardProductResponse[]>([]);
    const [hottestDesigner, setHottestDesigner] = useState<CardDesignerResponse[]>([]);
    
    {/* Test data. Delete later. */}
    useEffect(() => {
        const fetchInfo = async () => {
            const view = await productService.getMostViewedProducts();
            setMostViewedProducts(view);
            
            const newest = await productService.getNewestProducts()
            setNewestProducts(newest)
            
            const hottest = await productService.getHottestDesigners()
            setHottestDesigner(hottest)
        }
        fetchInfo();
    }, []);
    return (
        <section className="mt-20 w-full max-w-6xl space-y-18 px-4 pb-20">

            <div className="text-left">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Most Viewed</h2>
                        <p className="text-slate-500 mt-1">Projects trending right now across the globe.</p>
                    </div>
                </div>

                <SwiperContainer
                    modules={[Navigation]}
                    spaceBetween={24}
                    slidesPerView={3}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="!pb-8 swiper-custom-nav"
                >
                    {mostViewedProducts.map((product) => (
                        <SwiperItem key={product.id}>
                            <CardProduct product={product} />
                        </SwiperItem>
                    ))}
                </SwiperContainer>
            </div>

            <div className="text-left">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Latest Products</h2>
                        <p className="text-slate-500 mt-1">Freshly uploaded assets for your next big project.</p>
                    </div>
                </div>

                <SwiperContainer
                    modules={[Navigation]}
                    spaceBetween={24}
                    slidesPerView={1.2}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="!pb-8 swiper-custom-nav"
                >
                    {newestProducts.map((product) => (
                        <SwiperItem key={`new-${product.id}`}>
                            <CardProduct product={product} />
                        </SwiperItem>
                    ))}
                </SwiperContainer>
            </div>

            <div className="text-left">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hot Designers</h2>
                        <p className="text-slate-500 mt-1">Top-tier creative talent to follow and hire.</p>
                    </div>
                </div>

                <SwiperContainer
                    modules={[Navigation]}
                    spaceBetween={20}
                    slidesPerView={2.2}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 }, 
                    }}
                    className="!pb-8 swiper-custom-nav"
                >
                    {hottestDesigner.map((designer) => (
                        <SwiperItem key={designer.id}>
                            <div className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg scale-0 group-hover:scale-110 transition-transform duration-500"></div>
                                    {designer.avatarUrl ? (
                                        <img
                                            src={designer.avatarUrl}
                                            className="relative w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                                            alt={designer.username || "Designer"}
                                        />
                                    ) : (
                                        <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-[#4f6d7a] to-[#6b5b95] text-white flex items-center justify-center font-bold text-2xl uppercase shrink-0 select-none">
                                            {designer.username ? designer.username.substring(0, 2) : "DE"}
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">{designer.username}</h3>
                                <p className="text-[11px] text-primary font-bold uppercase mt-1">{designer.totalSold}</p>
                                <button className="mt-4 px-6 py-2 rounded-full bg-slate-900 text-white text-[11px] font-bold hover:bg-primary transition-colors w-full">
                                    View Profile
                                </button>
                            </div>
                        </SwiperItem>
                    ))}
                </SwiperContainer>
            </div>
        </section>
    );
}