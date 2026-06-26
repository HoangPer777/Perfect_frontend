"use client";

import React from 'react';

// 1. Định nghĩa kiểu dữ liệu
export interface OrderItem {
    orderItemId: string;
    productTitle: string;
    priceAtPurchase: number;
}

export interface Order {
    orderId: string;
    purchaseDate: string;
    items: OrderItem[];
}

interface Props {
    orders: Order[];
}

// 2. Component hoàn thiện
const ProductOrderHistory: React.FC<Props> = ({ orders }) => {
    // Xử lý trường hợp không có đơn hàng
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">
                <p>Bạn chưa mua sản phẩm nào.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <div key={order.orderId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between border-b pb-4 mb-4">
                        <span className="text-gray-500 text-sm">
                            Mã đơn: <span className="font-mono text-gray-700">{order.orderId.substring(0, 8)}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-600">
                            {new Date(order.purchaseDate).toLocaleDateString('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.orderItemId} className="flex justify-between items-center">
                                <span className="text-gray-800 text-sm md:text-base">{item.productTitle}</span>
                                <span className="font-bold text-primary whitespace-nowrap ml-4">
                                    {item.priceAtPurchase.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductOrderHistory;