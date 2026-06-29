// 'use client';
//
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { CartItemResponse } from '@/types/cart';
// import { PageResponse } from "@/types/common/page";
// import { ChevronRight, Trash2, Clock, RefreshCw, ShoppingCart, Loader2 } from 'lucide-react';
// import Image from 'next/image';
// import { cartService } from '@/services/cart/cart.service';
// import Link from "next/link";
// import { useAuthStore } from "@/store/authStore";
// import {useCartStore} from "@/store/cartStore";
//
// export default function CartPage() {
//     const router = useRouter();
//     const { user } = useAuthStore();
//     const [cartData, setCartData] = useState<PageResponse<CartItemResponse> | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const { decrementCount } = useCartStore();
//
//     const size = 10;
//
//     useEffect(() => {
//         const verifyUser = () => {
//             const currentUser = useAuthStore.getState().user; // Lấy giá trị mới nhất trực tiếp từ Store
//             if (!currentUser) {
//                 router.push('/login');
//             } else {
//                 setIsAuthChecked(true);
//             }
//         };
//
//         // Nếu Zustand đã nạp xong dữ liệu từ localStorage lên RAM
//         if (useAuthStore.persist?.hasHydrated?.()) {
//             verifyUser();
//         } else {
//             // Nếu chưa nạp xong (Thường là khi vừa F5), lắng nghe sự kiện nạp xong của Zustand
//             const unsubFinishHydrate = useAuthStore.persist.onFinishHydration(() => {
//                 verifyUser();
//             });
//             return () => unsubFinishHydrate();
//         }
//     }, [user, router]);
//
//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const pageFromUrl = Number(params.get('page')) || 1;
//         setCurrentPage(pageFromUrl);
//     }, [router]);
//
//     useEffect(() => {
//         if (!isAuthChecked || !user) return;
//
//         const loadCartData = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);
//                 const data = await cartService.getCarts(currentPage, size);
//                 setCartData(data);
//             } catch (err: any) {
//                 console.error("Lỗi lấy dữ liệu giỏ hàng:", err);
//                 setError(err?.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại!");
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         loadCartData();
//     }, [currentPage, isAuthChecked, user]);
//
//     // Xử lý chuyển trang
//     const handlePageChange = (newPage: number) => {
//         if (!cartData || newPage < 1 || newPage > cartData.totalPages) return;
//         router.push(`/cart?page=${newPage}`);
//         setCurrentPage(newPage);
//     };
//
//     // Xử lý xóa item
//     const handleDeleteItem = async (id: string) => {
//         if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này khỏi giỏ hàng?")) {
//             try {
//                 const res = await cartService.deleteCartItem(id);
//                 if(res) {
//                     alert(`Xóa thành công item!`);
//                     const data = await cartService.getCarts(currentPage, size);
//                     setCartData(data);
//                     decrementCount();
//                 } else {
//                     alert(`Đã có lỗi khi xóa item!`);
//                 }
//             } catch (err) {
//                 alert("Xóa thất bại, vui lòng kiểm tra lại!");
//             }
//         }
//     };
//
//     const formatPrice = (price: number) => {
//         return new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'USD',
//         }).format(price);
//     };
//
//     const getPackageBadgeClass = (type: string) => {
//         switch (type) {
//             case 'VIP': return 'bg-purple-100 text-purple-700 font-semibold';
//             case 'PRO': return 'bg-blue-100 text-blue-700 font-semibold';
//             case 'BASIC': return 'bg-gray-100 text-gray-700 font-semibold';
//             default: return 'bg-amber-100 text-amber-700 font-semibold';
//         }
//     };
//
//     // Hiện màn hình loading cho đến khi xác thực xong xuôi dữ liệu User từ LocalStorage
//     if (!isAuthChecked || loading) {
//         return (
//             <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
//                 <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
//                 <p className="text-sm text-slate-500 font-medium">Loading your cart...</p>
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
//                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center max-w-sm">
//                     <p className="text-rose-500 font-semibold mb-3">Đã xảy ra lỗi</p>
//                     <p className="text-sm text-slate-500 mb-4">{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
//                     >
//                         Thử lại
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     const items = cartData?.content || [];
//
//     return (
//         <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] py-10 px-4 md:px-10">
//             <div className="max-w-4xl mx-auto">
//
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] flex items-center gap-2">
//                         <ShoppingCart className="w-8 h-8 text-indigo-600" />
//                         My Shopping Cart
//                     </h1>
//                     <p className="text-sm text-slate-500 mt-2">
//                         Review your selected photo editing service packages and complete your order seamlessly.
//                     </p>
//                 </div>
//
//                 {/* Tab Filter */}
//                 <div className="flex border-b border-slate-200 mb-6 text-sm font-medium overflow-x-auto gap-6">
//                     <button className="border-b-2 border-indigo-600 py-3 text-indigo-600 px-1 whitespace-nowrap">
//                         All Items ({cartData?.totalElements || 0})
//                     </button>
//                 </div>
//
//                 {/* Empty State */}
//                 {items.length === 0 ? (
//                     <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
//                         <p className="text-slate-400 font-medium">Giỏ hàng của bạn hiện đang trống.</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {/* List Cart Items */}
//                         {items.map((item) => (
//                             <div
//                                 key={item.id}
//                                 className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200"
//                             >
//                                 <div className="flex items-center gap-4 flex-1">
//                                     <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
//                                         <Image
//                                             src={item.product.thumbnailUrl || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500'}
//                                             alt={item.product.title}
//                                             fill
//                                             className="object-cover"
//                                         />
//                                     </div>
//
//                                     <div className="space-y-1 min-w-0">
//                                         <h3 className="font-semibold text-slate-800 text-base truncate max-w-xs md:max-w-md">
//                                             {item.product.title}
//                                         </h3>
//                                         <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
//                                             <Link
//                                                 href={`/designer/${item.product.designerId}`}
//                                                 className="font-medium text-slate-700 hover:underline hover:text-purple-500 hover:decoration-purple-500 hover:underline-offset-2 transition-all"
//                                             >
//                                                 Designer: @{item.product.designerUsername}
//                                             </Link>
//                                             <span className="text-slate-300">|</span>
//                                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.deliveryDays}d delivery</span>
//                                             <span className="text-slate-300">|</span>
//                                             <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {item.revisionsLimit} revs</span>
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
//                                     <div className="text-left sm:text-right space-y-1.5">
//                                         <span className={`inline-block px-3 py-1 rounded-full text-[11px] uppercase tracking-wide ${getPackageBadgeClass(item.packageType)}`}>
//                                             {item.packageType}
//                                         </span>
//                                         <div className="text-xs text-slate-400 font-medium">{item.title}</div>
//                                     </div>
//
//                                     <div className="flex items-center gap-4">
//                                         <div className="text-right">
//                                             <span className="text-xs text-slate-400 block uppercase font-medium">Amount</span>
//                                             <span className="text-xl font-bold text-indigo-600">{formatPrice(item.price)}</span>
//                                         </div>
//
//                                         <div className="flex items-center gap-1">
//                                             <button
//                                                 onClick={() => handleDeleteItem(item.id)}
//                                                 className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
//                                                 title="Xóa khỏi giỏ hàng"
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                             </button>
//                                             <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-colors hidden sm:block">
//                                                 <ChevronRight className="w-5 h-5" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//
//                         {/* Điều hướng phân trang */}
//                         {cartData && cartData.totalPages > 1 && (
//                             <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-6 text-sm text-slate-500">
//                                 <div>
//                                     Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{cartData.totalPages}</span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button
//                                         onClick={() => handlePageChange(currentPage - 1)}
//                                         disabled={currentPage === 1}
//                                         className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
//                                     >
//                                         Previous
//                                     </button>
//                                     <button
//                                         onClick={() => handlePageChange(currentPage + 1)}
//                                         disabled={currentPage === cartData.totalPages}
//                                         className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
//                                     >
//                                         Next
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartResponse, CartItemResponse } from '@/types/cart';
import { ChevronRight, Trash2, ShoppingCart, Loader2, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { cartService } from '@/services/cart/cart.service'; // Đảm bảo đúng đường dẫn tới service của bạn
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";

export default function CartPage() {
    const router = useRouter();
    const { user } = useAuthStore();

    // Thay đổi kiểu dữ liệu từ PageResponse sang CartResponse dựa trên interface thật của bạn
    const [cartData, setCartData] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
    const { decrementCount } = useCartStore();

    useEffect(() => {
        const verifyUser = () => {
            const currentUser = useAuthStore.getState().user;
            if (!currentUser) {
                router.push('/login');
            } else {
                setIsAuthChecked(true);
            }
        };

        if (useAuthStore.persist?.hasHydrated?.()) {
            verifyUser();
        } else {
            const unsubFinishHydrate = useAuthStore.persist.onFinishHydration(() => {
                verifyUser();
            });
            return () => unsubFinishHydrate();
        }
    }, [user, router]);

    // Hàm load dữ liệu giỏ hàng (Đổi từ getCarts sang getCart theo Service của bạn)
    const loadCartData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await cartService.getCart(); // Gọi đúng hàm getCart() không phân trang
            setCartData(data);
        } catch (err: any) {
            console.error("Lỗi lấy dữ liệu giỏ hàng:", err);
            setError(err?.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthChecked || !user) return;
        loadCartData();
    }, [isAuthChecked, user]);

    // Xử lý xóa item (Đổi từ deleteCartItem sang removeItem theo Service của bạn)
    const handleDeleteItem = async (productId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này khỏi giỏ hàng?")) {
            try {
                // Sử dụng removeItem dựa trên productId
                await cartService.removeItem(productId);
                alert(`Xóa thành công sản phẩm khỏi giỏ hàng!`);
                decrementCount();
                // Tải lại giỏ hàng sau khi xóa thành công
                await loadCartData();
            } catch (err) {
                alert("Xóa thất bại, vui lòng kiểm tra lại!");
            }
        }
    };

    // XỬ LÝ KHỞI TẠO THANH TOÁN (Giải quyết dứt điểm lỗi 500)
    // const handleCheckout = async () => {
    //     if (!cartData || !cartData.items || cartData.items.length === 0) return;
    //
    //     try {
    //         setCheckoutLoading(true);
    //
    //         // Cấu trúc lại danh sách vật phẩm gửi đi khớp với Backend DTO mong đợi
    //         const checkoutItems = cartData.items.map(item => {
    //             return {
    //                 productId: item.productId,
    //                 // Nếu sản phẩm này thuộc Loại 2 (Dịch vụ/Gói) thì Backend cần ID gói để chạy .getPrice()
    //                 // Dựa trên dữ liệu thực tế, nếu cartItemId chính là ID gói của bạn, hãy giữ nguyên.
    //                 // Nếu không cần phân loại gói riêng biệt, bạn có thể truyền item.cartItemId làm định danh.
    //                 servicePackageId: item.cartItemId || null,
    //                 quantity: item.quantity || 1
    //             };
    //         });
    //
    //         console.log("Payload thanh toán gửi đi:", { items: checkoutItems });
    //
    //         const response = await api.post('/payments/init', {
    //             items: checkoutItems
    //         });
    //
    //         if (response.data && response.data.paymentUrl) {
    //             window.location.href = response.data.paymentUrl;
    //         } else {
    //             alert("Không nhận được liên kết thanh toán hợp lệ từ hệ thống Backend!");
    //         }
    //     } catch (err: any) {
    //         console.error("Lỗi quy trình thanh toán:", err);
    //         alert(err?.response?.data?.message || "Khởi tạo quy trình thanh toán thất bại!");
    //     } finally {
    //         setCheckoutLoading(false);
    //     }
    // };

    const handleCheckout = async () => {
        // Kiểm tra giỏ hàng hợp lệ trước khi xử lý
        if (!cartData || !cartData.items || cartData.items.length === 0) return;

        try {
            setCheckoutLoading(true);

            // 1. Tạo mảng productIds đồng bộ
            const productIds = cartData.items.map(item => item.productId);

            // 2. Tạo mảng servicePackageIds đồng bộ theo chỉ mục (Index)
            // Nếu item là Sản phẩm thường (không có gói dịch vụ), ta truyền null.
            // Giả định dựa trên logic trước của bạn: trường `cartItemId` đang lưu ID gói dịch vụ,
            // hoặc nếu giỏ hàng của bạn phân biệt bằng loại sản phẩm (TYPE_SERVICE), bạn có thể check điều kiện.
            const servicePackageIds = cartData.items.map(item => {
                // Trường hợp 1: Nếu mọi item dịch vụ dùng cartItemId làm ID gói, sản phẩm thường cũng có cartItemId nhưng không khớp trong bảng service_packages (Backend của chúng ta đã có cơ chế .isPresent() để bỏ qua an toàn)
                return item.cartItemId || null;

                // Trường hợp 2 (Nếu bạn có trường phân biệt):
                // return item.productType === 'SERVICE' ? item.cartItemId : null;
            });

            // Tạo payload đúng cấu trúc DTO mới của Backend (OrderCreateRequest)
            const orderPayload = {
                productIds: productIds,
                servicePackageIds: servicePackageIds
            };

            console.log("==> [UI] Gửi yêu cầu tạo đơn hàng tích hợp:", orderPayload);

            // 3. Gọi API tạo Đơn hàng (Khớp với OrderController.java)
            const orderResponse = await api.post('/api/v1/orders/create', orderPayload);

            // Lấy orderId từ cấu trúc Map.of("orderId", orderId) của Backend trả về
            const orderId = orderResponse.data?.orderId;

            if (!orderId) {
                throw new Error("Hệ thống Backend không khởi tạo được mã đơn hàng (orderId) hợp lệ!");
            }

            console.log("==> [UI] Tạo đơn hàng thành công. Tiến hành thanh toán cho Order ID =", orderId);

            // 4. Khởi tạo quy trình cổng thanh toán (Khớp với PaymentInitRequest.java)
            const paymentPayload = {
                orderId: orderId,              // ID đơn hàng vừa tạo ở trên
                amount: cartData.totalPrice,   // Tổng số tiền từ Giỏ hàng (đã được tính toán trên giao diện)
                provider: "PAYPAL"              // Cổng thanh toán (VNPAY, MOMO, PAYPAL...) tùy cấu hình hệ thống
            };

            console.log("==> [UI] Gửi payload khởi tạo cổng thanh toán:", paymentPayload);
            const paymentResponse = await api.post('/api/v1/payments/init', paymentPayload);

            // 5. Điều hướng người dùng sang trang thanh toán của bên thứ ba
            if (paymentResponse.data && paymentResponse.data.paymentUrl) {
                window.location.href = paymentResponse.data.paymentUrl;
            } else {
                alert("Không nhận được liên kết thanh toán (paymentUrl) hợp lệ từ cổng thanh toán!");
            }

        } catch (err: any) {
            console.error("Lỗi quy trình tạo đơn hàng / thanh toán phía UI:", err.response?.data || err);
            alert(
                err.response?.data?.message ||
                err.message ||
                "Không thể hoàn tất quy trình thanh toán. Vui lòng kiểm tra lại cấu trúc dữ liệu!"
            );
        } finally {
            setCheckoutLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VNĐ',
        }).format(price);
    };

    if (!isAuthChecked || loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="text-sm text-slate-500 font-medium">Loading your cart...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center max-w-sm">
                    <p className="text-rose-500 font-semibold mb-3">Đã xảy ra lỗi</p>
                    <p className="text-sm text-slate-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // Lấy mảng items từ cartData.items theo interface mới của bạn
    const items = cartData?.items || [];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] py-10 px-4 md:px-10">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-[#0f172a] flex items-center gap-2">
                        <ShoppingCart className="w-8 h-8 text-indigo-600" />
                        My Shopping Cart
                    </h1>
                    <p className="text-sm text-slate-500 mt-2">
                        Review your selected photo editing service packages and complete your order seamlessly.
                    </p>
                </div>

                {/* Tab Filter */}
                <div className="flex border-b border-slate-200 mb-6 text-sm font-medium overflow-x-auto gap-6">
                    <button className="border-b-2 border-indigo-600 py-3 text-indigo-600 px-1 whitespace-nowrap">
                        All Items ({items.length})
                    </button>
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100">
                        <p className="text-slate-400 font-medium">Giỏ hàng của bạn hiện đang trống.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* List Cart Items */}
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.cartItemId} // Sửa thành item.cartItemId
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-200"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                                            <Image
                                                src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500'} // Sử dụng trực tiếp item.thumbnailUrl
                                                alt={item.productTitle || 'Product'} // Sử dụng trực tiếp item.productTitle
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="space-y-1 min-w-0">
                                            <h3 className="font-semibold text-slate-800 text-base truncate max-w-xs md:max-w-md">
                                                {item.productTitle} {/* Sử dụng item.productTitle */}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                <span className="font-medium text-slate-600">
                                                    Qty: {item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <span className="text-xs text-slate-400 block uppercase font-medium">Amount</span>
                                                <span className="text-xl font-bold text-indigo-600">{formatPrice(item.price * item.quantity)}</span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleDeleteItem(item.productId)} // Truyền item.productId vào hàm xóa
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Xóa khỏi giỏ hàng"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-colors hidden sm:block">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TỔNG TIỀN & NÚT THANH TOÁN CHECKOUT */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                            <div>
                                <span className="text-sm text-slate-400 block font-medium">Total Summary ({items.length} items)</span>
                                <span className="text-2xl font-black text-indigo-600">
                                    {formatPrice(cartData?.totalPrice || 0)} {/* Dùng trực tiếp cartData.totalPrice */}
                                </span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={checkoutLoading}
                                className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none text-base"
                            >
                                {checkoutLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Proceed to Checkout
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}