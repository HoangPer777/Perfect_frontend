"use client";

import React, { useEffect, useState } from 'react';
import { cartService } from "@/services/cart/cart.service";
import { CartResponse } from "@/types/cart";
import api from "@/lib/api";
import { Check } from "lucide-react";

export default function Page() {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isPaymentWindowOpen, setIsPaymentWindowOpen] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        setLoading(true);
        try {
            const data = await cartService.getCart();
            setCart(data);
            setSelectedIds(data.items.map(item => item.productId));
        } catch (error) {
            console.error("Lỗi tải giỏ hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (productId: string) => {
        setSelectedIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const calculateTotal = () => {
        if (!cart) return 0;
        return cart.items
            .filter(item => selectedIds.includes(item.productId))
            .reduce((sum, item) => sum + Number(item.price), 0);
    };

    const handlePayment = async () => {
        try {
            const orderResponse = await api.post('/orders/create', { productIds: selectedIds });
            const newOrderId = orderResponse.data.orderId;

            const response = await api.post('/payments/init', {
                orderId: newOrderId,
                amount: Math.round(calculateTotal()),
                provider: 'PAYPAL' // Cố định PayPal
            });

            if (response.data.paymentUrl) {
                window.open(response.data.paymentUrl, '_blank');
                setIsPaymentWindowOpen(true);
            }
        } catch (error) {
            console.error("Lỗi quy trình thanh toán:", error);
            alert("Không thể khởi tạo đơn hàng hoặc thanh toán.");
        }
    };

    const handleRefreshCart = async () => {
        await loadCart();
        setIsPaymentWindowOpen(false);
    };

    const handleRemove = async (productId: string) => {
        await cartService.removeItem(productId);
        await loadCart();
        setSelectedIds(prev => prev.filter(id => id !== productId));
    };

    if (loading) return <div className="text-center py-20">Đang tải giỏ hàng...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

            {!cart || cart.items.length === 0 ? (
                <div className="text-center py-20"><p>Giỏ hàng trống.</p></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.productId} className="flex items-center gap-4 border-b pb-4">
                                <input type="checkbox" checked={selectedIds.includes(item.productId)} onChange={() => toggleSelect(item.productId)} />
                                <img src={item.thumbnailUrl} alt={item.productTitle} className="w-20 h-20 object-cover rounded-lg" />
                                <div className="flex-grow">
                                    <h3 className="font-bold">{item.productTitle}</h3>
                                    <p className="text-primary">{item.price.toLocaleString()} VNĐ</p>
                                </div>
                                <button onClick={() => handleRemove(item.productId)} className="text-red-500 text-sm">Xóa</button>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl h-fit">
                        <h2 className="font-bold mb-4">Tổng cộng</h2>
                        <div className="mb-4 p-2 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium">
                            Phương thức: PayPal
                        </div>
                        <div className="flex justify-between mb-6">
                            <span>Tạm tính</span>
                            <span className="font-bold">{calculateTotal().toLocaleString()} VNĐ</span>
                        </div>
                        <button
                            onClick={handlePayment}
                            disabled={selectedIds.length === 0}
                            className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-950 transition-colors"
                        >
                            Thanh toán qua PayPal
                        </button>

                        {isPaymentWindowOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                                <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full border border-blue-50">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                                        <Check className="w-8 h-8 text-blue-900 animate-pulse" />
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-800 text-center">Đang chờ xác nhận</h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        Vui lòng hoàn tất thanh toán trên tab PayPal vừa mở. Sau đó nhấn nút bên dưới để cập nhật đơn hàng.
                                    </p>
                                    <button
                                        onClick={handleRefreshCart}
                                        className="w-full mt-4 bg-blue-900 hover:bg-blue-950 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-200"
                                    >
                                        Tôi đã thanh toán !
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}