"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
    const router = useRouter();

    const menus = [
        {
            title: "Order Management",
            description: "View and manage all customer orders",
            path: "/admin/orders",
        },
        {
            title: "User Management",
            description: "Manage customers, designers, and admins",
            path: "/admin/users",
        },
        {
            title: "Product Management",
            description: "Review and manage marketplace products",
            path: "/admin/products",
        },
        {
            title: "My History & Orders",
            description: "View your personal purchased services and orders",
            path: "/customer",
        },
    ];

    return (
        <div className="mx-auto max-w-6xl p-8">
            <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="mb-8 text-gray-500">
                Manage orders, users, products and your own order history.
            </p>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {menus.map((menu) => (
                    <button
                        key={menu.path}
                        onClick={() => router.push(menu.path)}
                        className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <h2 className="mb-2 text-xl font-semibold">{menu.title}</h2>
                        <p className="text-sm text-gray-500">{menu.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}