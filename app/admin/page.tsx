"use client"
import React, { useState } from 'react';
import { Search, MoreVertical, Shield, User, Star, SlidersHorizontal } from 'lucide-react';
import {SnapshotUserResponse} from "@/types/admin";

const mockUsers: SnapshotUserResponse[] = [
    {
        id: "1",
        fullName: "Alex Rivera", // Bổ sung để hiển thị UI
        email: "alex.rivera@luminescent.studio",
        username: "alex_rivera",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        status: "Active",
        roles: [{ id: 1, name: "Designer" }],
        createdAt: "2023-10-24T00:00:00Z"
    },
    {
        id: "2",
        fullName: "Elena Vance",
        email: "elena.v@designco.com",
        username: "elena_vance",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        status: "Inactive",
        roles: [{ id: 2, name: "Customer" }],
        createdAt: "2024-01-12T00:00:00Z"
    },
    {
        id: "3",
        fullName: "Jordan Black",
        email: "j.black@luminescent.studio",
        username: "jordan_black",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        status: "Active",
        roles: [{ id: 3, name: "Admin" }],
        createdAt: "2022-11-05T00:00:00Z"
    }
];

export default function UserManagement() {
    const [keyword, setKeyword] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'designer' | 'admin'>('all');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    // Hàm helper định dạng badge cho Role giống UI mẫu
    const getRoleBadge = (roles: any[]) => {
        const roleName = roles[0]?.name?.toLowerCase() || 'customer';
        switch (roleName) {
            case 'admin':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <Shield size={12} className="text-blue-500" /> Admin
          </span>
                );
            case 'designer':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            <Star size={12} className="text-amber-500 fill-amber-500" /> Designer
          </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            <User size={12} className="text-purple-500" /> Customer
          </span>
                );
        }
    };

    // Hàm format ngày tháng hiển thị ra table
    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Logic chọn checkbox hàng loạt
    const handleSelectUser = (id: string) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
            {/* 1. Header & Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
                <p className="text-slate-500 mt-1">Oversee and manage your studio's ecosystem.</p>
            </div>

            {/* 2. Thống kê Stats Cards Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { title: "Total Users", value: "15.4k", change: "+12%", isPositive: true },
                    { title: "Active Now", value: "842", isLive: true },
                    { title: "New Designers", value: "240", tag: "This Month" },
                    { title: "Churn Rate", value: "2.4%", change: "-0.5%", isPositive: false }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <span className="text-sm font-medium text-slate-400">{stat.title}</span>
                        <div className="flex items-baseline justify-between mt-3">
                            <span className="text-3xl font-bold text-slate-800">{stat.value}</span>
                            {stat.change && (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.change}
                </span>
                            )}
                            {stat.isLive && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                            {stat.tag && <span className="text-[11px] font-medium px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">{stat.tag}</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Bộ lọc Tabs (All Users, Customers...) */}
            <div className="flex gap-3 mb-6">
                {[
                    { id: 'all', label: 'All Users' },
                    { id: 'customer', label: 'Customers (11.5k)' },
                    { id: 'designer', label: 'Designers (1.2k)' },
                    { id: 'admin', label: 'Admins (42)' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 4. Bộ lọc tìm kiếm & Action Bars */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                    <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
              <Search size={18} />
            </span>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400"
                            placeholder="Search by name, email or ID..."
                        />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <button className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600">
                            <SlidersHorizontal size={16} />
                        </button>
                    </div>
                </div>

                {/* 5. Data Table hiển thị danh sách */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/70 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                            <th className="py-4 px-6 w-12">
                                <input
                                    type="checkbox"
                                    className="rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                                    onChange={(e) => {
                                        if (e.target.checked) setSelectedUsers(mockUsers.map(u => u.id));
                                        else setSelectedUsers([]);
                                    }}
                                />
                            </th>
                            <th className="py-4 px-6">User Details</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6">Joined Date</th>
                            <th className="py-4 px-6 text-center w-16">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                        {mockUsers.map((user) => {
                            const isChecked = selectedUsers.includes(user.id);
                            return (
                                <tr
                                    key={user.id}
                                    className={`hover:bg-slate-50/50 transition-colors ${isChecked ? 'bg-purple-50/30' : ''}`}
                                >
                                    <td className="py-4 px-6">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleSelectUser(user.id)}
                                            className="rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                                        />
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                                />
                                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800 text-sm">{(user as any).fullName || user.username}</div>
                                                <div className="text-xs text-slate-400 font-normal">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">{getRoleBadge(user.roles)}</td>
                                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${
                          user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.status}
                      </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-500 font-medium">{formatDate(user.createdAt)}</td>
                                    <td className="py-4 px-6 text-center">
                                        <button className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}