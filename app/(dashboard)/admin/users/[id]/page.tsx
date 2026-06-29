"use client";

import { useEffect, useState } from "react";
import {notFound, useParams, useRouter} from "next/navigation";
import { UserInfoResponse, Role } from "@/types/admin";
import { authService } from "@/services/auth.service";
import {useAuthStore} from "@/store/authStore";

export default function AdminUserDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [user, setUser] = useState<UserInfoResponse | null>(null);
    const [systemRoles, setSystemRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    useEffect(() => {
        const initData = async () => {
            if (!id) return;
            try {
                // 1. Lấy thông tin chi tiết User từ API thực tế
                const userData = await authService.getAdminUserInfo(id);
                setUser(userData);

                const rolesData = await authService.getAllRoles();
                setSystemRoles(rolesData);
            } catch (error) {
                console.error("Failed to fetch admin user details", error);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, [id]);

    // Xử lý bật/tắt (Multi-select) cập nhật trực tiếp mảng các Role thực
    const handleToggleRole = async (targetRole: Role) => {
        if (!user || updating) return;

        const isAssigned = user.roles.some((r) => r.name === targetRole.name);
        let updatedRoles: Role[] = [];

        if (isAssigned) {
            if (user.roles.length === 1) {
                alert("User must retain at least one role!");
                return;
            }
            updatedRoles = user.roles.filter((r) => r.name !== targetRole.name);
        } else {
            updatedRoles = [...user.roles, targetRole];
        }

        setUpdating(true);
        try {
            const res = await authService.updateUserRole({
                userId: id,
                roleId: targetRole.id
            });
            if(res) setUser({ ...user, roles: updatedRoles });
            alert("Update role success.");
        } catch (error) {
            console.error("Failed to sync roles data with server", error);
            alert("Role sync failed.");
        } finally {
            setUpdating(false);
        }
    };

    const handleToggleStatus = async (status: string) => {
        if (!user || updating) return;

        if (!window.confirm(`Confirm changing account status to ${status}?`)) return;

        setUpdating(true);
        try {
            const res =  await authService.updateUserStatus({
                userId: id,
                status: status
            });
            if(res) setUser({ ...user, status: status });
        } catch (error) {
            console.error("Status modification failed", error);
        } finally {
            setUpdating(false);
        }
    };
    if (loading) return <div className="p-8">Loading user profile...</div>;
    if (!user) return <div className="p-8 text-red-500">User not found!</div>;

    const skillsArray = user.skills ? user.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-800">
            <main className="flex-1 p-8 max-w-7xl mx-auto space-y-4">

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
                    >
                        ← Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center relative">
                            {user.isVerified && (
                                <span className="absolute top-6 right-6 text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-0.5 rounded-full">
                                    ✓ Verified
                                </span>
                            )}

                            <div className="relative w-24 h-24 mb-4">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.fullName || user.username}
                                        className="w-full h-full object-cover rounded-full border bg-gray-50"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#4f6d7a] to-[#6b5b95] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-sm border bg-gray-50 shrink-0 select-none">
                                        {user.username
                                            ? user.username.substring(0, 2)
                                            : (user.fullName ? user.fullName.substring(0, 2) : "US")
                                        }
                                    </div>
                                )}
                                <span className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                            </div>

                            <h2 className="text-xl font-bold text-center">{user.fullName || "No Full Name"}</h2>
                            <p className="text-sm text-gray-400 mb-6">@{user.username}</p>

                            {/* CHỌN NHIỀU ROLE QUA CHECKBOX ĐỘNG */}
                            <div className="w-full border-t border-b border-gray-100 py-4 mb-6 text-left">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                                    Assign User Roles
                                </label>
                                <div className="space-y-2.5">
                                    {systemRoles.map((role) => {
                                        const isChecked = user.roles.some((r) => r.name === role.name);

                                        return (
                                            <label key={role.id || role.name} className="flex items-center gap-3 cursor-pointer text-sm font-medium hover:text-black">
                                                <input
                                                    type="checkbox"
                                                    disabled={updating}
                                                    checked={isChecked}
                                                    onChange={() => handleToggleRole(role)}
                                                    className="w-4 h-4 rounded text-black focus:ring-black border-gray-300 accent-black"
                                                />
                                                {role.name.replace("ROLE_", "")}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Nhóm Button hành động thực tế */}
                            <div className="w-full space-y-3">
                                {/* Nút 1: Nhắn tin */}
                                <button className="w-full bg-[#52527a] text-white font-medium py-2.5 px-4 rounded-xl hover:bg-[#434366] transition text-sm">
                                    Message
                                </button>

                                {/* Nút 2: Vô hiệu hóa (ACTIVE <-> INACTIVE) */}
                                <button
                                    disabled={updating}
                                    onClick={() => handleToggleStatus(user.status === "INACTIVE" ? "ACTIVE" : "INACTIVE")}
                                    className={`w-full font-medium py-2.5 px-4 rounded-xl transition border text-sm ${
                                        user.status === "INACTIVE"
                                            ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                    }`}
                                >
                                    {user.status === "INACTIVE" ? "Activate Account" : "Deactivate Account"}
                                </button>

                                <button
                                    disabled={updating}
                                    onClick={() => handleToggleStatus(user.status === "BANNED" ? "ACTIVE" : "BANNED")}
                                    className={`w-full font-medium py-2.5 px-4 rounded-xl transition border text-sm ${
                                        user.status === "BANNED"
                                            ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                            : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                                    }`}
                                >
                                    {user.status === "BANNED" ? "Unban Account" : "Ban Account"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: HIỂN THỊ TOÀN BỘ DATA THỰC TẾ --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                            <h3 className="text-lg font-bold border-b pb-3">User Profile Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block uppercase">User ID</span>
                                    <span className="font-mono text-xs text-gray-600">{user.id}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block uppercase">Email Address</span>
                                    <span className="font-medium text-gray-900">{user.email}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block uppercase">Account Created</span>
                                    <span className="font-medium text-gray-900">
                                        {new Date(user.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-400 block uppercase">Current Status</span>
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {user.status}
                                    </span>
                                </div>
                                {user.city && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 block uppercase">City</span>
                                        <span className="font-medium text-gray-900">{user.city}</span>
                                    </div>
                                )}
                                {user.detailedAddress && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 block uppercase">Detailed Address</span>
                                        <span className="font-medium text-gray-900">{user.detailedAddress}</span>
                                    </div>
                                )}
                                {user.specialization && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 block uppercase">Specialization</span>
                                        <span className="text-purple-700 font-semibold">{user.specialization}</span>
                                    </div>
                                )}
                                {user.experienceYears > 0 && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 block uppercase">Experience Years</span>
                                        <span className="font-medium text-gray-900">{user.experienceYears} Years</span>
                                    </div>
                                )}
                            </div>

                            {user.bio && (
                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Biography</span>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl italic leading-relaxed">
                                        "{user.bio}"
                                    </p>
                                </div>
                            )}

                            {skillsArray.length > 0 && (
                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block uppercase mb-2">Skills & Expertise</span>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsArray.map((skill) => (
                                            <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {user.portfolioUrl && (
                                <div className="pt-4 border-t border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 block uppercase mb-1">Portfolio Link</span>
                                    <a
                                        href={user.portfolioUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm text-indigo-600 font-medium hover:underline inline-flex items-center gap-1 break-all"
                                    >
                                        🔗 {user.portfolioUrl}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}