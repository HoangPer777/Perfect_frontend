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

const MOCK_PRODUCTS = [
    {
        id: "1",
        title: "Cyberpunk Neon Lightroom Presets",
        price: 19.99,
        thumbnailUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=80",
        ratingAvg: 4.9,
        soldCount: 850,
        avatarUrlDesigner: "https://i.pravatar.cc/150?u=a",
        usernameDesigner: "neon_vibes"
    },
    {
        id: "2",
        title: "Abstract 3D Glass Shapes Pack",
        price: 45.00,
        thumbnailUrl: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=600&q=80",
        ratingAvg: 4.7,
        soldCount: 320,
        avatarUrlDesigner: "https://i.pravatar.cc/150?u=b",
        usernameDesigner: "dimensio_art"
    },
    {
        id: "3",
        title: "Minimalist Portfolio Framer Template",
        price: 59.00,
        thumbnailUrl: "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600&q=80",
        ratingAvg: 5.0,
        soldCount: 120,
        avatarUrlDesigner: "https://i.pravatar.cc/150?u=c",
        usernameDesigner: "studio_minimal"
    },
    {
        id: "4",
        title: "Hand-Drawn Botanical Illustrations",
        price: 15.00,
        thumbnailUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80",
        ratingAvg: 4.8,
        soldCount: 2400,
        avatarUrlDesigner: "https://i.pravatar.cc/150?u=d",
        usernameDesigner: "flora_design"
    },
    {
        id: "5",
        title: "Pro Cinematic Video LUTs",
        price: 29.00,
        thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80",
        ratingAvg: 4.6,
        soldCount: 940,
        avatarUrlDesigner: "https://i.pravatar.cc/150?u=e",
        usernameDesigner: "movie_magic"
    },
    {
        id: "6",
        title: "Urban Street Photography Overlays",
        price: 22.00,
        thumbnailUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80",
        ratingAvg: 4.9,
        soldCount: 560,
        avatarUrlDesigner: "https://i.pravatar.cc/150?u=f",
        usernameDesigner: "city_walker"
    }
];

const MOCK_DESIGNERS = [
    { id: "d1", username: "alex_vfx", totalSold: 200, avatarUrl: "https://i.pravatar.cc/150?u=10" },
    { id: "d2", username: "sarah_illustrates", totalSold: 200, avatarUrl: "https://i.pravatar.cc/150?u=11" },
    { id: "d3", username: "pixel_king", totalSold: 200, avatarUrl: "https://i.pravatar.cc/150?u=12" },
    { id: "d4", username: "maya_3d", totalSold: 200, avatarUrl: "https://i.pravatar.cc/150?u=13" },
    { id: "d5", username: "the_editor", totalSold: 200, avatarUrl: "https://i.pravatar.cc/150?u=14" },
    { id: "d6", username: "vector_queen", totalSold: 200, avatarUrl: "https://i.pravatar.cc/150?u=15" },
];
export default function ListProduct() {
    const [mostViewedProducts, setMostViewedProducts] = useState<CardProductResponse[]>([]);
    const [newestProducts, setNewestProducts] = useState<CardProductResponse[]>([]);
    const [hottestDesigner, setHottestDesigner] = useState<CardDesignerResponse[]>([]);
    
    {/* Test data. Delete later. */}
    useEffect(() => {
        const fetchInfo = async () => {
            const view = await productService.getMostViewedProducts();
            setMostViewedProducts(view);
            if(view.length === 0) setMostViewedProducts(MOCK_PRODUCTS)
            
            const newest = await productService.getNewestProducts()
            setNewestProducts(newest)
            if(newest.length === 0) setNewestProducts(MOCK_PRODUCTS)
            
            const hottest = await productService.getHottestDesigners()
            setHottestDesigner(hottest)
            if(hottest.length === 0) setHottestDesigner(MOCK_DESIGNERS)
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
                            <CardProduct {...product} />
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
                    {newestProducts.reverse().map((product) => (
                        <SwiperItem key={`new-${product.id}`}>
                            <CardProduct {...product} />
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
                                    <img
                                        src={designer.avatarUrl}
                                        className="relative w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                                        alt={designer.username}
                                    />
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm">@{designer.username}</h3>
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