"use client";

import React, { useEffect, useState } from 'react';
import { cartService } from "@/services/cart/cart.service";
import { CartResponse } from "@/types/cart";

export default function Page() {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    // State lưu các ID sản phẩm được tích chọn
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await cartService.getCart();
                setCart(data);
                // Mặc định chọn tất cả khi load xong
                setSelectedIds(data.items.map(item => item.productId));
            } catch (error) {
                console.error("Lỗi tải giỏ hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCart();
    }, []);

    // Toggle chọn sản phẩm
    const toggleSelect = (productId: string) => {
        setSelectedIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Tính tổng giá dựa trên các sản phẩm đã chọn
    const calculateTotal = () => {
        if (!cart) return 0;
        return cart.items
            .filter(item => selectedIds.includes(item.productId))
            .reduce((sum, item) => sum + Number(item.price), 0);
    };

    const handleRemove = async (productId: string) => {
        await cartService.removeItem(productId);
        const updatedCart = await cartService.getCart();
        setCart(updatedCart);
        // Cập nhật lại danh sách chọn sau khi xóa
        setSelectedIds(prev => prev.filter(id => id !== productId));
    };

    if (loading) return <div className="text-center py-20">Đang tải giỏ hàng...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

            {!cart || cart.items.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 mb-4">Giỏ hàng đang trống.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
                                {/* Checkbox chọn sản phẩm */}
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.productId)}
                                    onChange={() => toggleSelect(item.productId)}
                                    className="w-5 h-5 accent-primary"
                                />
                                <img src={item.thumbnailUrl} alt={item.productTitle} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-grow">
                                    <h3 className="font-bold">{item.productTitle}</h3>
                                    <p className="font-semibold text-primary">{item.price.toLocaleString()} VNĐ</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.productId)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl h-fit">
                        <h2 className="font-bold text-lg mb-4">Tổng cộng</h2>
                        <div className="flex justify-between mb-4">
                            <span>Tạm tính ({selectedIds.length} mục)</span>
                            <span className="font-bold">{calculateTotal().toLocaleString()} VNĐ</span>
                        </div>
                        <button
                            disabled={selectedIds.length === 0}
                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 disabled:bg-gray-300"
                        >
                            Thanh toán ({selectedIds.length})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}