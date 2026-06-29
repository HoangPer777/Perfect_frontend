"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname(); 

    const getLinkClass = (targetPath: string) => {
        const baseClass = "block w-full rounded-lg px-4 py-3 text-left transition-colors duration-200";
        const isActive = pathname === targetPath;

        return isActive
            ? `${baseClass} bg-black text-white font-medium`
            : `${baseClass} text-gray-700 hover:bg-gray-100 hover:text-black`;
    };

    return (
        <aside className="w-64 border-r bg-white p-6 h-screen">
            <h2 className="mb-8 text-2xl font-bold">Dashboard</h2>

            <nav className="space-y-2">
                <Link
                    href="/admin/orders"
                    className={getLinkClass("/admin/orders")}
                >
                    Order Management
                </Link>

                <Link
                    href="/admin/users"
                    className={getLinkClass("/admin/users")}
                >
                    User Management
                </Link>

                <Link
                    href="/admin/products"
                    className={getLinkClass("/admin/products")}
                >
                    Product Management
                </Link>

                <Link
                    href="/customer"
                    className={getLinkClass("/customer")}
                >
                    My History & Orders
                </Link>
            </nav>
        </aside>
    );
}