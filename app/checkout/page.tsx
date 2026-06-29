"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Loader2, ShoppingBag } from "lucide-react";

import api from "@/lib/api";
import { cartService } from "@/services/cart/cart.service";
import { useAuthStore } from "@/store/authStore";
import type { CartResponse } from "@/types/cart";

export default function CheckoutPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const verifyUser = () => {
            if (!useAuthStore.getState().user) {
                router.push("/login");
                return;
            }

            setAuthReady(true);
        };

        if (useAuthStore.persist?.hasHydrated?.()) {
            verifyUser();
        } else {
            return useAuthStore.persist.onFinishHydration(verifyUser);
        }
    }, [router, user]);

    useEffect(() => {
        if (!authReady) return;

        const loadCart = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await cartService.getCart();
                setCart(data);
            } catch (err: any) {
                setError(err?.response?.data?.message || "Unable to load your cart.");
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [authReady]);

    const total = useMemo(() => {
        if (!cart) return 0;
        return cart.totalPrice || cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(price);

    const handlePayment = async () => {
        if (!cart || cart.items.length === 0) return;

        try {
            setPaying(true);

            const orderResponse = await api.post("/orders/create", {
                productIds: cart.items.map((item) => item.productId),
                servicePackageIds: cart.items.map((item) => item.cartItemId || null),
            });

            const orderId = orderResponse.data?.orderId;
            if (!orderId) {
                throw new Error("Order was created without a valid orderId.");
            }

            const paymentResponse = await api.post("/payments/init", {
                orderId,
                amount: Math.round(total),
                provider: "PAYPAL",
            });

            const paymentUrl = paymentResponse.data?.paymentUrl;
            if (!paymentUrl) {
                throw new Error("Payment gateway did not return a paymentUrl.");
            }

            window.location.href = paymentUrl;
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message || "Unable to start payment.");
        } finally {
            setPaying(false);
        }
    };

    if (!authReady || loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex items-center gap-3 text-slate-600">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                    <span className="text-sm font-medium">Loading checkout...</span>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <section className="w-full max-w-md rounded-lg border border-rose-100 bg-white p-6 text-center shadow-sm">
                    <p className="font-semibold text-rose-600">Checkout unavailable</p>
                    <p className="mt-2 text-sm text-slate-500">{error}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Try again
                    </button>
                </section>
            </main>
        );
    }

    const items = cart?.items || [];

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-10">
            <div className="mx-auto max-w-6xl">
                <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600">
                    <ArrowLeft className="h-4 w-4" />
                    Back to cart
                </Link>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <ShoppingBag className="h-6 w-6 text-indigo-600" />
                            <div>
                                <h1 className="text-2xl font-bold">Checkout</h1>
                                <p className="text-sm text-slate-500">{items.length} item(s) ready for payment</p>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div className="py-16 text-center text-slate-500">Your cart is empty.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {items.map((item) => (
                                    <div key={item.cartItemId || item.productId} className="flex gap-4 py-4">
                                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                            <Image
                                                src={item.thumbnailUrl || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500"}
                                                alt={item.productTitle || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate font-semibold">{item.productTitle}</h2>
                                            <p className="mt-1 text-sm text-slate-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right font-bold text-indigo-600">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="h-fit rounded-lg border border-slate-100 bg-white p-5 shadow-sm">
                        <h2 className="font-bold">Order summary</h2>
                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between text-slate-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-800">{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                                <span>Payment method</span>
                                <span className="font-semibold text-slate-800">PayPal</span>
                            </div>
                        </div>
                        <div className="mt-5 border-t border-slate-100 pt-5">
                            <div className="flex justify-between text-base font-bold">
                                <span>Total</span>
                                <span className="text-indigo-600">{formatPrice(total)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={handlePayment}
                                disabled={items.length === 0 || paying}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {paying ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                                {paying ? "Processing..." : "Pay with PayPal"}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
