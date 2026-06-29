"use client";

import { useEffect, useState } from "react";
import {notFound, useRouter} from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SnapshotUserResponse } from "@/types/admin";
import { authService } from "@/services/auth.service";
import {useAuthStore} from "@/store/authStore";

const PAGE_SIZE = 5;

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<SnapshotUserResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // State quản lý Filters (gửi lên Server)
    const [usernameKeyword, setUsernameKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    
    // Fetch dữ liệu mỗi khi page, role hoặc username keyword thay đổi
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await authService.getAdminUsers({
                    role: roleFilter,
                    username: usernameKeyword,
                    page: page,
                    size: PAGE_SIZE,
                });
                setUsers(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } catch (error) {
                console.error("Failed to fetch admin users", error);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [page, roleFilter, usernameKeyword]);

    const getStatusClass = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700";
            case "INACTIVE":
                return "bg-yellow-100 text-yellow-700";
            case "BANNED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    /**
     * Hàm hiển thị danh sách các vai trò dựa trên độ ưu tiên:
     * ADMIN > DESIGNER > CUSTOMER
     */
    const renderSortedRoles = (roleNames: string[] | undefined) => {
        if (!roleNames || roleNames.length === 0) return <span className="text-gray-400">-</span>;

        // Trọng số ưu tiên (Số càng nhỏ càng ưu tiên hiển thị trước)
        const rolePriority: Record<string, number> = {
            "ROLE_ADMIN": 1,
            "ROLE_DESIGNER": 2,
            "ROLE_CUSTOMER": 3
        };

        // Tạo bản sao và sắp xếp
        const sorted = [...roleNames].sort((a, b) => {
            const priorityA = rolePriority[a] || 99;
            const priorityB = rolePriority[b] || 99;
            return priorityA - priorityB;
        });

        // Định dạng text hiển thị thân thiện (Bỏ chữ ROLE_)
        return (
            <div className="flex flex-wrap gap-1">
                {sorted.map((role) => {
                    let badgeColor = "bg-gray-100 text-gray-800";
                    let displayName = role.replace("ROLE_", "");

                    if (role === "ROLE_ADMIN") badgeColor = "bg-purple-100 text-purple-800 font-semibold";
                    if (role === "ROLE_DESIGNER") badgeColor = "bg-indigo-100 text-indigo-800";
                    if (role === "ROLE_CUSTOMER") badgeColor = "bg-orange-100 text-orange-800";

                    return (
                        <span key={role} className={`rounded px-2 py-0.5 text-xs ${badgeColor}`}>
                            {displayName}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-semibold">User Management</h1>
                    <p className="text-sm text-gray-500">
                        Manage system users, view system roles and profiles
                    </p>
                </div>

                {/* Khu vực Bộ lọc (Filter Bar) */}
                <div className="flex gap-3">
                    <input
                        value={usernameKeyword}
                        onChange={(e) => {
                            setUsernameKeyword(e.target.value);
                            setPage(1); // Reset về trang 1 khi tìm kiếm mới
                        }}
                        placeholder="Search by username..."
                        className="w-full rounded-lg border px-4 py-2"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setPage(1); // Reset về trang 1 khi đổi role
                        }}
                        className="rounded-lg border px-4 py-2 min-w-[150px]"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ROLE_ADMIN">Admin</option>
                        <option value="ROLE_CUSTOMER">Customer</option>
                        <option value="ROLE_DESIGNER">Designer</option>
                    </select>
                </div>

                {/* Bảng danh sách hiển thị */}
                <div className="overflow-hidden rounded-xl border bg-white">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading users data...</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="px-4 py-3">Full Name</th>
                                <th className="px-4 py-3">Username</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Roles</th> {/* Thêm cột Roles ở đây */}
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="border-t hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-medium">
                                            {user.fullName || "-"}
                                        </td>
                                        <td className="px-4 py-3">@{user.username}</td>
                                        <td className="px-4 py-3">{user.email}</td>
                                        <td className="px-4 py-3">
                                            {renderSortedRoles(user.roles.map(r => r.name))}
                                        </td>
                                        <td className="px-4 py-3">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(user.status)}`}>
                                                    {user.status}
                                                </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => router.push(`/admin/users/${user.id}`)}
                                                className="rounded-lg bg-black px-3 py-2 text-white hover:bg-gray-800 transition-colors"
                                            >
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Thanh điều hướng Phân trang */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Total: {totalElements} users
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage(page - 1)}
                            className="rounded-lg border px-3 py-2 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-2 text-sm">
                            Page {page} / {totalPages || 1}
                        </span>

                        <button
                            disabled={page === totalPages || totalPages === 0 || loading}
                            onClick={() => setPage(page + 1)}
                            className="rounded-lg border px-3 py-2 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}