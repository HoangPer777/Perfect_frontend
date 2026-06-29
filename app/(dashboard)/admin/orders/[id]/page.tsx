"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { taskService } from "@/services/order/task.service";
import { AdminTaskDetailResponse } from "@/types/order";

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();

    const [order, setOrder] = useState<AdminTaskDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await taskService.getAdminTaskDetail(params.id as string);
                setOrder(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params.id]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "PROCESSING":
                return "bg-blue-100 text-blue-700";
            case "REVIEWING":
                return "bg-purple-100 text-purple-700";
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!order) {
        return <div className="p-8">Order not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="mx-auto max-w-6xl px-6 py-8">
                <button
                    onClick={() => router.back()}
                    className="mb-5 text-sm text-purple-600 hover:underline"
                >
                    ← Back
                </button>

                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Order Detail</p>
                        <h1 className="mt-1 text-3xl font-bold">{order.title}</h1>
                    </div>

                    <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusClass(
                            order.status
                        )}`}
                    >
                        {order.status}
                    </span>
                </div>

                <section className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Info title="Customer" value={order.customerName} />
                        <Info title="Customer Email" value={order.customerEmail} />
                        <Info title="Designer" value={order.designerName ?? "-"} />

                        <Info title="Service" value={order.serviceName} />
                        <Info title="Price" value={`$${order.actualPrice}`} />
                        <Info title="Revisions Left" value={String(order.revisionsLeft)} />

                        <Info
                            title="Created At"
                            value={new Date(order.createdAt).toLocaleString()}
                        />
                        <Info
                            title="Started At"
                            value={
                                order.startedAt
                                    ? new Date(order.startedAt).toLocaleString()
                                    : "— Not started"
                            }
                        />
                        <Info
                            title="Completed At"
                            value={
                                order.completedAt
                                    ? new Date(order.completedAt).toLocaleString()
                                    : "— Not completed"
                            }
                        />
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <h3 className="mb-3 font-semibold">Project Brief</h3>
                        <div className="rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
                            {order.briefText}
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <div className="h-56 bg-gradient-to-br from-gray-900 via-gray-700 to-purple-900" />
                    </div>

                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold">Order Support</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            This order was created for admin review. If there is any
                            issue, contact the designer or customer for more details.
                        </p>

                        <button className="mt-5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                            Contact Designer
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

function Info({ title, value }: { title: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase text-gray-400">{title}</p>
            <p className="mt-2 font-medium text-gray-900">{value}</p>
        </div>
    );
}