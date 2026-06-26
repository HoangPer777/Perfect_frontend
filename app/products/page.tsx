// export default function ProductListingPage() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Discover Designs</h1>
//         {/* TODO: Add View Mode Toggle (Grid/List) */}
//       </div>
//
//       <div className="flex gap-8">
//         <aside className="w-64 shrink-0 hidden lg:block">
//           <div className="sticky top-24 space-y-8">
//             <div>
//               <h3 className="font-bold mb-4">Categories</h3>
//               {/* TODO: Map categories from backend */}
//               <div className="space-y-2">
//                 <label className="flex items-center gap-2">
//                   <input type="checkbox" /> Logos
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="checkbox" /> Banners
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input type="checkbox" /> UI/UX
//                 </label>
//               </div>
//             </div>
//
//             <div>
//               <h3 className="font-bold mb-4">Price Range</h3>
//               {/* TODO: Add Range Slider */}
//             </div>
//
//             <div>
//               <h3 className="font-bold mb-4">Designer</h3>
//               {/* TODO: Add Designer Search/Filter */}
//             </div>
//           </div>
//         </aside>
//
//         <main className="flex-1">
//           <div className="flex justify-end mb-4">
//             {/* TODO: Add Sort By (Price, Popularity, Newest) */}
//             <select className="border rounded px-2 py-1 text-sm">
//               <option>Newest</option>
//               <option>Price: Low to High</option>
//               <option>Price: High to Low</option>
//               <option>Most Sold</option>
//             </select>
//           </div>
//
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
//             {/* TODO: Map Product Cards */}
//             <div className="border rounded-lg p-4 text-center text-muted-foreground italic">
//               Loading products... (Implement ProductCard component)
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { productService } from "@/services/products/product.service";
import { CardProductResponse } from "@/types/product";
import { CardProduct } from "@/components/products/CardProduct";

export default function ProductListingPage() {
    const [products, setProducts] = useState<CardProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("newest");

    // Memoize hàm fetch để tránh re-render không cần thiết
    const fetchProducts = useCallback(async (sort: string) => {
        try {
            setLoading(true);
            // Bạn có thể mở rộng productService.getNewestProducts hoặc thêm params sort
            const data = await productService.getNewestProducts();
            // Giả lập sort tại FE nếu BE chưa hỗ trợ tham số sort
            setProducts(data);
        } catch (error) {
            console.error("Lỗi tải trang sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(sortBy);
    }, [sortBy, fetchProducts]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Discover Designs</h1>
            </div>

            <div className="flex gap-8">
                <aside className="w-64 shrink-0 hidden lg:block">
                    {/* Giữ nguyên sidebar */}
                </aside>

                <main className="flex-1">
                    {/* Bổ sung xử lý Sort bằng state */}
                    <div className="flex justify-end mb-6">
                        <select
                            className="border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
                            ))
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <CardProduct key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                                <p className="text-lg">Không tìm thấy sản phẩm nào.</p>
                                <button onClick={() => window.location.reload()} className="mt-4 text-primary underline">Thử lại</button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}