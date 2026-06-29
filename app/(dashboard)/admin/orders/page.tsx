"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/order/task.service";
import { AdminTaskListResponse } from "@/types/order";

const PAGE_SIZE = 5;

export default function AdminOrdersPage() {
    const router = useRouter();

    const [orders, setOrders] = useState<AdminTaskListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("ALL");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await taskService.getAdminTasks();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch admin orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const keywordValue = keyword.toLowerCase();

            const matchKeyword =
                order.title.toLowerCase().includes(keywordValue) ||
                order.customerName.toLowerCase().includes(keywordValue) ||
                order.serviceName.toLowerCase().includes(keywordValue);

            const matchStatus = status === "ALL" || order.status === status;

            return matchKeyword && matchStatus;
        });
    }, [orders, keyword, status]);

    const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

    const currentOrders = filteredOrders.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

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
        return <div className="p-6">Loading orders...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 border-r bg-white p-6">
                <h2 className="mb-8 text-2xl font-bold">Dashboard</h2>

                <div className="space-y-2">
                    <button className="w-full rounded-lg bg-black px-4 py-3 text-left text-white">
                        Order Management
                    </button>

                    <button
                        onClick={() => router.push("/admin/users")}
                        className="w-full rounded-lg px-4 py-3 text-left hover:bg-gray-100"
                    >
                        User Management
                    </button>

                    <button
                        onClick={() => router.push("/admin/products")}
                        className="w-full rounded-lg px-4 py-3 text-left hover:bg-gray-100"
                    >
                        Product Management
                    </button>

                    <button
                        onClick={() => router.push("/customer")}
                        className="w-full rounded-lg px-4 py-3 text-left hover:bg-gray-100"
                    >
                        My History & Orders
                    </button>
                </div>
            </aside>

            <main className="flex-1 space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-semibold">Order Management</h1>
                    <p className="text-sm text-gray-500">
                        Manage customer orders and view order details
                    </p>
                </div>

                <div className="flex gap-3">
                    <input
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by title, customer, service..."
                        className="w-full rounded-lg border px-4 py-2"
                    />

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-lg border px-4 py-2"
                    >
                        <option value="ALL">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <div className="overflow-hidden rounded-xl border bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Designer</th>
                            <th className="px-4 py-3">Service</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Created</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {currentOrders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            currentOrders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="px-4 py-3 font-medium">
                                        {order.title}
                                    </td>
                                    <td className="px-4 py-3">{order.customerName}</td>
                                    <td className="px-4 py-3">
                                        {order.designerName || "-"}
                                    </td>
                                    <td className="px-4 py-3">{order.serviceName}</td>
                                    <td className="px-4 py-3">${order.actualPrice}</td>
                                    <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() =>
                                                router.push(`/admin/orders/${order.id}`)
                                            }
                                            className="rounded-lg bg-black px-3 py-2 text-white"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Total: {filteredOrders.length} orders
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-2 text-sm">
                            Page {page} / {totalPages || 1}
                        </span>

                        <button
                            disabled={page === totalPages || totalPages === 0}
                            onClick={() => setPage(page + 1)}
                            className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}